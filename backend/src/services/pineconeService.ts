import { pineconeIndex } from '../config/pinecone';
import { generateEmbedding } from './embeddingService';

// Index diary entry
export const indexDiaryEntry = async (
  userId: string,
  entryId: string,
  title: string,
  content: string,
  spaceId: string,
  spaceName: string,
  createdAt: string
): Promise<void> => {
  try {
    const text = `${title}. ${content}`;
    const embedding = await generateEmbedding(text);

    await pineconeIndex.upsert({
      records: [{
        id: `entry_${entryId}_${userId}`,
        values: embedding,
        metadata: {
          type: 'diary_entry',
          userId,
          entryId,
          title,
          content: content.slice(0, 500),
          spaceId,
          spaceName,
          createdAt,
        }
      }]
    });

    console.log(`Indexed entry: ${entryId}`);
  } catch (error) {
    console.error('Index entry error:', error);
    // Don't throw — entry still saved!
  }
};

// Index session answers (all sections)
export const indexSessionAnswers = async (
  userId: string,
  sessionId: string,
  personName: string,
  answers: Record<string, any>,
  type: 'section_answer' | 'crush_answer' = 'section_answer'
): Promise<void> => {
  try {
    const vectors = [];

    // Index ALL sections (up to 4)
    for (let i = 1; i <= 4; i++) {
      const section = answers[`section${i}`];
      if (!section) continue;

      const sectionText = Object.values(section)
        .filter(Boolean)
        .join('. ');

      if (!sectionText.trim()) continue;

      const embedding = await generateEmbedding(sectionText);

      vectors.push({
        id: `session_${sessionId}_s${i}_${userId}`,
        values: embedding,
        metadata: {
          type,
          userId,
          sessionId,
          personName,
          sectionNumber: i,
          content: sectionText.slice(0, 500),
        }
      });
    }

    if (vectors.length > 0) {
      await pineconeIndex.upsert({
        records: vectors
      });
      console.log(
        `Indexed ${vectors.length} sections for session ${sessionId} as ${type}`
      );
    }
  } catch (error) {
    console.error('Index session error:', error);
  }
};

// Search relevant context
export const searchContext = async (
  userId: string,
  query: string,
  topK: number = 5
): Promise<string[]> => {
  try {
    const queryEmbedding = await generateEmbedding(query);

    const results = await pineconeIndex.query({
      vector: queryEmbedding,
      topK,
      filter: {
        $or: [
          { userId: { $eq: userId } },
          { userId: { $eq: 'global' } }
        ]
      },
      includeMetadata: true,
    });

    return results.matches
      ?.filter(m => m.score && m.score > 0.3)
      .map(m => m.metadata?.content as string || '')
      .filter(Boolean) || [];

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Delete entry from Pinecone
export const deleteEntryFromPinecone = async (
  userId: string,
  entryId: string
): Promise<void> => {
  try {
    await pineconeIndex.deleteOne({
      id: `entry_${entryId}_${userId}`
    });
  } catch (error) {
    console.error('Delete error:', error);
  }
};
