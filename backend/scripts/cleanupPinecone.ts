import * as dotenv from 'dotenv'
dotenv.config()

import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

async function cleanup() {
  console.log(
    '\n🌼 Daisy Pinecone Cleanup\n'
  )
  console.log('─────────────────────────')

  const index = pinecone.index(
    process.env.PINECONE_INDEX_NAME!,
    process.env.PINECONE_INDEX_HOST!
  )

  try {
    // Delete diary entries
    console.log(
      'Deleting diary entries...'
    )
    await index.deleteMany({
      filter: {
        type: { $eq: 'diary_entry' }
      }
    })
    console.log('✅ Diary entries deleted!')

    // Delete section answers
    console.log(
      'Deleting section answers...'
    )
    await index.deleteMany({
      filter: {
        type: { 
          $eq: 'section_answer' 
        }
      }
    })
    console.log(
      '✅ Section answers deleted!'
    )

    // Delete crush answers
    console.log(
      'Deleting crush answers...'
    )
    await index.deleteMany({
      filter: {
        type: { 
          $eq: 'crush_answer' 
        }
      }
    })
    console.log(
      '✅ Crush answers deleted!'
    )

    console.log('\n─────────────────────────')
    console.log(
      '✅ Cleanup complete!'
    )
    console.log(
      'Predefined data kept! ✅'
    )

  } catch (error) {
    console.error('Error:', error)
  }

  process.exit(0)
}

cleanup()
