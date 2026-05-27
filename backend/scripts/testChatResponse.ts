import * as dotenv from 'dotenv'
dotenv.config()

import { generateChatResponse } from '../src/services/chatService'

async function runTest() {
  try {
    console.log("Sending test message to past (generateChatResponse)...")
    const response = await generateChatResponse(
      "test_user_id",
      "Alex",
      {
        section1: { q1: "A great friend", q2: "Kindness", q3: "Happy", q4: "My best self" },
        section2: { q1: "Mutual", q2: "Moved away", q3: "Said goodbye", q4: "Sadness", q5: "Time" },
        section3: { q1: "I miss you" },
        section4: { q1: "Happy reunion", q4: "Warm embrace", q5: "Joy" }
      },
      [],
      "Hi Alex, how have you been?"
    )
    console.log("SUCCESS RESPONSE:", response)
  } catch (error) {
    console.error("ERROR ENCOUNTERED:")
    console.error(error)
  }
}

runTest()
