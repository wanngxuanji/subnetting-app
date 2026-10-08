import { useState } from 'react';
import { Calculator as SubnetCalculator } from './components/Calculator';
import { Practice } from './components/Practice';
import { Theory } from './components/Theory';
import { ArrowUpRight, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');

  const navItems = [
    { id: 'theory', label: 'THEORY' },
    { id: 'practice', label: 'PRACTICE' },
    { id: 'calculator', label: 'CALCULATOR' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <Theory />;
      case 'practice': return <Practice />;
      case 'calculator': return <SubnetCalculator />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="header-nav">
        <div className="brand">
          <Cpu size={24} color="#fff" />
          <span>SUBNET.AI</span>
        </div>
        
        <div className="nav-tabs">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button className="btn-square" onClick={() => window.open('https://github.com/wanngxuanji/subnetting-app', '_blank')}>
          View Repo
          <ArrowUpRight size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="main-container" style={{ flex: 1, width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
