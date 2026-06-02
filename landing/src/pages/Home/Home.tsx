import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import StatsBar from '../../components/StatsBar/StatsBar';
import About from '../../components/About/About';
import CTA from '../../components/CTA/CTA';
import styles from './Home.module.css';

export default function Home() {
  const location = useLocation();

  // Handle hash scrolling on page load/navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  return (
    <div className={styles.homeWrapper}>
      <Hero />
      <Features />
      <StatsBar />
      <About />
      <CTA />
    </div>
  );
}
