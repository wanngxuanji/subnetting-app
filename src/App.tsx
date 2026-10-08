import { useState } from 'react';
import { Calculator as SubnetCalculator } from './components/Calculator';
import { Practice } from './components/Practice';
import { Theory } from './components/Theory';
import { BookOpen, Target, Calculator, GitBranch, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');

  const navItems = [
    { id: 'theory', label: 'README.md', icon: BookOpen },
    { id: 'practice', label: 'practice-mode.ts', icon: Target },
    { id: 'calculator', label: 'calculator.ts', icon: Calculator },
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
      {/* GitHub Global Header */}
      <header className="gh-navbar">
        <GitBranch size={32} color="#fff" />
        <div style={{ display: 'flex', gap: '1rem', flex: 1, marginLeft: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search or jump to..." 
            style={{ width: '300px', backgroundColor: 'var(--gh-bg)', borderRadius: '6px' }} 
            disabled
          />
        </div>
      </header>

      {/* GitHub Repository Header */}
      <div style={{ backgroundColor: 'var(--gh-header-bg)', borderBottom: '1px solid var(--gh-border)' }}>
        <div style={{ padding: '1.5rem 2rem 1rem 2rem' }}>
          <div className="gh-repo-title">
            <Cpu size={20} color="var(--gh-muted)" />
            <span className="owner">wanngxuanji</span>
            <span className="separator">/</span>
            <span className="repo">subnetting-app</span>
            <span className="gh-badge">Public</span>
          </div>
        </div>

        {/* Repository Navigation Tabs */}
        <div className="gh-tabs-container">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div 
                key={item.id}
                className={`gh-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="gh-main" style={{ flex: 1, width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
