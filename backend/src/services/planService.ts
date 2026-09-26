import { db } from '../config/firebase';

export interface PlanLimit {
  chatLimit: number;
  messageLimit: number;
}

export interface PlansConfig {
  free: PlanLimit;
  basic: PlanLimit;
  pro: PlanLimit;
}

export const DEFAULT_PLANS_CONFIG: PlansConfig = {
  free: { chatLimit: 3, messageLimit: 30 },
  basic: { chatLimit: 10, messageLimit: 150 },
  pro: { chatLimit: 15, messageLimit: 500 },
};

export const getPlansConfig = async (): Promise<PlansConfig> => {
  try {
    const doc = await db.collection('config').doc('pricing').get();
    if (doc.exists) {
      const data = doc.data();
      const plans = (data?.plans || data) as Partial<PlansConfig>;
      return {
        free: { ...DEFAULT_PLANS_CONFIG.free, ...plans.free },
        basic: { ...DEFAULT_PLANS_CONFIG.basic, ...plans.basic },
        pro: { ...DEFAULT_PLANS_CONFIG.pro, ...plans.pro },
      };
    }
  } catch (err) {
    console.error('Error fetching config/pricing:', err);
  }
  return DEFAULT_PLANS_CONFIG;
};
