import * as dotenv from 'dotenv';
dotenv.config();

import * as readline from 'readline';
import { sendToAllUsers } from '../src/services/notificationService';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (q: string): Promise<string> => {
  return new Promise(resolve => {
    rl.question(q, resolve);
  });
};

async function main() {
  console.log('\n🌼 Daisy Notification Sender\n');
  console.log('─────────────────────────────');
  
  const title = await question('Enter title: ');
  const body = await question('Enter message: ');
  
  console.log('\n📱 Preview:');
  console.log(`Title: ${title}`);
  console.log(`Body: ${body}`);
  
  const confirm = await question('\nSend to ALL users? (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    console.log('\nSending...');
    await sendToAllUsers(title, body);
    console.log('✅ Done!');
  } else {
    console.log('Cancelled!');
  }
  
  rl.close();
  process.exit(0);
}

main().catch(console.error);
