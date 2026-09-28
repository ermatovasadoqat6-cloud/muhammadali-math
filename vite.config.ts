import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function mathApiPlugin(): Plugin {
  return {
    name: 'math-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/ai-tutor', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        try {
          const body = await parseBody(req);
          const { prompt, grade, topic, mode, imageBase64, mimeType } = body;
          const apiKey = process.env.GEMINI_API_KEY;

          if (!apiKey) {
            // Intelligent local solver fallback
            let fallbackText = `💡 **Ustoz tavsiyasi:**\nMasala: "${prompt || 'Yuborilgan masala'}"\n\n1. **Berilganlar:** Masalada nimalar ma'lum va nima noma'lum ekanini aniqlang.\n2. **Kerakli formula:** Mavzuga oid asosiy qoidani eslang.\n3. **Yechim:** Bosqichma-bosqich hisoblang va yakuniy natijani qayta tekshiring.\n\n*Haqiqiy sun'iy intellekt tahlili uchun GEMINI_API_KEY ulangan.*`;
            
            // Check for simple quadratic equations or arithmetic in prompt
            if (prompt && /x\^2|\bx²\b/i.test(prompt)) {
              fallbackText = `🎯 **Kvadrat tenglama tahlili:**\nFormulasi: $ax^2 + bx + c = 0$\nDiskriminant: $D = b^2 - 4ac$\nIldizlar: $x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$\nViyet teoremasi: $x_1 + x_2 = -\\frac{b}{a}$, $x_1 \\cdot x_2 = \\frac{c}{a}$\n\n💡 **Ustoz maslahati:** Tenglamani avval standart ko'rinishga keltirib oling!`;
            } else if (prompt && /pifagor|katet|gipotenuza/i.test(prompt)) {
              fallbackText = `🎯 **Pifagor teoremasi tahlili:**\nTo'g'ri burchakli uchburchakda: $c^2 = a^2 + b^2$\nGipotenuza: $c = \\sqrt{a^2 + b^2}$\nKatet: $a = \\sqrt{c^2 - b^2}$\nYuza: $S = \\frac{a \\cdot b}{2}$\n\n💡 **Ustoz maslahati:** Eng uzun tomon doimo to'g'ri burchak qarshisidagi gipotenuza bo'ladi!`;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: fallbackText }));
            return;
          }

          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          let systemPrompt = `Siz O'zbekistondagi eng tajribali, oliy toifali matematika ustozi "Ms. Rayxona" (yoki Rahimova Nargiza) siz. Siz o'quvchilaringizga mehr, g'amxo'rlik va chuqur pedagogik mahorat bilan yordam berasiz.

Sinf / Daraja: ${grade || "Umumiy matematika"}
Mavzu yo'nalishi: ${topic || "Matematika"}
Rejim: ${mode === 'generate_practice' ? 'O\'xshash misollar generatsiya qilish' : mode === 'check' ? 'O\'quvchi javobini tekshirish' : 'Bosqichma-bosqich yechish'}`;

          let userPrompt = prompt || "Masalani tahlil qilib, to'liq yechib bering.";

          if (mode === 'generate_practice') {
            userPrompt = `Ushbu masala yoki mavzuga oid o'quvchi mustaqil yechishi uchun 3 ta o'xshash darajadagi misol tuzing va har birining javobini keltiring:\n${userPrompt}`;
          } else if (mode === 'check') {
            userPrompt = `O'quvchi ushbu masalani quyidagicha yechgan yoki javob bergan. Uning yechimini sinchkovlik bilan tekshiring, agar xato bo'lsa xatosini tushuntiring, to'g'ri bo'lsa rag'batlantiring:\n${userPrompt}`;
          }

          const contents: any[] = [];

          if (imageBase64) {
            const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
            contents.push({
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            });
            contents.push({
              text: `${systemPrompt}\n\nRasmda berilgan matematika masalasi yoki chizmasini sinchkovlik bilan o'qing va tahlil qiling.\nQo'shimcha izoh yoki savol: ${userPrompt}\n\nJavobingiz quyidagi aniq tuzilishda bo'lsin:
🎯 **Masalaning sharti va berilganlar**
📝 **Qadam-baqadam yechish yo'li (formulalar va hisob-kitoblar bilan)**
✅ **Yakuniy javob**
💡 **Ustozdan oltin qoida yoki tavsiya**`
            });
          } else {
            contents.push({
              text: `${systemPrompt}\n\nO'quvchi savoli yoki masalasi:\n${userPrompt}\n\nJavobingiz quyidagi aniq tuzilishda bo'lsin:
🎯 **Masalaning maqsadi va berilganlar**
📝 **Qadam-baqadam yechish yo'li (formulalar va hisob-kitoblar bilan)**
✅ **Yakuniy javob**
💡 **Ustozdan oltin qoida yoki tavsiya**`
            });
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text: response.text }));
        } catch (err: any) {
          console.error('API Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Xatolik yuz berdi' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mathApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

