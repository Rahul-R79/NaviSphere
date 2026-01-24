import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const findDestination = async (req, res) => {
  try {
    const { query, nodes } = req.body;

    if (!query || !nodes || nodes.length === 0) {
      return res.status(400).json({ message: 'Missing query or map nodes' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(503).json({ message: 'AI Service unconfigured (Missing API Key)' });
    }

    // Filter nodes to reduce token count and noise
    // Only send ID, Label, and Type (and maybe tags if we added them later)
    const simplifiedNodes = nodes
      .filter((n) => n.label && n.label.trim() !== '')
      .map((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
      }));

    if (simplifiedNodes.length === 0) {
      return res.status(404).json({ message: 'No labeled nodes found in this map' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an intelligent indoor navigation assistant.
      User Query: "${query}"
      
      Here is a list of available locations (nodes) on the map:
      ${JSON.stringify(simplifiedNodes)}
      
      Task: Identify the single best destination node ID that matches the user's intent.
      Rules:
      1. Return ONLY the "id" of the best matching node.
      2. If multiple match, pick the most logical one (e.g., "food" -> Canteen over Vending Machine).
      3. If absolutely no relevant match is found, return "null".
      4. Do not provide any explanation, just the ID string.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/['"`]/g, ''); // Clean up quotes

    if (text === 'null') {
      return res.json({ nodeId: null, message: 'No matching location found' });
    }

    // specific check if ID exists in our list roughly (sanity check)
    const matchedNode = simplifiedNodes.find((n) => n.id === text);

    if (matchedNode) {
      return res.json({ nodeId: matchedNode.id, label: matchedNode.label });
    } else {
      // Fallback: Gemini might have hallucinations or return extra text
      // Let's try to fuzzy match if exact ID fail, or just fail safely
      return res.json({ nodeId: null, message: 'AI returned invalid ID' });
    }
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
};
