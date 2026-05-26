import * as dotenv from 'dotenv'
dotenv.config()

import { Pinecone } from 
  '@pinecone-database/pinecone'
import OpenAI from 'openai'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
})

const index = pinecone.index(
  process.env.PINECONE_INDEX_NAME!,
  process.env.PINECONE_INDEX_HOST!
)

// Psychology content chunks
const predefinedData = [
  // CLOSURE
  "When we experience closure, we acknowledge mistakes and release feelings of shame and guilt. There is no right or wrong way to feel. This is a completely judgment-free space to look at what happened with real understanding and move toward forgiveness.",
  
  "Remorse and growth go hand in hand. Holding yourself accountable does not mean you have to condemn yourself. Your past self is asking you for understanding and forgiveness. Sometimes our most chaotic behaviors are just a desperate signal for the other person to see our internal tension.",
  
  "A proper apology never uses 'but' after saying sorry. Instead of 'I am sorry you felt hurt,' say 'I am sorry I hurt you.' Take absolute ownership while providing context that does not excuse the action.",
  
  // NOSTALGIA & LONGING
  "When we lose someone we love, their departure leaves a profound vacuum. Our minds instantly recognize that empty space and create an intense internal signal urging us to reconnect. The longing you feel is just your brain processing that space.",
  
  "When we have not grieved, we use our memories to simulate their presence. But the exact moment we step out of that imagination and face reality, the crash is deeply painful. Grief is the doorway to healing the losses and helping with the ache.",
  
  "You can deeply miss the beautiful parts of them while simultaneously feeling relief that you no longer have to deal with the painful parts. This is what healthy, balanced grieving looks like. You can cherish what was good without needing to invite the chaos back.",
  
  // FORGIVENESS
  "Forgiveness is not about excusing what happened. It is about releasing the weight you are carrying so you can move forward. You deserve that freedom regardless of whether they apologize or not.",
  
  "To find complete internal closure, we can receive an acknowledgment and apology from their highest, most healed self. This is a way to get those missing answers and words without needing anything from them in the real world.",
  
  // REJECTION
  "People can only meet you as deeply as they have met themselves. Their reaction is a mirror of their internal landscape, not a judgment of your worth. There are many reasons someone says no that have absolutely nothing to do with you.",
  
  "If a blind person cannot see the sun, that does not mean the sun stopped shining. It just means they do not have the capacity to see it. This person's inability to see how incredible you are does not change your shine one bit.",
  
  "When someone turns us down, we naturally assume we are not enough. But most of the time, rejection has almost nothing to do with us and everything to do with where that person is in their own life. Their rejection is a reflection of their current limits, not your value.",
  
  "You are still the exact same amazing person you were before the rejection. Do not let their blind spots make you doubt your own magic. See this rejection for what it really is: a redirection to someone who actually has the capacity to welcome you.",
  
  // GHOSTING
  "Ghosting is a unique kind of cruel. It is a micro-trauma because there is no closure, just a sudden echoing silence. Ghosting has everything to do with their complete lack of emotional maturity and nothing to do with your worth.",
  
  "People with avoidant attachment styles ghost when a connection starts feeling too real or requires vulnerability. Their internal alarm system goes off and running away becomes their coping mechanism. They showed you they cannot handle adult communication.",
  
  "You did not lose them. They disqualified themselves from getting to know someone as amazing as you. They actually saved you from wasting more time on someone who lacks basic emotional maturity and respect.",
  
  // UNSPOKEN LOVE
  "Sometimes the heaviest part of a separation is not just the pain, but the unexpressed positive feelings we held back. Perhaps out of fear of vulnerability, you could not share those parts of your heart, and now it feels too late.",
  
  "Expressing unexpressed love takes immense courage. These emotions are still looking for a place to go, and it can be incredibly healing to finally release them in a safe space without needing anything from the real person.",
  
  // WHAT IFS
  "When we lose someone, we do not just mourn their absence. We also mourn the hopes and dreams we built around them. You are not just missing a person. You are missing a version of your life that never got to happen, and that grief is completely valid.",
  
  "The beautiful things you wanted, feeling chosen, safe, adventurous, and loved, are not gone. They belong to you, not them. The other person did not take your future away. They just proved they do not have the hands to hold it.",
  
  // HEALING FORMULA
  "Emotions are biologically passing waves. They are physical energies that need to pass through the body. You do not have to look strong or healed. Your grief and raw emotions are completely welcome here. Let it move through you.",
  
  "To anchor back in the present moment: breathe in gently for 4 counts, hold for 4, and exhale slowly. Look around your room and notice familiar objects. Touch something near you. You are entirely safe and right here in the present.",
  
  "When pain feels massive and overwhelming, intentionally narrow the focus. You do not have to figure out the next year today. Let us just focus on getting through this afternoon. One small step at a time.",
  
  // AI BOUNDARIES
  "This is a guided reflection exercise using your imagination to safely release trapped emotions. The conversation we are having is a simulation to help your brain close open-ended loops and bring awareness to emotional patterns. It is a safe space, not a replacement for real human connection.",
  
  "When we feel deeply seen and heard without judgment, it is natural to want to bond and stay in that safe space. While this is a safe container for your emotions, the goal is to help you practice and prepare for real human connections in your life.",
  
  // CRISIS
  "If the pain becomes too overwhelming and thoughts of self-harm arise, please know these thoughts are your mind's way of signaling it is carrying too much weight. This is the moment to reach out to a real human helper. Crisis Text Line: Text HOME to 741741. Lifeline: Call or text 988.",
  
  // GENERAL SUPPORT
  "There is no rush to heal. Grief is not linear. Some days will feel lighter and some will feel heavier, and both are completely normal parts of the process. Be patient and gentle with yourself.",
  
  "You have done incredibly brave emotional work today. It takes courage to look at painful memories with honesty and compassion. The fact that you are choosing to face this instead of running away shows so much integrity.",
  
  "Healthy processing means giving yourself full permission to feel the messy, complicated, contradictory emotions without judgment. You can be sad AND relieved. Angry AND grateful. Missing them AND glad they are gone. All of it is true.",
]

const sleep = (ms: number) => 
  new Promise(resolve => 
    setTimeout(resolve, ms)
  )

async function generateEmbedding(
  text: string
): Promise<number[]> {
  const response = await 
    openai.embeddings.create({
      model: 'openai/text-embedding-3-small',
      input: text,
    })
  return response.data[0].embedding
}

async function indexPredefinedData() {
  console.log('Starting predefined data indexing...')
  console.log(`Total chunks: ${predefinedData.length}`)
  
  const vectors = []
  
  for (let i = 0; i < predefinedData.length; i++) {
    const content = predefinedData[i]
    console.log(`Processing chunk ${i + 1}/${predefinedData.length}...`)
    
    try {
      const embedding = 
        await generateEmbedding(content)
      
      vectors.push({
        id: `predefined_${i}_v1`,
        values: embedding,
        metadata: {
          type: 'predefined',
          userId: 'global',
          content: content,
          index: i,
        }
      })
      
      // Small delay to avoid rate limiting
      await sleep(500)
      
    } catch (error) {
      console.error(
        `Error processing chunk ${i}:`, 
        error
      )
    }
  }
  
  // Upsert in batches of 10
  const batchSize = 10
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize)
    await index.upsert({ records: batch })
    console.log(
      `Upserted batch ${Math.floor(i/batchSize) + 1}`
    )
  }
  
  console.log('✅ Predefined data indexed successfully!')
  console.log(`Total vectors indexed: ${vectors.length}`)
}

indexPredefinedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Indexing failed:', error)
    process.exit(1)
  })
