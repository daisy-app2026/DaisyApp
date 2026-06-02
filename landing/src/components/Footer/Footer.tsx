import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      {/* Brand & Tagline area */}
      <div className={styles.leftCol}>
        <Link to="/" className={styles.footerLogo} onClick={handleScrollToTop}>
          <img src="/assets/logo.png" alt="Daisy App Logo" className={styles.logoImg} />
          <span className={styles.logoText}>Daisy</span>
        </Link>
        <p className={styles.tagline}>
          Your safe space to heal, reflect & grow. Founded by a psychologist.
        </p>
      </div>

      {/* Pages links */}
      <ul className={styles.footerLinks}>
        <li>
          <Link to="/privacy" className={styles.footerLink} onClick={handleScrollToTop}>
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/terms" className={styles.footerLink} onClick={handleScrollToTop}>
            Terms of Service
          </Link>
        </li>
        <li>
          <Link to="/contact" className={styles.footerLink} onClick={handleScrollToTop}>
            Contact Us
          </Link>
        </li>
      </ul>

      {/* Copyright */}
      <div className={styles.footerCopy}>
        © {new Date().getFullYear()} Daisy. All rights reserved.
      </div>
    </footer>
  );
}
