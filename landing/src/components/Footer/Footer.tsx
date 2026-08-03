import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();

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
          <img src="/assets/logo.png" alt="Daisy App Logo" className={styles.logoImg} loading="lazy" style={{ objectFit: 'cover' }} />
          <span className={styles.logoText}>Daisy</span>
        </Link>
        <p className={styles.tagline}>
          {t('footer.tagline')}
        </p>
      </div>

      {/* Pages links */}
      <ul className={styles.footerLinks}>
        <li>
          <Link to="/privacy" className={styles.footerLink} onClick={handleScrollToTop}>
            {t('nav.privacy')}
          </Link>
        </li>
        <li>
          <Link to="/terms" className={styles.footerLink} onClick={handleScrollToTop}>
            {t('nav.terms')}
          </Link>
        </li>
      </ul>

      {/* Copyright */}
      <div className={styles.footerCopy}>
        © {new Date().getFullYear()} {t('footer.rights')}
      </div>
    </footer>
  );
}
