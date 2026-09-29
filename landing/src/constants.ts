// Central configuration for all external links and media assets.
// Meriem can easily replace these placeholders with live Cloudinary/Store links!
export const LINKS = {
  // App Store Download URL
  appStore: 'https://apps.apple.com/in/app/daisy-your-safe-space/id6801609261',

  // Play Store Download URL
  playStore: 'https://play.google.com/store/apps/details?id=com.daisyapp.mobile',

  // APK direct download URL
  apkDownload: 'https://expo.dev/artifacts/eas/PWHg4wYLHZQf51CVBkrl6XToyC1ZEVIgJKXbAM7bfks.apk',

  // Cloudinary founder profile image (currently pointing to our pre-generated asset!)
  founderPhoto: 'https://res.cloudinary.com/diylru5iv/image/upload/v1781181073/589901796_17842435368640534_1995779922354039761_n_xypxne.jpg',

  // Cloudinary digital diary screen mockup
  diaryScreenshot: 'https://drive.google.com/thumbnail?id=1gJzewCleyyU769nqCqBfTg7HL0hrFVa_&sz=w800',

  // Cloudinary Talk to Past chat mockup
  talkToPastScreenshot: 'https://drive.google.com/thumbnail?id=1b3peuVihYlNr1Rm_rWGBBEbfdsuJYNJR&sz=w800',

  // Cloudinary Talk to Crush chat mockup
  talkToCrushScreenshot: 'https://drive.google.com/thumbnail?id=1SEjGxaJc2JDvhNTG-zFZg9qsogjso3lz&sz=w800',

  // Cloudinary demonstration video
  demoVideo: 'https://res.cloudinary.com/diylru5iv/video/upload/v1785828527/WhatsApp_Video_2026-08-03_at_22.48.10_wgigra.mp4',
};

export interface PlanFromBackend {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalYearlyPrice?: number;
  discountPercent?: number;
  chatLimit: number | string;
  messageLimit: number | string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export const DEFAULT_PLANS: Record<'free' | 'basic' | 'pro', PlanFromBackend> = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    originalYearlyPrice: 0,
    discountPercent: 0,
    chatLimit: 3,
    messageLimit: 30,
    features: [
      'Unlimited diary journaling',
      '3 AI chats total',
      '30 messages total',
      'Memory capsule',
      '5 spaces',
    ],
    isPopular: false,
    isActive: true,
  },
  basic: {
    name: 'Basic',
    monthlyPrice: 8.99,
    yearlyPrice: 86.30,
    originalYearlyPrice: 107.88,
    discountPercent: 20,
    chatLimit: 10,
    messageLimit: 150,
    features: [
      'Unlimited diary journaling',
      '10 AI chats/month',
      '150 messages/month',
      'Audio entries',
      'Image entries',
      'Doodle entries',
    ],
    isPopular: true,
    isActive: true,
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 14.99,
    yearlyPrice: 143.90,
    originalYearlyPrice: 179.88,
    discountPercent: 20,
    chatLimit: -1,
    messageLimit: 500,
    features: [
      'Unlimited diary journaling',
      'Unlimited AI chats',
      '500 messages/month',
      'Priority support',
      'Early access to features',
    ],
    isPopular: false,
    isActive: true,
  },
};
