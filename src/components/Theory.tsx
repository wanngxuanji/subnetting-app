import { AlertCircle, TerminalSquare, Server, Wifi, Network, ChevronRight, Zap } from 'lucide-react';

export function Theory() {
  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>


      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Class Info */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.05 }}>
            <Server size={200} />
          </div>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <Wifi size={20} color="var(--accent-green)" />
            <h2 style={{ fontSize: '1.2rem' }}>1. Kiến trúc Lớp (IP Classes)</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            IPv4 gồm 32 bit, chia thành 4 octet. Dựa vào octet đầu tiên, ta có phân lớp:
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderLeft: '2px solid var(--accent-error)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fff' }}>Lớp A (0 - 127)</strong>
                <span className="mono" style={{ color: 'var(--text-muted)' }}>/8 (255.0.0.0)</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mạng khổng lồ. VD: <span className="mono" style={{color: '#fff'}}>10.0.0.0</span></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderLeft: '2px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fff' }}>Lớp B (128 - 191)</strong>
                <span className="mono" style={{ color: 'var(--text-muted)' }}>/16 (255.255.0.0)</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mạng trung bình. VD: <span className="mono" style={{color: '#fff'}}>172.16.0.0</span></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderLeft: '2px solid var(--accent-green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fff' }}>Lớp C (192 - 223)</strong>
                <span className="mono" style={{ color: 'var(--text-muted)' }}>/24 (255.255.255.0)</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mạng nhỏ phổ biến. VD: <span className="mono" style={{color: '#fff'}}>192.168.1.0</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
            <AlertCircle size={20} color="var(--accent-error)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--accent-error)' }}>Lớp D (224-239) & Lớp E (240-255)</strong> được bảo lưu cho Multicast và nghiên cứu. <strong>Tuyệt đối không</strong> cấp phát cho Host.
            </p>
          </div>
        </div>

        {/* Structure Info */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.05 }}>
            <Network size={200} />
          </div>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <TerminalSquare size={20} color="var(--accent-blue)" />
            <h2 style={{ fontSize: '1.2rem' }}>2. Cấu tạo & Vách ngăn</h2>
          </div>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Một địa chỉ IP luôn bị phân mảnh thành 2 nửa đối lập: <strong>Network ID</strong> và <strong>Host ID</strong>.
          </p>

          <div style={{ background: '#050505', border: '1px solid #222', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '6px', padding: '10px 12px', background: '#111', borderBottom: '1px solid #222' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}></div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}></div>
            </div>
            <div className="mono" style={{ padding: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent-blue)', letterSpacing: '2px' }}>11000000.10101000.00000001</span>
                <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', marginTop: '4px' }}>&lt;------- Phần Mạng -------&gt;</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>|</span>
                <span style={{ color: 'transparent', fontSize: '0.8rem', marginTop: '4px' }}>|</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent-error)', letterSpacing: '2px' }}>00000000</span>
                <span style={{ color: 'var(--accent-error)', fontSize: '0.8rem', marginTop: '4px' }}>&lt;- Host -&gt;</span>
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Ký tự <code style={{ color: '#fff' }}>|</code> chính là <strong>Subnet Mask (Mặt nạ mạng)</strong>. Quy tắc thép: Bit của Mask là <code style={{ color: 'var(--accent-blue)' }}>1</code> thì đó là Mạng, là <code style={{ color: 'var(--accent-error)' }}>0</code> thì đó là Host.
          </p>
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '2rem' }}>
          <Zap size={24} color="#ffbd2e" />
          <h2 style={{ fontSize: '1.5rem' }}>3. Thực chiến: Giải phẫu một bài toán VLSM</h2>
        </div>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderLeft: '4px solid #ffbd2e', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            <strong>Nhiệm vụ:</strong> Chia dải mạng <code style={{ color: '#ffbd2e', background: 'rgba(255,189,46,0.1)' }}>192.180.80.10</code> cho 4 phòng: <br/>
            <span style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'inline-block' }}>
              P1 (123 máy) &nbsp;&bull;&nbsp; P2 (62 máy) &nbsp;&bull;&nbsp; P3 (30 máy) &nbsp;&bull;&nbsp; P4 (28 máy)
            </span>
          </p>
        </div>

        {/* Step 1 */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="v-chip info" style={{ padding: '8px 12px', width: 'max-content' }}>
              <span className="label" style={{ fontSize: '12px', fontWeight: 'bold' }}>BƯỚC 1</span>
            </div>
            <div style={{ width: '2px', flex: 1, background: 'var(--border-subtle)', margin: '1rem 0' }}></div>
          </div>
          
          <div style={{ flex: 1, paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff' }}>Chuẩn hóa IP Ban đầu</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Octet đầu là 192 &rarr; Thuộc <strong>Lớp C</strong> (Mặc định /24). Tức là 24 bit mạng, 8 bit host.
            </p>
            <div className="mono" style={{ background: '#0a0a0a', padding: '1rem', border: '1px solid #222', color: 'var(--text-muted)' }}>
              11000000 . 10110100 . 01010000 <strong style={{ color: '#fff' }}>|</strong> <span style={{ color: 'var(--accent-error)' }}>00001010</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
              Để lấy Địa chỉ Mạng Chuẩn (MC), ép toàn bộ Host về 0: <br/>
              <code style={{ color: 'var(--accent-blue)', background: 'transparent', padding: 0 }}>&rarr; MC Gốc: 192.180.80.0</code>
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="v-chip success" style={{ padding: '8px 12px', width: 'max-content' }}>
              <span className="label" style={{ fontSize: '12px', fontWeight: 'bold' }}>BƯỚC 2</span>
            </div>
            <div style={{ width: '2px', flex: 1, background: 'var(--border-subtle)', margin: '1rem 0' }}></div>
          </div>
          
          <div style={{ flex: 1, paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff' }}>Chia cho Phòng 1 (123 máy)</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}><ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }}/> 1. Tính bit Host (n)</h4>
              <p style={{ color: 'var(--text-muted)' }}>
                Công thức: <code style={{ color: '#fff' }}>2<sup>n</sup> - 2 &ge; 123</code>. <br/>
                <em>(Trừ 2 vì mất 1 IP cho Mạng và 1 IP cho Broadcast).</em><br/>
                Nhẩm: 2<sup>7</sup> = 128 &rarr; Thỏa mãn! Vậy <strong>n = 7</strong> (cần 7 bit Host).
              </p>
              <div style={{ background: 'rgba(39, 201, 63, 0.1)', padding: '1rem', borderLeft: '2px solid var(--accent-green)', marginTop: '1rem', fontSize: '0.95rem' }}>
                Lớp C cho 8 bit, nhưng ta chỉ xài 7 bit. <strong>Dư ra 1 bit (8 - 7 = 1)</strong>.<br/>
                Ta mượn 1 bit này làm Mạng. Vách ngăn <code style={{ color: '#fff', padding: '0 4px' }}>|</code> dời sang phải 1 bước!
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}><ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }}/> 2. Subnet Mask mới (MNM)</h4>
              <p style={{ color: 'var(--text-muted)' }}>
                Mạng = 24 bit gốc + 1 bit mượn = 25 bit (Ghi là <strong>/25</strong>).<br/>
                25 số 1 viết ra nhị phân:
              </p>
              <div className="mono" style={{ background: '#0a0a0a', padding: '1rem', border: '1px solid #222', color: 'var(--text-muted)' }}>
                11111111.11111111.11111111.<strong style={{ color: 'var(--accent-green)' }}>1</strong>0000000
              </div>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Cụm cuối là <code style={{ color: '#fff' }}>10000000</code> = <strong>128</strong>. &rarr; MNM: <strong style={{ color: '#fff' }}>255.255.255.128</strong>.
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}><ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }}/> 3. MC & QB</h4>
              <p style={{ color: 'var(--text-muted)' }}>8 bit cuối bị vách ngăn chia thành: <code>1 bit mượn | 7 bit host</code>.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ background: '#0a0a0a', padding: '1rem', border: '1px solid #222' }}>
                  <div style={{ color: 'var(--accent-blue)', fontWeight: 'bold', marginBottom: '0.5rem' }}>MC (Mạng Con)</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ép toàn bộ phần Host thành 0.</div>
                  <div className="mono">0 <span style={{color: '#fff'}}>|</span> 0000000 &rarr; 0</div>
                  <div className="mono" style={{ color: '#fff', marginTop: '0.5rem' }}>192.180.80.0</div>
                </div>
                <div style={{ background: '#0a0a0a', padding: '1rem', border: '1px solid #222' }}>
                  <div style={{ color: 'var(--accent-error)', fontWeight: 'bold', marginBottom: '0.5rem' }}>QB (Broadcast)</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ép toàn bộ phần Host thành 1.</div>
                  <div className="mono">0 <span style={{color: '#fff'}}>|</span> 1111111 &rarr; 127</div>
                  <div className="mono" style={{ color: '#fff', marginTop: '0.5rem' }}>192.180.80.127</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="v-chip warn" style={{ padding: '8px 12px', width: 'max-content' }}>
              <span className="label" style={{ fontSize: '12px', fontWeight: 'bold' }}>BƯỚC 3</span>
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff' }}>Tịnh tiến sang Phòng 2 (62 máy)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              <strong>BÍ QUYẾT:</strong> MC của phòng tiếp theo <strong>luôn nằm liền kề</strong> sau QB của phòng trước!
            </p>
            <div style={{ background: 'rgba(255,189,46,0.1)', padding: '1.5rem', borderLeft: '4px solid #ffbd2e', marginTop: '1rem' }}>
              <p style={{ margin: 0, color: '#ffbd2e', fontSize: '1.1rem' }} className="mono">
                QB P1 = 192.180.80.127 &rarr; MC P2 = 192.180.80.128
              </p>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', lineHeight: 1.8 }}>
              Tiếp tục lặp lại quy trình: Tính Host (n=6) &rarr; Tìm MNM (/26) &rarr; Tìm QB (191). Cứ như vậy, mạng máy tính sẽ được trải dài một cách hoàn hảo không khe hở!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
