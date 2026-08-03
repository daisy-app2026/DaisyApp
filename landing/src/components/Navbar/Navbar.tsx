import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, LANGUAGES, type Language } from '../../context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const navigate = useNavigate();
  const location = useLocation();
  const langMenuRef = useRef<HTMLDivElement>(null);

  const activeLangOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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

  // Close menus on route changes or outside clicks
  useEffect(() => {
    setMenuOpen(false);
    setLangMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <Link to="/" className={styles.logo} onClick={handleLogoClick}>
          <img src="/assets/logo.png" alt="Daisy App Logo" className={styles.logoImg} loading="lazy" style={{ objectFit: 'cover' }} />
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
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <a href="#features" className={styles.navLink} onClick={(e) => handleNavClick(e, 'features')}>
              {t('nav.features')}
            </a>
          </li>
          <li>
            <a href="#about" className={styles.navLink} onClick={(e) => handleNavClick(e, 'about')}>
              {t('nav.about')}
            </a>
          </li>
        </ul>

        <div className={styles.rightSide}>
          {/* Controls: Theme Toggle & Language Selector */}
          <div className={styles.controlsGroup}>
            {/* Theme Toggle Button */}
            <button 
              className={styles.themeBtn} 
              onClick={toggleTheme}
              title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                /* Sun Icon for switching to light mode */
                <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                /* Moon Icon for switching to dark mode */
                <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className={styles.langDropdownWrapper} ref={langMenuRef}>
              <button 
                className={styles.langBtn} 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Select Language"
              >
                <span className={styles.langFlag}>{activeLangOption.flag}</span>
                <span>{activeLangOption.code.toUpperCase()}</span>
                <svg className={`${styles.langChevron} ${langMenuOpen ? styles.langChevronOpen : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div 
                    className={styles.langMenu}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    {LANGUAGES.map((option) => (
                      <button
                        key={option.code}
                        className={`${styles.langOption} ${option.code === language ? styles.langOptionActive : ''}`}
                        onClick={() => handleSelectLanguage(option.code)}
                      >
                        <span>{option.flag}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <a href="#download" className={styles.downloadBtn} onClick={(e) => handleNavClick(e, 'download')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.downloadIcon}>
              <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
              <path d="M20 20H4v-2h16v2z"/>
            </svg>
            {t('nav.download')}
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

      {/* Mobile Drawer Overlay */}
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
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <a href="#features" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, 'features')}>
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a href="#about" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, 'about')}>
                  {t('nav.about')}
                </a>
              </li>
            </ul>

            <div className={styles.mobileControlsRow}>
              {/* Mobile Theme Switcher */}
              <button 
                className={styles.themeBtn} 
                onClick={toggleTheme}
                title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
              >
                {theme === 'dark' ? (
                  <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </button>

              {/* Mobile Language Selector */}
              <div className={styles.langDropdownWrapper}>
                <button 
                  className={styles.langBtn} 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                >
                  <span className={styles.langFlag}>{activeLangOption.flag}</span>
                  <span>{activeLangOption.code.toUpperCase()}</span>
                  <svg className={`${styles.langChevron} ${langMenuOpen ? styles.langChevronOpen : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
            </div>

            <a href="#download" className={styles.downloadBtn} onClick={(e) => handleNavClick(e, 'download')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.downloadIcon}>
                <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
                <path d="M20 20H4v-2h16v2z"/>
              </svg>
              {t('nav.download')}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
