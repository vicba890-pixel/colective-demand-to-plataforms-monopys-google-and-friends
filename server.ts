import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  app.post('/api/ocr-contract', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'No se recibió ninguna imagen del documento para procesar.' });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const resolvedMimeType = mimeType || 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: resolvedMimeType,
                data: cleanBase64
              }
            },
            {
              text:
                'Extrae con precisión todo el texto legal visible en esta imagen de contrato o términos de servicio. ' +
                'Además, realiza un dictamen jurídico forense identificando si contiene cláusulas abusivas (exención de responsabilidad, venta de humo, arbitraje forzoso, modificación unilateral o expropiación de datos).'
            }
          ]
        },
        config: {
          systemInstruction:
            'Eres un auditor jurídico forense especializado en derecho del consumidor digital, nulidad de contratos de adhesión y legislación antimonopolio (FTC Act § 5, Sherman Act 15 U.S.C. §§ 1-2, 18 U.S.C. § 1343 Wire Fraud y Restatement Second of Contracts § 195). Responde siempre en español y en formato JSON estructurado.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedText: {
                type: Type.STRING,
                description:
                  'Transcripción literal completa del texto legal visible en la fotografía del contrato físico. Si la imagen no contiene texto legible, indícalo claramente.'
              },
              detectedClauseTitle: {
                type: Type.STRING,
                description: 'Título jurídico conciso que califica la cláusula o el texto extraído.'
              },
              detectedCategory: {
                type: Type.STRING,
                description:
                  'Categoría principal: Exención de Responsabilidad, Arbitraje Forzoso, Modificación Unilateral, Publicidad Engañosa, o Expropiación de Datos.'
              },
              legalFraudAnalysis: {
                type: Type.STRING,
                description:
                  'Explicación jurídica de por qué esta cláusula constituye o no un abuso o fraude legal contra el consumidor.'
              },
              statutoryPrecedent: {
                type: Type.STRING,
                description:
                  'Estatutos, artículos o precedentes aplicables (ej. FTC Act § 5, Restatement Second of Contracts § 195, UCC § 2-302).'
              },
              criminalCivilLiability: {
                type: Type.STRING,
                description:
                  'Consecuencias legales, nulidad de pleno derecho o responsabilidad civil/penal exigible.'
              },
              severityScore: {
                type: Type.INTEGER,
                description: 'Puntuación de severidad o riesgo para el consumidor entre 1 y 100.'
              }
            },
            required: [
              'extractedText',
              'detectedClauseTitle',
              'detectedCategory',
              'legalFraudAnalysis',
              'statutoryPrecedent',
              'criminalCivilLiability',
              'severityScore'
            ]
          }
        }
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error en /api/ocr-contract:', error);
      const status = error?.status || 500;
      const message =
        error?.message ||
        'Error al procesar la imagen del contrato en el servidor. Verifique la conexión o la configuración de su clave en Settings > Secrets.';
      return res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
