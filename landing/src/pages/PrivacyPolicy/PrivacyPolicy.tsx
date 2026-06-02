import { motion } from 'framer-motion';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPolicy() {
  return (
    <motion.div 
      className={styles.policyPage}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.policyTitle}>Privacy Policy</h1>
      <span className={styles.policyDate}>Last Updated: June 2026</span>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>1. Information We Collect</h2>
        <p className={styles.policyText}>
          At Daisy, your privacy is our absolute priority. We collect minimal information to provide and 
          optimize our psychological reflection services:
        </p>
        <ul className={styles.policyList}>
          <li><strong>Account Data:</strong> Simple email inputs or secure federated auth tokens if you create an optional profile.</li>
          <li><strong>Journal Contents:</strong> All your digital diary entries (text, sketches, photo attachments, voice records) are encrypted locally on your device. We do not index or read your personal journals.</li>
          <li><strong>AI Reflection Queries:</strong> Secure query payloads sent to our AI engines for generating compassionate responses in features like "Talk to Past" or "Talk to Crush".</li>
        </ul>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>2. How We Use Your Information</h2>
        <p className={styles.policyText}>
          We process inputs strictly to deliver customized app experiences:
        </p>
        <ul className={styles.policyList}>
          <li>To compile locally stored themed reflection spaces.</li>
          <li>To power conversational context layers for therapeutic advice.</li>
          <li>To secure your unlock capsules based on local timestamps.</li>
        </ul>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>3. Data Storage & Security</h2>
        <p className={styles.policyText}>
          All private journals remain strictly on your physical device. When AI processing is requested (e.g., chat advice), 
          payloads are encrypted in transit and processed statelessly. Your chat contexts are not saved, sold, or shared 
          with third-party training systems. We use industry-standard SSL encryption protocols for all backend server exchanges.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>4. Third Party Services</h2>
        <p className={styles.policyText}>
          Daisy utilizes secure infrastructure partners to run operations (such as Firebase for optional backups, and API services 
          for secure language models). These partners are strictly bound by confidentiality mandates and are legally barred 
          from utilizing your private context data for any secondary marketing purposes.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>5. Your Rights</h2>
        <p className={styles.policyText}>
          You maintain full ownership of your data. You may download your local journal archives, clear app storage caches, 
          or delete your account completely at any time from within the App Settings panel.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>6. Contact Us</h2>
        <p className={styles.policyText}>
          If you have questions regarding our data storage architectures or have inquiries about your rights, please reach out to us at:
          <br />
          <strong>Email:</strong> mery.the.psychologist@gmail.com
          <br />
          <strong>Location:</strong> Germany
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>7. Changes to This Policy</h2>
        <p className={styles.policyText}>
          We may update this privacy statement periodically to mirror operational adjustments or compliance requirements. 
          The "Last Updated" timestamp at the top of the page will reflect all active adjustments.
        </p>
      </div>
    </motion.div>
  );
}
