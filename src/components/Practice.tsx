import { useState, useEffect } from 'react';
import { Target, ArrowRight, Eye, EyeOff, Timer } from 'lucide-react';
import { calculateSubnets, getBinaryStep } from '../utils/subnet';
import type { SubnetResult } from '../utils/subnet';

type Difficulty = 'easy' | 'normal' | 'hard';

function generateRandomProblem(mode: Difficulty) {
  let baseNet = '';
  let cidr = 24;
  let numRooms = 0;
  const rooms = [];

  if (mode === 'easy') {
    // Easy: Class C, 2-3 rooms
    baseNet = `192.168.${Math.floor(Math.random() * 255)}.0`;
    cidr = 24;
    numRooms = Math.floor(Math.random() * 2) + 2;
    for(let i=0; i<numRooms; i++) rooms.push({ name: `Phòng ${i+1}`, hosts: Math.floor(Math.random() * 30) + 10 });
  } else if (mode === 'normal') {
    // Normal: Class B or C, 3-4 rooms
    const isClassB = Math.random() > 0.5;
    if (isClassB) {
      baseNet = `172.${Math.floor(Math.random() * 16) + 16}.0.0`;
      cidr = 16;
    } else {
      baseNet = `192.168.${Math.floor(Math.random() * 255)}.0`;
      cidr = 24;
    }
    numRooms = Math.floor(Math.random() * 2) + 3;
    for(let i=0; i<numRooms; i++) rooms.push({ name: `Khu ${i+1}`, hosts: Math.floor(Math.random() * 100) + 20 });
  } else {
    // Hard: Non-default CIDR (VLSM on VLSM), 4-5 rooms
    baseNet = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 10) * 16}.0`;
    cidr = Math.floor(Math.random() * 4) + 18; // /18 to /21
    numRooms = Math.floor(Math.random() * 2) + 4;
    for(let i=0; i<numRooms; i++) rooms.push({ name: `CN ${i+1}`, hosts: Math.floor(Math.random() * 500) + 50 });
  }

  // Auto solve
  const sortedRooms = [...rooms].sort((a,b) => b.hosts - a.hosts);
  const solution = calculateSubnets(baseNet, cidr, sortedRooms) as SubnetResult[];

  return {
    baseNet,
    cidr,
    displayCidr: mode === 'hard' ? cidr : null, // Only hard shows CIDR
    rooms: sortedRooms,
    solutions: solution
  };
}

export function Practice() {
  const [mode, setMode] = useState<Difficulty | null>(null);
  const [selectedMode, setSelectedMode] = useState<Difficulty | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [problem, setProblem] = useState<any>(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [answers, setAnswers] = useState({ 
    mcBin: '', mc: '', 
    maskBin: '', mask: '', 
    startBin: '', start: '', 
    endBin: '', end: '', 
    qbBin: '', qb: '' 
  });
  const [feedback, setFeedback] = useState<any>(null);
  const [showBinary, setShowBinary] = useState(false);
  const [score, setScore] = useState(0);
  const [isProblemFailed, setIsProblemFailed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Timer for Hard mode
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes = 300 seconds

  useEffect(() => {
    let timer: any;
    if (mode === 'hard' && !feedback && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && mode === 'hard' && !feedback && !showResult) {
      // Time out!
      setIsProblemFailed(true);
      setFeedback({ allCorrect: false, timeout: true, checks: {} });
    }
    return () => clearInterval(timer);
  }, [mode, feedback, timeLeft, showResult]);

  const startGame = () => {
    if (!selectedMode) return;
    setMode(selectedMode);
    setIsStarted(true);
    setQuestionCount(1);
    setScore(0);
    setIsProblemFailed(false);
    setShowResult(false);
    setProblem(generateRandomProblem(selectedMode));
    setCurrentRoomIndex(0);
    setFeedback(null);
    setTimeLeft(300);
    setAnswers({ mcBin: '', mc: '', maskBin: '', mask: '', startBin: '', start: '', endBin: '', end: '', qbBin: '', qb: '' });
  };

  const handleNextProblem = () => {
    const isSuccess = !isProblemFailed && feedback?.allCorrect;
    if (isSuccess) {
      setScore(prev => prev + 1);
    }

    if (questionCount >= 10) {
      // Finished all 10 questions
      setShowResult(true);
      return;
    }
    setQuestionCount(prev => prev + 1);
    setIsProblemFailed(false);
    setProblem(generateRandomProblem(mode!));
    setCurrentRoomIndex(0);
    setAnswers({ mcBin: '', mc: '', maskBin: '', mask: '', startBin: '', start: '', endBin: '', end: '', qbBin: '', qb: '' });
    setFeedback(null);
    setTimeLeft(300); // Reset timer
  };

  const handleNextRoom = () => {
    if (currentRoomIndex < problem.rooms.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
      setAnswers({ mcBin: '', mc: '', maskBin: '', mask: '', startBin: '', start: '', endBin: '', end: '', qbBin: '', qb: '' });
      setFeedback(null);
    } else {
      handleNextProblem();
    }
  };

  const handleCheck = () => {
    const s = problem.solutions[currentRoomIndex];
    const ipToBinStr = (ip: string) => ip.split('.').map(n => Number(n).toString(2).padStart(8, '0')).join('');
    const norm = (str: string) => str.replace(/[^01]/g, '');

    const checks = {
      mcBin: norm(answers.mcBin) === ipToBinStr(s.networkAddress),
      mc: answers.mc.trim() === s.networkAddress,
      maskBin: norm(answers.maskBin) === ipToBinStr(s.subnetMask),
      mask: answers.mask.trim() === s.subnetMask,
      startBin: norm(answers.startBin) === ipToBinStr(s.firstUsable),
      start: answers.start.trim() === s.firstUsable,
      endBin: norm(answers.endBin) === ipToBinStr(s.lastUsable),
      end: answers.end.trim() === s.lastUsable,
      qbBin: norm(answers.qbBin) === ipToBinStr(s.broadcastAddress),
      qb: answers.qb.trim() === s.broadcastAddress
    };
    
    const allCorrect = Object.values(checks).every(Boolean);
    if (!allCorrect) {
      setIsProblemFailed(true);
    }
    setFeedback({ checks, allCorrect, timeout: false });
  };

  if (!isStarted) {
    return (
      <div className="card animate-in">
        <div className="card-header">
          <Target size={16} />
          <h2>CHỌN CHẾ ĐỘ THỰC HÀNH</h2>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Bạn sẽ trải qua 10 câu hỏi để rèn luyện kỹ năng VLSM. Hãy chọn độ khó phù hợp:
          </p>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div 
              className="card" 
              style={{ cursor: 'pointer', marginBottom: 0, border: selectedMode === 'easy' ? '2px solid var(--accent-green)' : '1px solid var(--border-subtle)' }} 
              onClick={() => setSelectedMode('easy')}
            >
              <h3 style={{ color: 'var(--accent-green)', marginBottom: '1rem' }}>EASY</h3>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Có gợi ý (Hints)</li>
                <li>Xem được IP nhị phân gốc</li>
                <li>Không áp lực thời gian</li>
                <li>Phải tự xác định lớp mạng (Class A/B/C)</li>
              </ul>
            </div>
            <div 
              className="card" 
              style={{ cursor: 'pointer', marginBottom: 0, border: selectedMode === 'normal' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)' }} 
              onClick={() => setSelectedMode('normal')}
            >
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>NORMAL</h3>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Không có gợi ý</li>
                <li>Đề bài phức tạp hơn</li>
                <li>Không áp lực thời gian</li>
                <li>Phải tự xác định lớp mạng (Class A/B/C)</li>
              </ul>
            </div>
            <div 
              className="card" 
              style={{ cursor: 'pointer', marginBottom: 0, border: selectedMode === 'hard' ? '2px solid var(--accent-error)' : '1px solid var(--border-subtle)' }} 
              onClick={() => setSelectedMode('hard')}
            >
              <h3 style={{ color: 'var(--accent-error)', marginBottom: '1rem' }}>HARD</h3>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Không có gợi ý</li>
                <li>Mạng Non-default (đã chia sẵn /x)</li>
                <li>Giới hạn 5 phút / câu</li>
                <li>Đòi hỏi tính toán nhẩm cực nhanh</li>
              </ul>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              className="btn-square large" 
              disabled={!selectedMode}
              onClick={startGame}
              style={{ minWidth: '200px' }}
            >
              XÁC NHẬN BẮT ĐẦU
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          {score >= 8 ? (
            <div className="v-chip success" style={{ padding: '16px 32px' }}>
              <div className="dot"></div>
              <span className="label" style={{ fontSize: '24px' }}>XUẤT SẮC</span>
            </div>
          ) : score >= 5 ? (
            <div className="v-chip info" style={{ padding: '16px 32px' }}>
              <div className="dot"></div>
              <span className="label" style={{ fontSize: '24px' }}>KHÁ TỐT</span>
            </div>
          ) : (
            <div className="v-chip warn" style={{ padding: '16px 32px' }}>
              <div className="dot"></div>
              <span className="label" style={{ fontSize: '24px' }}>CẦN CỐ GẮNG</span>
            </div>
          )}
        </div>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Điểm số của bạn</h2>
        <div className="metric-large" style={{ color: score >= 5 ? 'var(--accent-green)' : 'var(--accent-error)', fontSize: '80px', marginBottom: '2rem' }}>
          {score}<span style={{ fontSize: '40px', color: 'var(--text-muted)' }}>/10</span>
        </div>

        <button className="btn-square large" onClick={() => { setIsStarted(false); setMode(null); }}>
          Quay lại menu chọn độ khó
        </button>
      </div>
    );
  }

  if (!problem) return null;

  const currentRoom = problem.rooms[currentRoomIndex];
  const currentSolution = problem.solutions[currentRoomIndex];
  const isFirstRoom = currentRoomIndex === 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-in">
      <div className="card question-box">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} />
            <h2>Câu hỏi {questionCount}/10 (Chế độ: {mode?.toUpperCase()})</h2>
          </div>
          {mode === 'hard' && (
            <div className="v-chip" style={{ borderColor: timeLeft < 60 ? 'var(--accent-error)' : 'var(--accent-blue)' }}>
              <Timer size={14} color={timeLeft < 60 ? "var(--accent-error)" : "var(--accent-blue)"} />
              <span className="label" style={{ color: timeLeft < 60 ? 'var(--accent-error)' : 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>
        
        <div className="card-body">
          <p className="question-text" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Bạn được cấp dải mạng: <strong className="mono" style={{ color: 'var(--accent-blue)', fontSize: '1.4rem' }}>
              {problem.baseNet}{problem.displayCidr ? `/${problem.displayCidr}` : ''}
            </strong>
          </p>

          {!problem.displayCidr && (
            <div className="v-chip warn" style={{ marginBottom: '1rem' }}>
              <div className="dot"></div>
              <span className="label">Ẩn CIDR - Hãy tự xác định lớp mạng</span>
            </div>
          )}

          {mode === 'easy' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button className="btn-square btn-secondary" onClick={() => setShowBinary(!showBinary)} style={{ padding: '4px 12px', fontSize: '12px' }}>
                {showBinary ? <EyeOff size={14} /> : <Eye size={14} />} 
                {showBinary ? "Ẩn nhị phân" : "Xem nhị phân gốc"}
              </button>
              {showBinary && (
                <div className="mono animate-in" style={{ background: '#000', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem', color: '#ffb3c6', fontSize: '1.1rem' }}>
                  {getBinaryStep(problem.baseNet, problem.cidr)} | Default CIDR: /{problem.cidr}
                </div>
              )}
            </div>
          )}

          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Cần chia cho các phòng: <br/>
            {problem.rooms.map((r: any, idx: number) => (
              <span key={idx} style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', margin: '4px', borderRadius: '4px' }}>
                {r.name} <strong>({r.hosts} máy)</strong>
              </span>
            ))}
          </p>

          {currentRoomIndex > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#000', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Bảng IP đã cấp phát:</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th>Phòng</th>
                      <th>MC</th>
                      <th>Start - End</th>
                      <th>QB</th>
                      <th>MNM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problem.solutions.slice(0, currentRoomIndex).map((sol: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px dotted var(--border-subtle)' }}>
                        <td style={{ color: 'var(--text-primary)' }}>{sol.name}</td>
                        <td className="mono">{sol.networkAddress}</td>
                        <td className="mono" style={{ color: 'var(--accent-blue)' }}>{sol.firstUsable} - {sol.lastUsable}</td>
                        <td className="mono" style={{ color: 'var(--accent-error)' }}>{sol.broadcastAddress}</td>
                        <td className="mono">/{sol.cidr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(82, 168, 255, 0.1)', borderLeft: '4px solid var(--accent-blue)' }}>
            <p style={{ margin: 0 }}>
              <strong>Nhiệm vụ {currentRoomIndex + 1}/{problem.rooms.length}:</strong> Hãy tính toán các thông số cho <strong style={{ color: 'var(--accent-blue)' }}>{currentRoom.name}</strong> ({currentRoom.hosts} máy).
              {isFirstRoom && " (Đây là phòng lớn nhất - tính trước)"}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <Target size={16} />
          <h2>Nhập câu trả lời</h2>
        </div>
        <div className="card-body">
          <div className="grid-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="input-group">
              <label>Subnet Mask (MNM)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Nhị phân (VD: 11111111...)"
                  value={answers.maskBin}
                  onChange={e => setAnswers({...answers, maskBin: e.target.value})}
                  style={{ fontFamily: 'monospace', borderColor: feedback?.checks ? (feedback.checks.maskBin ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
                <input 
                  type="text" 
                  placeholder="Thập phân (VD: 255.255.255.192)"
                  value={answers.mask}
                  onChange={e => setAnswers({...answers, mask: e.target.value})}
                  style={{ borderColor: feedback?.checks ? (feedback.checks.mask ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
              </div>
              {mode === 'easy' && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>*Gợi ý: Tính số bit host m sao cho 2^m - 2 &ge; {currentRoom.hosts}, sau đó lấy 32 - m để ra /CIDR mới.</p>}
            </div>

            <div className="input-group">
              <label>Địa chỉ mạng (MC)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Nhị phân (VD: 11000000...)"
                  value={answers.mcBin}
                  onChange={e => setAnswers({...answers, mcBin: e.target.value})}
                  style={{ fontFamily: 'monospace', borderColor: feedback?.checks ? (feedback.checks.mcBin ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
                <input 
                  type="text" 
                  placeholder="Thập phân (VD: 192.168.1.0)"
                  value={answers.mc}
                  onChange={e => setAnswers({...answers, mc: e.target.value})}
                  style={{ borderColor: feedback?.checks ? (feedback.checks.mc ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Địa chỉ Broadcast (QB)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Nhị phân (VD: 11000000...)"
                  value={answers.qbBin}
                  onChange={e => setAnswers({...answers, qbBin: e.target.value})}
                  style={{ fontFamily: 'monospace', borderColor: feedback?.checks ? (feedback.checks.qbBin ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
                <input 
                  type="text" 
                  placeholder="Thập phân (VD: 192.168.1.63)"
                  value={answers.qb}
                  onChange={e => setAnswers({...answers, qb: e.target.value})}
                  style={{ borderColor: feedback?.checks ? (feedback.checks.qb ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>IP Bắt đầu (Start)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Nhị phân (Start)"
                  value={answers.startBin}
                  onChange={e => setAnswers({...answers, startBin: e.target.value})}
                  style={{ fontFamily: 'monospace', borderColor: feedback?.checks ? (feedback.checks.startBin ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
                <input 
                  type="text" 
                  placeholder="Thập phân (Start)"
                  value={answers.start}
                  onChange={e => setAnswers({...answers, start: e.target.value})}
                  style={{ borderColor: feedback?.checks ? (feedback.checks.start ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
              </div>
              {mode === 'easy' && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>*Gợi ý: Bằng MC + 1</p>}
            </div>

            <div className="input-group">
              <label>IP Kết thúc (End)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Nhị phân (End)"
                  value={answers.endBin}
                  onChange={e => setAnswers({...answers, endBin: e.target.value})}
                  style={{ fontFamily: 'monospace', borderColor: feedback?.checks ? (feedback.checks.endBin ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
                <input 
                  type="text" 
                  placeholder="Thập phân (End)"
                  value={answers.end}
                  onChange={e => setAnswers({...answers, end: e.target.value})}
                  style={{ borderColor: feedback?.checks ? (feedback.checks.end ? 'var(--accent-green)' : 'var(--accent-error)') : '' }}
                />
              </div>
              {mode === 'easy' && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>*Gợi ý: Bằng QB - 1</p>}
            </div>

          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <button className="btn-square large" onClick={handleCheck} disabled={feedback?.allCorrect || feedback?.timeout} style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
              XÁC NHẬN ĐÁP ÁN
            </button>
            {feedback && (
              <button className="btn-square btn-secondary" onClick={handleNextRoom} style={{ fontSize: '1.1rem' }}>
                {currentRoomIndex < problem.rooms.length - 1 ? `Tiếp tục: ${problem.rooms[currentRoomIndex + 1].name}` : (questionCount < 10 ? 'Hoàn thành, chuyển câu tiếp theo' : 'Kết thúc bài tập')} <ArrowRight size={20} />
              </button>
            )}
          </div>

          {feedback && (
            <div className="step-details animate-in" style={{ marginTop: '2rem', border: feedback.allCorrect ? '1px solid var(--accent-green)' : '1px solid var(--accent-error)', padding: '1.5rem', background: 'var(--bg-core)' }}>
              {feedback.timeout ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="v-chip error" style={{ padding: '8px 16px', fontSize: '1.2rem' }}>
                      <div className="dot"></div>
                      <span className="label" style={{ fontSize: '14px' }}>HẾT GIỜ (TIMEOUT)</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>Rất tiếc, bạn đã hết 5 phút cho câu này.</p>
                </div>
              ) : feedback.allCorrect ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="v-chip success" style={{ padding: '8px 16px', fontSize: '1.2rem' }}>
                    <div className="dot"></div>
                    <span className="label" style={{ fontSize: '14px' }}>CHÍNH XÁC HOÀN TOÀN</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="v-chip error" style={{ padding: '8px 16px', fontSize: '1.2rem' }}>
                      <div className="dot"></div>
                      <span className="label" style={{ fontSize: '14px' }}>SAI RỒI! XEM GIẢI THÍCH</span>
                    </div>
                  </div>
                  <div style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}><strong>1. Tính số bit host (n):</strong> Phòng cần {currentRoom.hosts} máy. Ta có 2<sup>n</sup> - 2 &ge; {currentRoom.hosts}. Suy ra n = {32 - currentSolution.cidr} (số bit host).</p>
                    
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-primary)' }}><strong>2. Subnet Mask mới:</strong> 32 bit tổng - {32 - currentSolution.cidr} bit host = /{currentSolution.cidr}.</p>
                    <div className="mono" style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', color: 'var(--accent-blue)' }}>
                      MNM: {getBinaryStep(currentSolution.subnetMask, currentSolution.cidr)}<br/>
                      &rarr; {currentSolution.subnetMask}
                    </div>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-primary)' }}><strong>3. Mạng con (MC):</strong> Giữ nguyên phần Mạng, ép phần Host thành toàn số 0.</p>
                    <div className="mono" style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', color: 'var(--accent-green)' }}>
                      MC : {getBinaryStep(currentSolution.networkAddress, currentSolution.cidr)}<br/>
                      &rarr; {currentSolution.networkAddress}
                    </div>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-primary)' }}><strong>4. Broadcast (QB):</strong> Giữ nguyên phần Mạng, ép phần Host thành toàn số 1.</p>
                    <div className="mono" style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', color: 'var(--accent-error)' }}>
                      QB : {getBinaryStep(currentSolution.broadcastAddress, currentSolution.cidr)}<br/>
                      &rarr; {currentSolution.broadcastAddress}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
