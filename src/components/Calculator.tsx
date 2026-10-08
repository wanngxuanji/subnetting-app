import { useState } from 'react';
import { Network, Plus, Trash2, Calculator as CalcIcon } from 'lucide-react';
import { calculateSubnets, getBinaryStep } from '../utils/subnet';
import type { SubnetResult } from '../utils/subnet';

export function Calculator() {
  const [network, setNetwork] = useState('192.168.1.0');
  const [cidr, setCidr] = useState('24');
  const [rooms, setRooms] = useState([{ id: 1, name: 'Phòng 1', hosts: '60' }]);
  const [results, setResults] = useState<SubnetResult[] | null>(null);
  const [error, setError] = useState('');

  const addRoom = () => {
    setRooms([...rooms, { id: Date.now(), name: `Phòng ${rooms.length + 1}`, hosts: '' }]);
  };

  const removeRoom = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const updateRoom = (id: number, field: 'name' | 'hosts', value: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleCalculate = () => {
    setError('');
    const cidrNum = parseInt(cidr, 10);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      setError('CIDR không hợp lệ. Phải từ 0 đến 32.');
      return;
    }

    const requirements = rooms
      .map(r => ({ name: r.name || 'Unnamed', hosts: parseInt(r.hosts, 10) }))
      .filter(r => !isNaN(r.hosts) && r.hosts > 0);

    if (requirements.length === 0) {
      setError('Vui lòng nhập số máy cho ít nhất một phòng.');
      return;
    }

    const res = calculateSubnets(network, cidrNum, requirements);
    if ('error' in res) {
      setError(res.error);
      setResults(null);
    } else {
      setResults(res);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <CalcIcon size={20} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Cấu hình Mạng Cơ Sở (Base Network)</h2>
        </div>
        <div className="card-body">
          <div className="grid-2">
          <div className="input-group">
            <label>Địa chỉ IP mạng (Network IP)</label>
            <input 
              type="text" 
              value={network} 
              onChange={e => setNetwork(e.target.value)} 
              placeholder="Ví dụ: 192.168.1.0"
            />
          </div>
          <div className="input-group">
            <label>Subnet Mask (CIDR /x)</label>
            <input 
              type="number" 
              value={cidr} 
              onChange={e => setCidr(e.target.value)} 
              placeholder="Ví dụ: 24"
              min="0" max="32"
            />
          </div>
        </div>
      </div>
      </div>

      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="card-header" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Network size={20} color="var(--accent-green)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Danh sách phòng máy (Subnets)</h2>
          </div>
          <button className="btn-square btn-secondary" onClick={addRoom}>
            <Plus size={16} /> Thêm phòng
          </button>
        </div>
        <div className="card-body">

        {rooms.map((room) => (
          <div key={room.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ margin: 0, flex: 1 }}>
              <label>Tên phòng</label>
              <input 
                type="text" 
                value={room.name} 
                onChange={e => updateRoom(room.id, 'name', e.target.value)} 
              />
            </div>
            <div className="input-group" style={{ margin: 0, flex: 1 }}>
              <label>Số máy yêu cầu</label>
              <input 
                type="number" 
                value={room.hosts} 
                onChange={e => updateRoom(room.id, 'hosts', e.target.value)} 
                min="1"
              />
            </div>
            <button 
              className="btn-square btn-secondary" 
              style={{ padding: '0.75rem', height: '47px' }}
              onClick={() => removeRoom(room.id)}
              title="Xóa phòng"
            >
              <Trash2 size={20} color="var(--accent-error)" />
            </button>
          </div>
        ))}

        <div style={{ marginTop: '2rem' }}>
          <button className="btn-square large" style={{ width: '100%' }} onClick={handleCalculate}>
            <CalcIcon size={20} />
            BẮT ĐẦU CHIA MẠNG
          </button>
        </div>
        </div>
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }} className="animate-in">
          <div className="v-chip error" style={{ padding: '8px 16px', fontSize: '1.1rem' }}>
            <div className="dot"></div>
            <span className="label" style={{ fontSize: '14px' }}>LỖI: {error}</span>
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="card animate-in" style={{ border: '1px solid var(--accent-blue)' }}>
          <div className="card-header" style={{ background: 'var(--accent-blue)', margin: '-1.5rem -1.5rem 1.5rem -1.5rem', padding: '1rem 1.5rem', color: '#000' }}>
            <Network size={20} color="#000" />
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Kết Quả Phân Bổ (VLSM)</h2>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="v-chip success">
                <div className="dot"></div>
                <span className="label">TỐI ƯU THÀNH CÔNG</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>Mạng được sắp xếp tự động từ phòng lớn nhất đến nhỏ nhất để tránh lãng phí IP.</span>
            </div>

          <div className="table-container" style={{ border: '1px solid var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
            <table style={{ margin: 0 }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th style={{ color: 'var(--text-primary)' }}>Phòng</th>
                  <th style={{ color: 'var(--text-muted)' }}>Host (Cần / Có)</th>
                  <th style={{ color: 'var(--accent-blue)' }}>Mạng Con (MC)</th>
                  <th style={{ color: 'var(--accent-green)' }}>Dải IP Khả Dụng</th>
                  <th style={{ color: 'var(--accent-error)' }}>Broadcast (QB)</th>
                  <th style={{ color: 'var(--text-muted)' }}>Mask (MNM)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px dotted var(--border-subtle)' }}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{r.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.neededHosts} / <span style={{ color: 'var(--text-primary)'}}>{r.allocatedHosts}</span></td>
                    <td className="mono" style={{ color: 'var(--accent-blue)' }}>{r.networkAddress}/{r.cidr}</td>
                    <td className="mono" style={{ color: 'var(--accent-green)' }}>{r.firstUsable} <span style={{ color: 'var(--text-muted)' }}>-&gt;</span> {r.lastUsable}</td>
                    <td className="mono" style={{ color: 'var(--accent-error)' }}>{r.broadcastAddress}</td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{r.subnetMask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Bản chất Nhị phân (Console Log)</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Dấu <code style={{ color: '#fff' }}>|</code> biểu diễn vách ngăn giữa phần <strong>Mạng (Network)</strong> và phần <strong>Máy (Host)</strong>. Quá trình chia mạng thực chất là quá trình dời vách ngăn này.
            </p>
            <div style={{ background: '#050505', border: '1px solid #222', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '6px', padding: '10px 12px', background: '#111', borderBottom: '1px solid #222' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              <div className="mono" style={{ padding: '1.5rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {results.map(r => (
                  <div key={r.name} style={{ marginBottom: '2rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>// {r.name}</span> (Cần {r.neededHosts} máy &rarr; Cấp /x = /{r.cidr})
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem', color: 'var(--accent-blue)' }}>
                      <span>MC:</span> 
                      <span>
                        {getBinaryStep(r.networkAddress, r.cidr).split('|')[0]}
                        <span style={{ color: '#fff' }}>|</span>
                        {getBinaryStep(r.networkAddress, r.cidr).split('|')[1]} 
                        <span style={{ color: 'var(--text-muted)', marginLeft: '1rem' }}>&rarr; {r.networkAddress}</span>
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem', color: 'var(--accent-error)' }}>
                      <span>QB:</span> 
                      <span>
                        {getBinaryStep(r.broadcastAddress, r.cidr).split('|')[0]}
                        <span style={{ color: '#fff' }}>|</span>
                        {getBinaryStep(r.broadcastAddress, r.cidr).split('|')[1]} 
                        <span style={{ color: 'var(--text-muted)', marginLeft: '1rem' }}>&rarr; {r.broadcastAddress}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
