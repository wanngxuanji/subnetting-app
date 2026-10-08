import { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { calculateSubnets, getBinaryStep } from '../utils/subnet';
import type { SubnetResult } from '../utils/subnet';

function generateRandomProblem() {
  const rand = Math.random();
  let baseNet = '';
  let cidr = 24;
  let numRooms = 0;
  const rooms = [];

  if (rand < 0.2) {
    // Class A (20% chance) - Hard
    baseNet = `10.${Math.floor(Math.random() * 255)}.0.0`;
    cidr = 16;
    numRooms = Math.floor(Math.random() * 4) + 2;
    for(let i=0; i<numRooms; i++) rooms.push({ name: `Chi nhánh ${i+1}`, hosts: Math.floor(Math.random() * 1000) + 100 });
  } else if (rand < 0.5) {
    // Class B (30% chance) - Medium
    baseNet = `172.${Math.floor(Math.random() * 16) + 16}.${Math.floor(Math.random() * 255)}.0`;
    cidr = 22; // Larger subnet for class B to fit multiple rooms
    numRooms = Math.floor(Math.random() * 3) + 2;
    for(let i=0; i<numRooms; i++) rooms.push({ name: `Khu vực ${i+1}`, hosts: Math.floor(Math.random() * 200) + 50 });
  } else {
    // Class C (50% chance) - Standard
    baseNet = `192.168.${Math.floor(Math.random() * 255)}.0`;
    cidr = 24;
    numRooms = Math.floor(Math.random() * 3) + 2;
    for(let i=0; i<numRooms; i++) rooms.push({ name: `Phòng ${i+1}`, hosts: Math.floor(Math.random() * 50) + 10 });
  }

  // Auto solve
  const sortedRooms = [...rooms].sort((a,b) => b.hosts - a.hosts);
  const solution = calculateSubnets(baseNet, cidr, sortedRooms) as SubnetResult[];

  return {
    baseNet,
    cidr,
    rooms: sortedRooms,
    solutions: solution
  };
}

export function Practice() {
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

  useEffect(() => {
    setProblem(generateRandomProblem());
    setCurrentRoomIndex(0);
  }, []);

  const handleNextProblem = () => {
    setProblem(generateRandomProblem());
    setCurrentRoomIndex(0);
    setAnswers({ mcBin: '', mc: '', maskBin: '', mask: '', startBin: '', start: '', endBin: '', end: '', qbBin: '', qb: '' });
    setFeedback(null);
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
    setFeedback({ checks, allCorrect });
  };

  if (!problem) return null;

  const currentRoom = problem.rooms[currentRoomIndex];
  const currentSolution = problem.solutions[currentRoomIndex];
  const isFirstRoom = currentRoomIndex === 0;

  return (
    <div>
      <div className="card question-box">
        <div className="card-header">
          <Target size={16} />
          <h2>practice-mode.ts / Đề bài</h2>
        </div>
        <div className="card-body">
          <p className="question-text">
          Bạn được cấp dải mạng <strong>{problem.baseNet}/{problem.cidr}</strong>.
        </p>
        <div className="mono" style={{ background: '#000', padding: '1rem', borderRadius: '4px', marginTop: '1rem', color: '#ffb3c6', fontSize: '1.1rem' }}>
          Nhị phân IP gốc: {getBinaryStep(problem.baseNet, problem.cidr)}
        </div>
        <p>
          Trường yêu cầu chia cho các phòng: {problem.rooms.map((r: any) => `${r.name} (${r.hosts} máy)`).join(', ')}.
        </p>

        {currentRoomIndex > 0 && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#000', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--primary-color)' }}>Bảng IP đã cấp phát:</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.5rem' }}>Phòng</th>
                    <th style={{ padding: '0.5rem' }}>MC</th>
                    <th style={{ padding: '0.5rem' }}>Start - End</th>
                    <th style={{ padding: '0.5rem' }}>QB</th>
                    <th style={{ padding: '0.5rem' }}>MNM</th>
                  </tr>
                </thead>
                <tbody>
                  {problem.solutions.slice(0, currentRoomIndex).map((sol: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px dotted var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>{sol.name}</td>
                      <td className="mono" style={{ padding: '0.5rem' }}>{sol.networkAddress}</td>
                      <td className="mono" style={{ padding: '0.5rem', color: '#88ccff' }}>{sol.firstUsable} - {sol.lastUsable}</td>
                      <td className="mono" style={{ padding: '0.5rem', color: 'var(--error-color)' }}>{sol.broadcastAddress}</td>
                      <td className="mono" style={{ padding: '0.5rem' }}>/{sol.cidr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gh-sub-header)', borderRadius: '6px' }}>
          <p>
            <strong>Nhiệm vụ {currentRoomIndex + 1}/{problem.rooms.length}:</strong> Hãy tính toán các thông số cho <strong>{currentRoom.name}</strong> 
            ({currentRoom.hosts} máy).
            {isFirstRoom && " (phòng lớn nhất - ưu tiên chia trước)"}
          </p>
        </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <Target size={16} />
          <h2>practice-mode.ts / Trả lời</h2>
        </div>
        <div className="card-body">
          <h3 style={{ marginBottom: '1.5rem', color: '#ffb3c6' }}>Nhập đáp án (Nhị phân trước &rarr; Thập phân sau):</h3>
        
        <div className="grid-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="input-group">
            <label>Subnet Mask (MNM)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Nhị phân (VD: 11111111.11111111...)"
                value={answers.maskBin}
                onChange={e => setAnswers({...answers, maskBin: e.target.value})}
                style={{ fontFamily: 'monospace', borderColor: feedback ? (feedback.checks.maskBin ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
              <input 
                type="text" 
                placeholder="Thập phân (VD: 255.255.255.192)"
                value={answers.mask}
                onChange={e => setAnswers({...answers, mask: e.target.value})}
                style={{ borderColor: feedback ? (feedback.checks.mask ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Địa chỉ mạng (MC)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Nhị phân (VD: 11000000.10101000...)"
                value={answers.mcBin}
                onChange={e => setAnswers({...answers, mcBin: e.target.value})}
                style={{ fontFamily: 'monospace', borderColor: feedback ? (feedback.checks.mcBin ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
              <input 
                type="text" 
                placeholder="Thập phân (VD: 192.168.1.0)"
                value={answers.mc}
                onChange={e => setAnswers({...answers, mc: e.target.value})}
                style={{ borderColor: feedback ? (feedback.checks.mc ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Địa chỉ Broadcast (QB)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Nhị phân (VD: 11000000.10101000...)"
                value={answers.qbBin}
                onChange={e => setAnswers({...answers, qbBin: e.target.value})}
                style={{ fontFamily: 'monospace', borderColor: feedback ? (feedback.checks.qbBin ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
              <input 
                type="text" 
                placeholder="Thập phân (VD: 192.168.1.63)"
                value={answers.qb}
                onChange={e => setAnswers({...answers, qb: e.target.value})}
                style={{ borderColor: feedback ? (feedback.checks.qb ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
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
                style={{ fontFamily: 'monospace', borderColor: feedback ? (feedback.checks.startBin ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
              <input 
                type="text" 
                placeholder="Thập phân (Start)"
                value={answers.start}
                onChange={e => setAnswers({...answers, start: e.target.value})}
                style={{ borderColor: feedback ? (feedback.checks.start ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label>IP Kết thúc (End)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Nhị phân (End)"
                value={answers.endBin}
                onChange={e => setAnswers({...answers, endBin: e.target.value})}
                style={{ fontFamily: 'monospace', borderColor: feedback ? (feedback.checks.endBin ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
              <input 
                type="text" 
                placeholder="Thập phân (End)"
                value={answers.end}
                onChange={e => setAnswers({...answers, end: e.target.value})}
                style={{ borderColor: feedback ? (feedback.checks.end ? 'var(--primary-color)' : 'var(--error-color)') : '' }}
              />
            </div>
          </div>

        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button className="btn" onClick={handleCheck} disabled={feedback?.allCorrect} style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            KIỂM TRA ĐÁP ÁN
          </button>
          {feedback && (
            <button className="btn btn-secondary" onClick={handleNextRoom} style={{ fontSize: '1.1rem' }}>
              {currentRoomIndex < problem.rooms.length - 1 ? `Tiếp tục: ${problem.rooms[currentRoomIndex + 1].name}` : 'Hoàn thành, chuyển bài mới'} <ArrowRight size={20} />
            </button>
          )}
        </div>

        {feedback && (
          <div className="step-details animate-in" style={{ marginTop: '2rem', border: feedback.allCorrect ? '2px solid var(--primary-color)' : '2px solid var(--error-color)' }}>
            {feedback.allCorrect ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                <CheckCircle size={28} /> CHÍNH XÁC HOÀN TOÀN! CHÚC MỪNG BẠN!
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error-color)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>
                  <XCircle size={28} /> SAI RỒI! HÃY XEM GIẢI THÍCH Ở DƯỚI:
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '0.5rem' }}><strong>1. Tính số bit host (n):</strong> Phòng cần {currentRoom.hosts} máy. Ta có 2<sup>n</sup> - 2 &ge; {currentRoom.hosts}. Suy ra n = {32 - currentSolution.cidr} (số bit host).</p>
                  
                  <p style={{ marginTop: '1.5rem' }}><strong>2. Subnet Mask mới:</strong> 32 bit tổng - {32 - currentSolution.cidr} bit host = /{currentSolution.cidr}.</p>
                  <div className="mono" style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', color: '#88ccff' }}>
                    MNM: {getBinaryStep(currentSolution.subnetMask, currentSolution.cidr)}<br/>
                    &rarr; {currentSolution.subnetMask}
                  </div>

                  <p style={{ marginTop: '1.5rem' }}><strong>3. Mạng con (MC):</strong> Giữ nguyên phần Mạng, ép phần Host thành toàn số 0.</p>
                  <div className="mono" style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', color: 'var(--primary-color)' }}>
                    MC : {getBinaryStep(currentSolution.networkAddress, currentSolution.cidr)}<br/>
                    &rarr; {currentSolution.networkAddress}
                  </div>

                  <p style={{ marginTop: '1.5rem' }}><strong>4. Broadcast (QB):</strong> Giữ nguyên phần Mạng, ép phần Host thành toàn số 1.</p>
                  <div className="mono" style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', color: 'var(--error-color)' }}>
                    QB : {getBinaryStep(currentSolution.broadcastAddress, currentSolution.cidr)}<br/>
                    &rarr; {currentSolution.broadcastAddress}
                  </div>

                  <p style={{ marginTop: '1.5rem' }}><strong>5. Start/End:</strong> Từ MC+1 đến QB-1: <strong>{currentSolution.firstUsable} - {currentSolution.lastUsable}</strong>.</p>
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
