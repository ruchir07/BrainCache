import { pipeline } from "@xenova/transformers";

let embedder: any = null;

export async function generateEmbeddingText(text: string): Promise<number[]> {
  try {
    // Load model once
    if (!embedder) {
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    // Get token embeddings (shape: [tokens][dimensions])
    const output = await embedder(text); // typically returns an array of arrays

    if (!Array.isArray(output) || !Array.isArray(output[0])) {
      throw new Error('Unexpected embedding output format');
    }

    const tokenEmbeddings: number[][] = output;

    // Mean Pooling across tokens
    const vector = tokenEmbeddings[0].map((_, i) => {
      const sum = tokenEmbeddings.reduce((acc, tokenVec) => acc + tokenVec[i], 0);
      return sum / tokenEmbeddings.length;
    });

    return vector;
  } catch (err) {
    console.error("❌ Embedding failed:", err);
    throw err;
  }
}
