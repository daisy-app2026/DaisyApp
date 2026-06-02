import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection for blurred background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, sectionId: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <Link to="/" className={styles.logo} onClick={handleLogoClick}>
          <img src="/assets/logo.png" alt="Daisy App Logo" className={styles.logoImg} />
          <span className={styles.logoText}>Daisy</span>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={styles.navLink} onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}>
              Home
            </Link>
          </li>
          <li>
            <a href="#features" className={styles.navLink} onClick={(e) => handleNavClick(e, 'features')}>
              Features
            </a>
          </li>
          <li>
            <a href="#about" className={styles.navLink} onClick={(e) => handleNavClick(e, 'about')}>
              About
            </a>
          </li>
          <li>
            <Link to="/contact" className={styles.navLink}>
              Contact
            </Link>
          </li>
        </ul>

        <div className={styles.rightSide}>
          <a href="#download" className={styles.downloadBtn} onClick={(e) => handleNavClick(e, 'download')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.downloadIcon}>
              <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
              <path d="M20 20H4v-2h16v2z"/>
            </svg>
            Download App
          </a>

          {/* Hamburger Icon */}
          <button 
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`${styles.hamburgerLine} ${styles.line1}`}></div>
            <div className={`${styles.hamburgerLine} ${styles.line2}`}></div>
            <div className={`${styles.hamburgerLine} ${styles.line3}`}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay using Framer Motion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className={styles.mobileOverlay}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ul className={styles.mobileNavLinks}>
              <li>
                <Link to="/" className={styles.mobileNavLink} onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, 'features')}>
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, 'about')}>
                  About
                </a>
              </li>
              <li>
                <Link to="/contact" className={styles.mobileNavLink}>
                  Contact
                </Link>
              </li>
              <li>
                <a href="#download" className={styles.downloadBtn} style={{ display: 'inline-flex', marginTop: '20px' }} onClick={(e) => handleNavClick(e, 'download')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.downloadIcon}>
                    <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
                    <path d="M20 20H4v-2h16v2z"/>
                  </svg>
                  Download App
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
