import * as dotenv from 'dotenv'
dotenv.config()

import { Pinecone } from '@pinecone-database/pinecone'
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

const crushPredefinedData = [

  // ═══ CRUSH STAGES ═══
  "Stage 1 is the Eye Contact and Vibe Check phase. You have confirmed they are attractive and your brain chemistry is interested, but you do not actually know them yet. Stage 2 is the FBI Background Check where you are actively collecting data about them like a detective. Stage 3 is when you have caught feelings and logic has left the building.",

  "Stage 4 is the Vulnerability Drop phase where the perfect first impression mask comes off and you start sharing real things about yourself. You are essentially testing to see if they run away. Stage 5 is Permanent Residency where they have moved into your brain rent free and are a staple of your daily routine.",

  // ═══ EARLY STAGE ADVICE ═══
  "In the early crush stages, the number one mission is to act natural and not scare the wildlife. Match their texting tempo. If they take two hours to reply, do not answer in two seconds. Keep it light, keep it fun. If they take a while to text back, they are not ignoring you. Do not let your brain write a whole tragedy over a delayed response.",

  "The attachment style trap with a new crush: The Anxious type overthinks everything and wants to send five follow up messages. The Avoidant type panics when they actually like someone and wants to disappear. The Secure type says they will text when they text and stays calm. Being aware of your attachment style is your superpower right now.",

  // ═══ LATE STAGE DATING ADVICE ═══
  "In the late dating stages, focus on date readiness and real world chemistry. For the anxious type on a date: focus on how you feel about them rather than auditioning to make them like you. For the avoidant type: stay present and let your guard down a little, vulnerability is actually attractive. For the secure type: keep bringing that grounded confident energy.",

  "Great date conversation topics to avoid awkward silence: Ask what they are secretly a massive nerd about because people light up talking about their passions. Ask where they would jump on a plane to tomorrow. Ask about the most chaotic funny thing that happened to them recently. Avoid standard interview questions like what do you do for work.",

  "The after date texting protocol: Do not play the wait three days game. Send a simple text within two hours of getting home saying you had a great time and you should do it again soon. This removes all guessing games, tells them you enjoyed their company, and leaves the door open for a second date.",

  // ═══ FLIRTING ADVICE ═══
  "The foundation of flirting is total presence. Drop your phone, stop overthinking your next line, and just arrive in the room. When you are fully present, your energy shifts from anxious audition energy to magnetic grounded confidence. You become perceptive to every tiny cue they are throwing at you.",

  "The push and pull of flirting creates playful tension. If you just agree with everything they say you are filling out a survey not flirting. Flirting needs friction. If they say they love pineapple on pizza, roll your eyes and say wow okay so you have terrible taste, good to know. This creates fun competitive energy that keeps them on their toes.",

  "Body language is eighty percent of flirting. Make eye contact, glance at their lips for a split second and look back up. Use a casual brief touch on their arm when they make you laugh. Mirror them by leaning in when they lean in. This subconsciously tells their brain you are on the same wavelength.",

  "The best flirts are incredible listeners. Pick up on a tiny detail they mentioned twenty minutes ago and throw it back at them. When you give someone your undivided hyper focused attention it makes them feel like the only person in the room. Flirting has a built in safety net because it is wrapped in jokes and banter, so if things get awkward you can both pretend you were just being friendly.",

  // ═══ L-BOMB TIMING ═══
  "You are ready to drop the L-bomb when the feeling is overflowing and keeping it inside feels harder than letting it out. Green lights: you have seen their flaws and love the real messy person, you feel safe and things are genuinely good, and the vibe is mutual through their consistent actions. Red lights: do not say it during or right after intimacy, to save a dying relationship, or via text message.",

  "The script for dropping the L-bomb if you are nervous: Say hey I just wanted to tell you that I have fallen in love with you. You do not have to say it back right now if you are not ready, but I just really wanted you to know how much you mean to me. This is confident, completely honest, and gives them emotional space to process without feeling cornered.",

  // ═══ MIXED SIGNALS ═══
  "Mixed signals are usually just a polite word for low interest or emotional unavailability. When someone likes you it is not a puzzle. Mixed signals happen when someone wants the benefits of your attention without the responsibility of commitment. The golden rule is: if you are constantly confused, that is the signal. Consistency is the only love language that matters.",

  "Back off signs that mean absolute rejection: They actively talk to you about other people they find attractive. Your long messages are met with one word replies and they never ask follow up questions. When you try to make plans they say they cannot but never offer an alternative day. They ignore you for days but slide in late at night only for validation.",

  "Green flags that mean they are genuinely interested: They text first and bring up date ideas, they are not the only one carrying the relationship. They remember tiny details you mentioned in passing. They open up about their own life and flaws creating real intimacy. They introduce you to their friends and do not keep you a secret. They casually mention future plans with you.",

  // ═══ EMOTIONALLY UNAVAILABLE CRUSH ═══
  "Signs someone loves you but is terrified of that love: The rubber band effect where they have an incredibly deep moment with you then immediately go cold or start a fight. They stare at you with adoration when they think you are not looking but look away when you catch them. They accidentally open up then immediately minimize what they said.",

  "What not to do when your crush is emotionally unavailable: Do not chase, beg, or demand answers. Do not try to fix or heal them because you cannot love someone out of their trauma. Do not sacrifice your own boundaries to make them comfortable. Do not let them treat you like a partner on Tuesday and a stranger on Thursday.",

  "What to do when your crush is emotionally unavailable: Acknowledge the pattern calmly once without anger. Match their energy and step back when they pull away. Give yourself a silent dignity expiration date in your head, tell yourself you will give this one month of calm low pressure space and if they cannot step up you are walking away.",

  // ═══ SELF SABOTAGE ═══
  "When you self sabotaged the connection by panicking and saying mean things or doing something to make them jealous: This explosion happened because there is a tender hidden wound inside you. When a connection has great potential for love, your nervous system registers that beauty as a threat and panics. You did not act out because you wanted to hurt them but because you were drowning in fear of not being worthy of this love.",

  "The self sabotage repair strategy: Do not spiral into a shame hole because shame says you are bad but accountability says you made a messy choice. Soothe your nervous system first before reaching out. Acknowledge the impact of your actions without making excuses. Offer a sincere zero pressure apology that takes full accountability and explains the fear.",

  "The vulnerable accountability script for self sabotage repair: Say hey I wanted to sincerely apologize for how I acted. To be honest I got incredibly overwhelmed by how much I care about you and my own fears kicked in. Instead of being vulnerable about that I panicked and pushed you away. You did not deserve that. There is no pressure to reply but I wanted to own my mistake.",

  // ═══ WHEN CRUSH SELF SABOTAGES ═══
  "When your crush self sabotages and starts acting distant and trying to push you away: Their behavior is a total reflection of their internal war. They hit the panic button because the intimacy scared them. Explanatory is not excusable. Knowing why they short circuited does not mean you have to accept being treated poorly. You are a romantic partner not a trauma therapist.",

  "The dignified boundary script when your crush sabotages: Say I am not going to lie, the way you handled things really hurt me. I brought genuine vulnerability to this and to be met with that behavior felt unfair. I understand if you are overwhelmed but I respect myself too much to be treated like that. I am going to take some space. If you ever want to have a mature conversation you know where to find me.",

  // ═══ OBSESSION AND STALKING ═══
  "When a crush becomes an obsession: Your brain's reward system is treating your crush like a drug. Every text glance or piece of information triggers dopamine. You are not a bad person, your brain's wiring has been temporarily hijacked by a compulsive loop. Obsession is an internal state with persistent involuntary thoughts. Stalking is an external behavior that crosses into tracking and monitoring their privacy.",

  "Breaking the obsession cycle: Do not check their profile just once because it resets your recovery clock to zero. Do not feed the fantasy by looping through imaginary conversations. Do not map out their routines. Instead focus heavily on your personal goals because when you have things you are proud of your brain has a healthy source of purpose. Mute or restrict their accounts to put friction between you and the urge.",

  // ═══ FEAR OF JUDGEMENT ═══
  "The truth about fear of judgement and people pleasing: Most people are not actually thinking about you at all. They are completely wrapped up in their own lives and worries. Even if you spent one hundred percent of your energy molding yourself into what others want, some people will still dislike you. By trying to please everyone you rob people of the chance to know the real you.",

  "Exercise for fear of judgement: Write down the exact judgment you are terrified of right now. Ask yourself what concrete evidence you have that they are judging you this way. Take the fear to its logical conclusion and ask what would actually change about your worth if they did judge you. Then pick one small low stakes situation today where you choose authenticity over approval.",

  // ═══ TOXIC PEOPLE ═══
  "Toxic people and energy vampires: They do not see people as individuals but as mirrors to reflect their desired importance. They target your vulnerabilities because your competence and kindness makes them feel small. Use the grey rock method and become as boring and unreactive as a plain grey rock. Give short factual emotionless responses to everything they say.",

  "Dealing with toxic colleagues or friends: Set rigid unbreakable boundaries and keep interactions strictly professional and brief. Do not argue or defend yourself because they thrive on drama and your reaction is their food. Do not try to fix or save them. Do not share your vulnerabilities because anything you share can be used as leverage later. Focus entirely on your own growth.",

  // ═══ COMEBACK LINES ═══
  "The return to sender comeback: When someone makes a passive aggressive comment make them explain it by playing dense. Say what an odd thing to say out loud, what did you mean by that. Or say I do not think I get the joke, could you explain it to us. This forces them to either double down and look malicious or backpedal and apologize.",

  "The calm mirror comeback: State exactly what they are doing in a flat matter of fact tone. Say that felt incredibly unnecessary, let us stick to the topic. Or say I am always open to feedback but not when it is delivered like that. This draws a hard line and alerts the group that a boundary has been crossed without you losing your composure.",

  "The grey rock deflection comeback: Treat petty comments like the most boring thing you have ever heard. Say okay followed by a long pause then turn to someone else and say anyway moving on. Or say wow glad you got that out of your system. This communicates that their opinion holds zero weight with you and you are not even giving them enough energy to argue.",

  // ═══ PHYSICAL SAFETY ═══
  "If your bully is making physical threats: You are no longer dealing with social friction but with mobbing and intimidation. Adopt a strict self defense mentality and prioritize your safety over politeness. Start a digital log noting the exact date time location what was said and who witnessed it. Screenshot every threatening message immediately.",

  "Escalation protocol for physical threats: Report to authority figures and create an official record. If the authority figure does nothing escalate to the next level up. If a teacher ignores you go to the principal. If HR ignores you go to upper management with a formal written grievance. If physical threats involve a weapon this is a criminal matter and you go directly to the police.",

  "Emergency protocol for immediate physical threat: Do not try to whisper or de escalate quietly. If a bully physically corners you or brandishes a weapon scream loudly to draw every eye in the vicinity to you. Loudly narrate the situation so the crowd understands the danger. Bullies thrive on secrecy and bringing immediate public light to their actions shatters their control.",
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

async function indexCrushPredefinedData() {
  console.log(
    'Starting crush predefined indexing...'
  )
  console.log(
    `Total chunks: ${crushPredefinedData.length}`
  )

  const vectors = []

  for (let i = 0; i < crushPredefinedData.length; i++) {
    const content = crushPredefinedData[i]
    console.log(
      `Processing chunk ${i + 1}/${crushPredefinedData.length}...`
    )

    try {
      const embedding =
        await generateEmbedding(content)

      vectors.push({
        id: `crush_predefined_${i}_v1`,
        values: embedding,
        metadata: {
          type: 'predefined_crush',
          userId: 'global',
          content: content,
          index: i,
        }
      })

      await sleep(500)

    } catch (error) {
      console.error(
        `Error processing chunk ${i}:`,
        error
      )
    }
  }

  const batchSize = 10
  for (
    let i = 0; 
    i < vectors.length; 
    i += batchSize
  ) {
    const batch = vectors.slice(
      i, i + batchSize
    )
    await index.upsert({ records: batch })
    console.log(
      `Upserted batch ${
        Math.floor(i / batchSize) + 1
      }`
    )
  }

  console.log(
    '✅ Crush predefined data indexed!'
  )
  console.log(
    `Total vectors: ${vectors.length}`
  )
}

indexCrushPredefinedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Indexing failed:', error)
    process.exit(1)
  })
