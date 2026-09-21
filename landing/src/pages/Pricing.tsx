import { motion } from 'framer-motion';
import Pricing from '../components/Pricing';

export default function PricingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingTop: '40px', minHeight: '80vh' }}
    >
      <Pricing />
    </motion.div>
  );
}
