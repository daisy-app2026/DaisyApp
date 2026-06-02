import { motion } from 'framer-motion';
import styles from './TermsOfService.module.css';

export default function TermsOfService() {
  return (
    <motion.div 
      className={styles.policyPage}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.policyTitle}>Terms of Service</h1>
      <span className={styles.policyDate}>Last Updated: June 2026</span>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>1. Acceptance of Terms</h2>
        <p className={styles.policyText}>
          By downloading, accessing, or using the Daisy App ("Service"), you agree to be bound by these 
          Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>2. Use of Service</h2>
        <p className={styles.policyText}>
          Daisy is a personal reflection and self-guided journaling tool. You are permitted to use this 
          Service for personal, non-commercial purposes. You agree to use the Service in complete compliance 
          with local, national, and international laws.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>3. User Content</h2>
        <p className={styles.policyText}>
          You own all rights to the thoughts, journals, voice recordings, doodles, and inputs you submit 
          to the Service ("User Content"). Daisy does not claim any ownership over your entries. You are solely 
          responsible for securing and backing up your User Content.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>4. AI Features Disclaimer</h2>
        <p className={styles.policyText}>
          Daisy includes features ("Talk to Past", "Talk to Crush") powered by advanced generative AI logic 
          designed to assist in self-reflection and dialogue practice.
        </p>
        <p className={styles.policyText}>
          <strong>CRITICAL NOTICE:</strong> Daisy does NOT provide clinical medical services or professional 
          psychological diagnosis. The Service is a self-care journaling tool, not a substitute for certified 
          therapy or psychiatric medical treatments. If you are experiencing severe distress, please contact 
          local clinical emergency hotlines immediately.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>5. Subscription & Payments</h2>
        <p className={styles.policyText}>
          Certain optional core expansions within Daisy may require standard payments or monthly subscriptions. 
          All subscription charges, payments, and cancellations are handled securely via third-party application 
          stores (Apple App Store, Google Play Store).
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>6. Termination</h2>
        <p className={styles.policyText}>
          We reserve the right to suspend or terminate your access to our Service at any time, with or without notice, 
          for actions that violate these terms or present operational security risks.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>7. Limitation of Liability</h2>
        <p className={styles.policyText}>
          To the maximum extent permitted by law, Daisy and its developer networks are not liable for any direct, indirect, 
          incidental, or consequential damages resulting from your use, inability to use, or reliance on data 
          provided by the Service.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>8. Contact Us</h2>
        <p className={styles.policyText}>
          For feedback, legal clarification, or general inquiries regarding these Terms, please connect with us:
          <br />
          <strong>Email:</strong> mery.the.psychologist@gmail.com
          <br />
          <strong>Location:</strong> Germany
        </p>
      </div>
    </motion.div>
  );
}
