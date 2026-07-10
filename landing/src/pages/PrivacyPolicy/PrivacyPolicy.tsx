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
      <span className={styles.policyDate}>Last Updated: July 2026</span>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>1. Who We Are</h2>
        <p className={styles.policyText}>
          Daisy is developed and operated by Meriem Tafsi, based in Germany. This Privacy Policy explains
          what information the Daisy app ("Service") collects, how it is used, where it is stored, and
          what rights you have over your data.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>2. Information We Collect</h2>
        <p className={styles.policyText}>
          To provide the Service, we collect the following:
        </p>
        <ul className={styles.policyList}>
          <li><strong>Account Data:</strong> Your email address, display name, and profile photo, collected via email/password sign-up or Google Sign-In (Firebase Authentication).</li>
          <li><strong>Journal Content:</strong> Diary entries you create, including text, voice recordings, photos, and doodles, and the space (e.g. Family, Bestie, Crush, Vent) you assign them to.</li>
          <li><strong>AI Conversation Data:</strong> The guided reflection answers and full message history from the "Breakup Closure" and "My Crush" features.</li>
          <li><strong>Usage & Device Data:</strong> App language preference, notification token (if notifications are enabled), and basic usage information needed to operate the app (e.g. entry streak, last activity date).</li>
        </ul>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>3. How We Use Your Information</h2>
        <ul className={styles.policyList}>
          <li>To create and maintain your account and journal.</li>
          <li>To generate AI responses in "Breakup Closure" and "My Crush", including using your past entries and conversation history as context so the AI can respond meaningfully.</li>
          <li>To send optional push notifications, if you have enabled them.</li>
          <li>To maintain and improve the reliability and security of the Service.</li>
        </ul>
        <p className={styles.policyText}>
          We do not sell your personal data, and we do not use your journal or conversation content for
          advertising.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>4. Where Your Data Is Stored & Third-Party Services</h2>
        <p className={styles.policyText}>
          Unlike purely on-device apps, Daisy stores your account and journal data on secure cloud
          infrastructure so it is available across your sessions and devices. We work with the following
          service providers, each bound by their own data protection obligations:
        </p>
        <ul className={styles.policyList}>
          <li><strong>Firebase (Google):</strong> Authentication and storage of your account details and journal entries (Firestore database).</li>
          <li><strong>Cloudinary:</strong> Storage of uploaded media — voice recordings, photos, and doodles attached to journal entries.</li>
          <li><strong>OpenAI:</strong> Processes your entries and conversation messages to generate AI responses and titles.</li>
          <li><strong>Pinecone:</strong> Stores vector representations ("embeddings") of your journal entries and AI conversation history, so that "Breakup Closure" and "My Crush" can refer back to relevant context in later conversations.</li>
          <li><strong>Render:</strong> Hosts our backend server, which securely connects the app to the services above.</li>
        </ul>
        <p className={styles.policyText}>
          These providers process data on our behalf under their own security and confidentiality
          obligations, and are not permitted to use your data for their own marketing purposes.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>5. International Data Transfers</h2>
        <p className={styles.policyText}>
          Some of our service providers (including Firebase, OpenAI, Cloudinary, and Pinecone) process data
          on servers located outside the European Economic Area, including in the United States. Where this
          occurs, we rely on appropriate safeguards recognized under GDPR, such as Standard Contractual
          Clauses, to protect your data.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>6. Memory Capsule & Data Retention</h2>
        <p className={styles.policyText}>
          If you lock an entry as a "Memory Capsule," it remains stored and simply hidden from view in the
          app until the unlock date you chose — it is not encrypted differently or stored separately. We
          retain your data for as long as your account is active. If you delete your account, your data is
          permanently removed as described in Section 8.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>7. Your Rights (GDPR)</h2>
        <p className={styles.policyText}>
          If you are located in the European Economic Area, you have the right to:
        </p>
        <ul className={styles.policyList}>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request erasure of your data ("right to be forgotten").</li>
          <li>Request a copy of your data in a portable format.</li>
          <li>Object to or request restriction of certain processing.</li>
          <li>Lodge a complaint with your local data protection supervisory authority.</li>
        </ul>
        <p className={styles.policyText}>
          To exercise any of these rights, contact us using the details in Section 10.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>8. Deleting Your Data</h2>
        <p className={styles.policyText}>
          You can permanently delete your account and all associated data — journal entries, uploaded media,
          and AI conversation history — at any time from Profile → Delete My Account within the app. This
          action is irreversible and removes your data from our authentication system, database, media
          storage, and AI context storage.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>9. Children's Privacy</h2>
        <p className={styles.policyText}>
          Daisy is not intended for children under the age of 16. We do not knowingly collect personal data
          from children under 16. If you believe a child has provided us with personal data, please contact
          us so we can delete it.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>10. Security</h2>
        <p className={styles.policyText}>
          We use industry-standard measures, including encryption in transit (HTTPS/TLS), to protect your
          data as it travels between your device and our servers. No method of storage or transmission is
          ever 100% secure, but we work to protect your information using practices appropriate to the
          sensitivity of journal and reflection content.
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>11. Contact Us</h2>
        <p className={styles.policyText}>
          For any questions about this Privacy Policy or to exercise your data rights, contact us at:
          <br />
          <strong>Email:</strong> mery.the.psychologist@gmail.com
          <br />
          <strong>Location:</strong> Germany
        </p>
      </div>

      <div className={styles.policySection}>
        <h2 className={styles.policySectionTitle}>12. Changes to This Policy</h2>
        <p className={styles.policyText}>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal
          requirements. The "Last Updated" date at the top of this page reflects the most recent revision.
        </p>
      </div>
    </motion.div>
  );
}