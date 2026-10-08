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
        <div className="card-header">
          <CalcIcon size={16} />
          <h2>calculator.ts</h2>
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

      <div className="card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <h2>Danh sách phòng máy (Yêu cầu)</h2>
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
        <div className="alert alert-error">
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="card">
          <div className="card-header">
            <Network size={16} />
            <h2>PHÂN BỔ IP (VLSM)</h2>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="v-chip success">
                <div className="dot"></div>
                <span className="label">SUCCESS</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>Mạng được tối ưu tự động từ phòng lớn nhất.</span>
            </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên phòng</th>
                  <th>Cần/Thực tế</th>
                  <th>Network (MC)</th>
                  <th>Dải IP khả dụng (Start - End)</th>
                  <th>Broadcast (QB)</th>
                  <th>Mask (MNM)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.name}</strong></td>
                    <td>{r.neededHosts} / <span style={{ color: 'var(--primary-color)'}}>{r.allocatedHosts}</span></td>
                    <td style={{ color: '#ffb3c6' }}>{r.networkAddress}/{r.cidr}</td>
                    <td>{r.firstUsable} <span style={{ color: 'var(--text-muted)' }}>-&gt;</span> {r.lastUsable}</td>
                    <td style={{ color: '#88ccff' }}>{r.broadcastAddress}</td>
                    <td>{r.subnetMask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Bản chất nhị phân (Cách giải của thầy)</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Dấu <code>|</code> biểu diễn vách ngăn giữa phần Mạng (Network) và phần Máy (Host).
            </p>
            <div className="mono" style={{ background: '#000', padding: '1rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--primary-color)' }}>
              {results.map(r => (
                <div key={r.name} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
                  <div style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>{r.name} (cần {r.neededHosts} máy {`->`} /x = /{r.cidr})</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem', color: '#ffb3c6' }}>
                    <span>MC:</span> <span>{getBinaryStep(r.networkAddress, r.cidr)}  ({r.networkAddress})</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem', color: '#88ccff' }}>
                    <span>QB:</span> <span>{getBinaryStep(r.broadcastAddress, r.cidr)}  ({r.broadcastAddress})</span>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
