import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { es } from '@/lib/i18n';

const navItems = [
  { path: '/today', label: es.nav.today, icon: '📅' },
  { path: '/plan', label: es.nav.plan, icon: '📋' },
  { path: '/stats', label: es.nav.stats, icon: '📊' },
  { path: '/settings', label: es.nav.settings, icon: '⚙️' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 py-2"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-2xl mb-0.5">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
