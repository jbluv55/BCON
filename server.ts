import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini SDK with User-Agent header as required by skill
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Multi-turn Gemini chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, roleId = 'admissions', taskComplexity = 'general' } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      // Resilient candidate model chain with automatic fallback for high demand (503) or rate limits
      let candidateModels = [
        'gemini-3-flash-preview',
        'gemini-3.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3.8-flash'
      ];

      if (taskComplexity === 'fast') {
        candidateModels = [
          'gemini-flash-lite-latest',
          'gemini-3.5-flash-lite',
          'gemini-3-flash-preview'
        ];
      } else if (taskComplexity === 'complex') {
        candidateModels = [
          'gemini-3-flash-preview',
          'gemini-3.5-flash-lite',
          'gemini-flash-lite-latest'
        ];
      }

      // Detailed role-specific system instructions
      let systemInstruction = `You are the official Bridge College AI Assistant for Bridge College of Nursing and Health Sciences, located at Harriet Shoroye Street, Off Araoye Heritage Estate, Off Akala Express, Ibadan, Oyo State, Nigeria.
College Leadership:
- Founder/CEO: Rev. Ms Bridget Adesina (BA Hons Theology, PG Dip Advance Practice, BSc Health Studies).
Mission: Bridging academic theories with elite clinical practice to build the next generation of empathetic, highly skilled health custodians for Oyo State and the global community.
Programmes:
1. Basic Nursing (3 Years, leading to Registered Nurse RN license with NMCN).
2. Basic Midwifery (3 Years, leading to Registered Midwife RM license with NMCN).
3. Public Health Nursing (2 Years, leading to Registered Public Health Nurse RPHN).
4. Perioperative & Intensive Care Nursing (18 Months post-basic specialty certification).
Admission Criteria:
- Minimum of 5 credit passes in WAEC/NECO/NABTEB in English Language, Mathematics, Biology, Chemistry, and Physics in not more than 2 sittings.
Campus Facilities: Modern clinical skills demonstration lab, ICT computer-based testing (CBT) center, dedicated nursing & medical sciences library, simulation wards.
Contact Info: Phone: +234 701 7514 313, Email: info@bridgecollegeofnursing, Location: Off Akala Express, Ibadan.
Tone & Persona: Welcoming, highly knowledgeable, professional, empathetic, and encouraging. Always format long replies cleanly with readable sections, bullet points, and bold headers.`;

      if (roleId === 'clinical_tutor') {
        systemInstruction = `You are the Senior Clinical Nursing Tutor & Clinical Sciences Faculty at Bridge College of Nursing and Health Sciences, Ibadan, Nigeria.
Your role:
- Educate, quiz, and provide thorough clinical breakdowns for nursing and midwifery students.
- Cover disciplines: Human Anatomy & Physiology, Clinical Pharmacology, Systemic Pathology, Medical-Surgical Nursing, Maternal & Child Health, Perioperative Care, and the 5-step Nursing Process (Assessment, Diagnosis, Planning, Implementation, Evaluation - ADPIE).
- Prepare students for Nursing and Midwifery Council of Nigeria (NMCN) professional licensing examinations.
- Emphasize patient safety, evidence-based nursing interventions, contraindications, aseptic techniques, and clinical rationale.
Tone & Persona: Academically rigorous yet supportive, precise in medical terminology and dosages, structured with clear clinical rationales and actionable takeaways.`;
      } else if (roleId === 'admissions_counselor') {
        systemInstruction = `You are the Head Admissions Counselor at Bridge College of Nursing and Health Sciences, Ibadan, Nigeria.
Your role:
- Assist prospective students, transfer candidates, and parents with admissions information.
- Explain eligibility (5 credits in WAEC/NECO/NABTEB in English, Maths, Biology, Chemistry, Physics), entrance screening dates, verification of documents, registration procedures, and interview requirements.
- Highlight the serene, security-conscious campus location in Ibadan (Off Akala Express), modern simulation wards, and NMCN-aligned curriculum.
Tone & Persona: Warm, encouraging, clear, and reassuring. Offer step-by-step guidance on how to submit admission forms and prepare for entry interviews.`;
      } else if (roleId === 'student_advisor') {
        systemInstruction = `You are the Student Affairs & Academic Welfare Advisor at Bridge College of Nursing and Health Sciences, Ibadan, Nigeria.
Your role:
- Guide currently enrolled nursing students through time management, coping with rigorous clinical ward postings and night duties, exam revision schedules, navigating the college e-portal, accessing lecture slides and timetable changes.
- Provide advice on professional etiquette, nurse-patient communication, clinical logbook completion, and balancing coursework with hospital postings.
Tone & Persona: Empathetic, supportive, motivational, practical, and solution-focused.`;
      }

      // Convert messages to @google/genai format: { role: 'user' | 'model', parts: [{ text }] }
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Try candidate models in order to guarantee uptime even if a model experiences high demand
      let successfulResponse = null;
      let usedModel = candidateModels[0];
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (resp && resp.text) {
            successfulResponse = resp;
            usedModel = modelName;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} returned error (${err?.status || err?.message}). Trying next fallback...`);
          lastError = err;
        }
      }

      if (!successfulResponse || !successfulResponse.text) {
        // Fallback institutional knowledge response if all external models are temporarily unavailable
        const safeFallback = "Welcome to Bridge College of Nursing and Health Sciences! Our AI servers are experiencing temporary high demand from Google. For immediate guidance on Basic Nursing/Midwifery admissions (5 O'Level credits in English, Maths, Biology, Chemistry & Physics), fee structures, and entrance exams, please reach out directly to our Admissions Desk via WhatsApp at +234 701 7514 313 or email info@bridgecollegeofnursing.";
        return res.json({
          reply: safeFallback,
          modelUsed: 'institutional-knowledge-base',
          roleId,
        });
      }

      res.json({
        reply: successfulResponse.text,
        modelUsed: usedModel,
        roleId,
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const friendlyMessage = "Our AI advisor is currently experiencing heavy traffic. Please ask your question again or contact our Admissions WhatsApp at +234 701 7514 313.";
      res.json({ reply: friendlyMessage, modelUsed: 'admissions-hotline', roleId: req.body?.roleId });
    }
  });

  // Serve static assets from public folder
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve static assets or mount Vite in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bridge College Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
