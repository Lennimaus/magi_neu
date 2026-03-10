# MAGI System

NGE-inspired interface querying three LLMs simultaneously via Groq.

- MELCHIOR·1 → Llama 3.3 70B (Logik)
- BALTHASAR·2 → Mixtral 8x7B (Strategie)
- CASPER·3 → Gemma 2 9B (Intuition)

## Deploy auf Vercel

1. Lade diesen Ordner auf GitHub hoch (neues Repository)
2. Geh auf vercel.com → "Add New Project" → GitHub Repo auswählen
3. Unter "Environment Variables": `GROQ_API_KEY` = dein Key
4. Deploy klicken → fertig

## Lokal testen

```bash
npm install
# .env.local erstellen mit: GROQ_API_KEY=dein_key
npm run dev
```
