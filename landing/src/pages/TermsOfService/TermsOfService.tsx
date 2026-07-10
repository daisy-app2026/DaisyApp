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
      <span className={styles.policyDate}>Last Updated: July 2026</span>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>1. Acceptance of Terms</h2>
        <p className={styles.policyText}>
          By downloading, accessing, or using the Daisy app ("Service"), you agree to be bound by these
          Terms of Service ("Terms"). If you do not agree, please do not use the Service.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>2. Description of Service</h2>
        <p className={styles.policyText}>
          Daisy is a personal diary and self-reflection app. It offers journaling across themed spaces, and
          two AI-powered guided reflection features — "Breakup Closure" and "My Crush" — designed to help
          you process feelings through simulated conversation.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>3. Eligibility</h2>
        <p className={styles.policyText}>
          You must be at least 16 years old to use Daisy. By using the Service, you confirm that you meet
          this age requirement.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>4. User Content</h2>
        <p className={styles.policyText}>
          You retain ownership of the journal entries, voice recordings, photos, doodles, and other content
          you submit to the Service ("User Content"). Daisy does not claim ownership over your entries. You
          are responsible for the content you create and for keeping your account credentials secure.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>5. AI Features Disclaimer</h2>
        <p className={styles.policyText}>
          "Breakup Closure" and "My Crush" use artificial intelligence to simulate conversation based on
          information you provide. These conversations are AI-generated — they are not real people, and
          the "responses" do not reflect the thoughts or feelings of any real individual.
        </p>
        <p className={styles.policyText}>
          <strong>Important:</strong> Daisy is a self-reflection journaling tool. It is not a substitute for
          professional psychological help, therapy, or medical treatment, and it cannot diagnose or treat
          any mental health condition. If you are experiencing a mental health crisis or thoughts of
          self-harm, please contact your local emergency services or a crisis helpline immediately.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>6. Your Account</h2>
        <p className={styles.policyText}>
          You are responsible for maintaining the confidentiality of your account. You may delete your
          account and all associated data at any time from within the app (Profile → Delete My Account).
          We may suspend or terminate accounts that violate these Terms or pose a security risk to the
          Service.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>7. Cost of the Service</h2>
        <p className={styles.policyText}>
          Daisy is currently free to use, with no paid subscriptions or in-app purchases. If this changes in
          the future, we will update these Terms and clearly notify users before introducing any paid
          features.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>8. Prohibited Use</h2>
        <p className={styles.policyText}>
          You agree not to use the Service for any unlawful purpose, to harass others, to attempt to gain
          unauthorized access to our systems, or to misuse the AI features in ways designed to bypass their
          intended safety behavior.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>9. Limitation of Liability</h2>
        <p className={styles.policyText}>
          To the maximum extent permitted by law, Daisy and its developer are not liable for any indirect,
          incidental, or consequential damages arising from your use of, or inability to use, the Service,
          including reliance on AI-generated responses.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>10. Governing Law</h2>
        <p className={styles.policyText}>
          These Terms are governed by the laws of Germany, without regard to conflict of law principles.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>11. Changes to These Terms</h2>
        <p className={styles.policyText}>
          We may update these Terms from time to time. Continued use of the Service after changes take
          effect constitutes acceptance of the updated Terms.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>12. Contact Us</h2>
        <p className={styles.policyText}>
          For questions about these Terms, contact us at:
          <br />
          <strong>Email:</strong> mery.the.psychologist@gmail.com
          <br />
          <strong>Location:</strong> Germany
        </p>
      </div>
    </motion.div>
  );
}