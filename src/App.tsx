import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Calculator } from './components/Calculator';
import { Practice } from './components/Practice';
import { Theory } from './components/Theory';

function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'calc' | 'practice'>('theory');

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <Terminal size={32} />
          SubnetMaster Pro
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
            onClick={() => setActiveTab('theory')}
          >
            Bài giảng (Theory)
          </button>
          <button 
            className={`tab ${activeTab === 'calc' ? 'active' : ''}`}
            onClick={() => setActiveTab('calc')}
          >
            Tính toán (Calc)
          </button>
          <button 
            className={`tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            Thực hành (Practice)
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'theory' && <Theory />}
        {activeTab === 'calc' && <Calculator />}
        {activeTab === 'practice' && <Practice />}
      </main>
    </div>
  );
}

export default App;
