import { useState, useEffect } from 'react';
import { Calculator as SubnetCalculator } from './components/Calculator';
import { Practice } from './components/Practice';
import { Theory } from './components/Theory';
import { ArrowUpRight, Terminal, Globe } from 'lucide-react';
import './index.css';

type Language = 'vi' | 'en' | 'zh';

const translations = {
  vi: {
    welcome: 'Chào mừng đến với SUBNET.AI',
    selectLangMsg: 'Vui lòng chọn ngôn ngữ để bắt đầu:',
    theory: 'LÝ THUYẾT',
    practice: 'THỰC HÀNH',
    calc: 'CÔNG CỤ',
    viewRepo: 'Mã Nguồn',
    lang: 'NGÔN NGỮ',
    confirm: 'BẮT ĐẦU NGAY',
  },
  en: {
    welcome: 'Welcome to SUBNET.AI',
    selectLangMsg: 'Please select your language to start:',
    theory: 'THEORY',
    practice: 'PRACTICE',
    calc: 'CALCULATOR',
    viewRepo: 'View Repo',
    lang: 'LANGUAGE',
    confirm: 'START NOW',
  },
  zh: {
    welcome: '欢迎来到 SUBNET.AI',
    selectLangMsg: '请选择您的语言以开始：',
    theory: '理论',
    practice: '练习',
    calc: '计算器',
    viewRepo: '查看源码',
    lang: '语言',
    confirm: '现在开始',
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');
  const [lang, setLang] = useState<Language | null>(null);
  const [showLangModal, setShowLangModal] = useState(false);
  const [tempLang, setTempLang] = useState<Language>('en');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'vi' || savedLang === 'zh')) {
      setLang(savedLang);
    } else {
      setShowLangModal(true);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSetLang = (selectedLang: Language) => {
    setLang(selectedLang);
    localStorage.setItem('app_lang', selectedLang);
    setShowLangModal(false);
  };

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-core)', padding: '2rem', textAlign: 'center' }}>
        <div className="card animate-in" style={{ borderTop: '4px solid var(--accent-error)' }}>
          <Terminal size={48} color="var(--accent-error)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.5rem' }}>Thiết bị không hỗ trợ</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ứng dụng SUBNET.AI chứa trình mô phỏng Terminal và bảng tính phức tạp.</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Vui lòng sử dụng <strong>PC, Laptop hoặc Tablet/iPad</strong> để truy cập.</p>
        </div>
      </div>
    );
  }

  if (showLangModal || !lang) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-core)' }}>
        <div className="card animate-in" style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem' }}>
          <Terminal size={48} color="var(--accent-blue)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{translations[tempLang].welcome}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{translations[tempLang].selectLangMsg}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className="btn-square" 
              style={{ padding: '1rem', fontSize: '1.1rem', border: tempLang === 'vi' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)' }}
              onClick={() => setTempLang('vi')}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button 
              className="btn-square" 
              style={{ padding: '1rem', fontSize: '1.1rem', border: tempLang === 'en' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)' }}
              onClick={() => setTempLang('en')}
            >
              🇬🇧 English
            </button>
            <button 
              className="btn-square" 
              style={{ padding: '1rem', fontSize: '1.1rem', border: tempLang === 'zh' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)' }}
              onClick={() => setTempLang('zh')}
            >
              🇨🇳 中文 (Chinese)
            </button>
          </div>

          <button className="btn-square large" style={{ width: '100%', background: 'var(--text-primary)', color: 'var(--bg-core)' }} onClick={() => handleSetLang(tempLang)}>
            {translations[tempLang].confirm}
          </button>
        </div>
      </div>
    );
  }

  const t = translations[lang];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header-nav" style={{ 
        background: 'rgba(0,0,0,0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Terminal size={24} color="var(--accent-blue)" />
          <span style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>SUBNET.AI</span>
        </div>
        
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'theory' ? 'active' : ''}`} onClick={() => setActiveTab('theory')}>
            {t.theory}
          </button>
          <button className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`} onClick={() => setActiveTab('practice')}>
            {t.practice}
          </button>
          <button className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`} onClick={() => setActiveTab('calculator')}>
            {t.calc}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-square" onClick={() => setShowLangModal(true)}>
            <Globe size={16} />
            {t.lang}
          </button>
          <button className="btn-square" onClick={() => window.open('https://github.com/wanngxuanji/subnetting-app', '_blank')}>
            {t.viewRepo}
            <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      <main className="main-container" style={{ flex: 1, width: '100%', position: 'relative' }}>
        <div style={{ display: activeTab === 'theory' ? 'block' : 'none' }} className="animate-in">
          <Theory />
        </div>
        <div style={{ display: activeTab === 'practice' ? 'block' : 'none' }} className="animate-in">
          <Practice />
        </div>
        <div style={{ display: activeTab === 'calculator' ? 'block' : 'none' }} className="animate-in">
          <SubnetCalculator />
        </div>
      </main>
    </div>
  );
}
