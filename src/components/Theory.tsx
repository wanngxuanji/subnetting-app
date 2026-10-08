import { BookOpen, AlertCircle, TerminalSquare } from 'lucide-react';

export function Theory() {
  return (
    <div className="animate-in">
      <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BookOpen size={24} color="var(--primary-color)" />
          Lý thuyết cốt lõi: Nắm trọn bản chất Subnetting
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Đừng học vẹt công thức. Để chia IP chính xác và không bao giờ quên, bạn cần hiểu bản chất nhị phân của quá trình này.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>1. Các lớp địa chỉ IP (Classes)</h3>
          <p style={{ marginBottom: '1rem' }}>IPv4 có 32 bit, chia làm 4 cụm (octet). Tùy vào khoảng giá trị của octet đầu tiên mà ta phân thành các lớp:</p>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff'}}>Lớp A (0 - 127):</strong> Mặc định /8 (255.0.0.0). Rất lớn, dùng cho mạng khổng lồ. <em>VD: 10.0.0.0</em></li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff'}}>Lớp B (128 - 191):</strong> Mặc định /16 (255.255.0.0). Dành cho mạng trung bình. <em>VD: 172.16.0.0</em></li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff'}}>Lớp C (192 - 223):</strong> Mặc định /24 (255.255.255.0). Phổ biến nhất, dành cho mạng nhỏ (công ty, trường học). <em>VD: 192.168.1.0</em></li>
          </ul>
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            <AlertCircle size={20} />
            Lớp D (224-239) dùng cho Multicast, lớp E (240-255) dùng để nghiên cứu. Ta <strong>không</strong> chia host cho 2 lớp này.
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>2. Cấu tạo của địa chỉ IP</h3>
          <p style={{ marginBottom: '1rem' }}>Một địa chỉ IP luôn gồm 2 phần: <strong>Phần Mạng (Network ID)</strong> và <strong>Phần Host (Host ID)</strong>.</p>
          <div className="mono" style={{ background: '#000', padding: '1rem', borderRadius: '4px', color: 'var(--primary-color)' }}>
            11000000.10101000.00000001 <span style={{ color: '#fff' }}>|</span> 00000000<br/>
            <span style={{ color: 'var(--text-muted)' }}>&lt;------- Phần Mạng -------&gt; <span style={{ color: '#fff' }}>|</span> &lt;- Host -&gt;</span>
          </div>
          <p style={{ marginTop: '1rem' }}>
            <strong>Subnet Mask (Mặt nạ mạng)</strong> có vai trò vạch ra "vách ngăn" (dấu <code style={{color: '#fff'}}>|</code>) này. Chỗ nào mask là 1 thì đó là mạng, là 0 thì đó là host.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <TerminalSquare size={20} />
          3. Bài toán thực tế (Trích xuất từ chính vở ghi của bạn)
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
          <strong>Đề bài:</strong> Cho IP <code>192.180.80.10</code>. Hãy chia cho 4 phòng máy:<br/>
          P1: 123 máy | P2: 62 máy | P3: 30 máy | P4: 28 máy
        </p>
        
        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid var(--text-muted)', marginBottom: '1rem' }}>
          <h4 style={{ color: '#ffb3c6', marginBottom: '0.5rem' }}>Bước 1: Phân tích IP ban đầu</h4>
          <p>Mạng cơ sở của bạn là <code>192.180.80.10</code>. Vì số đầu tiên là 192, đây là địa chỉ <strong>Lớp C</strong>.</p>
          <p>Lớp C mặc định có Subnet Mask là /24 (nghĩa là 24 bit đầu tiên bắt buộc dành cho Mạng, chỉ có 8 bit cuối cùng là dành cho Máy/Host).</p>
          <p>Chuyển số 10 ở cụm cuối cùng ra hệ nhị phân (8 bit), ta được: <code>00001010</code>. Vậy cấu trúc IP hiện tại là:</p>
          <div className="mono" style={{ background: '#000', padding: '1rem', borderRadius: '4px', color: '#fff', margin: '1rem 0' }}>
            11000000 . 10110100 . 01010000 <span style={{ color: 'var(--primary-color)' }}>|</span> 00001010<br/>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&lt;--------- 24 bit Mạng ---------&gt; <span style={{ color: 'var(--primary-color)' }}>|</span> &lt;8 bit Host&gt;</span>
          </div>
          <p>Để tìm "Địa chỉ mạng chuẩn" (MC gốc trước khi chia), ta đổi toàn bộ phần Host (sau vách ngăn) thành số 0 &rarr; <code>192.180.80.0</code>.</p>
        </div>

        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid var(--text-muted)', marginBottom: '1rem' }}>
          <h4 style={{ color: '#88ccff', marginBottom: '1rem' }}>Bước 2: Giải quyết Phòng 1 (P1 - cần 123 máy)</h4>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Tìm số bit Host cần thiết (gọi là n):</h5>
            <p>Để có đủ 123 IP cho 123 máy tính, ta dùng công thức: <strong>2<sup>n</sup> - 2 &ge; 123</strong>.</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              <li><strong>Tại sao phải trừ 2?</strong> Vì trong bất kỳ mạng nào, ta luôn mất 1 IP đứng đầu làm địa chỉ Mạng (MC) và 1 IP đứng cuối làm Broadcast (QB) để gọi phát thanh. Hai IP này không thể gắn cho máy tính.</li>
              <li>Ta nhẩm: 2<sup>6</sup> = 64 (Không đủ 123 máy). Thử tiếp 2<sup>7</sup> = 128. Ta thấy 128 - 2 = 126 &ge; 123. Hoàn toàn thoả mãn!</li>
              <li>&rarr; Suy ra <strong>n = 7</strong>. Tức là ta chỉ cần 7 bit để làm phần Host.</li>
            </ul>
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              Ban đầu Lớp C cho bạn 8 bit Host. Nhưng bây giờ bạn chỉ dùng 7 bit. <strong>Vậy là bạn dư ra 1 bit (8 - 7 = 1)</strong>. Ta lấy 1 bit thừa này "mượn" sang làm phần Mạng (để tạo ra mạng con mới). Vách ngăn <code>|</code> sẽ dời sang phải 1 bit.
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>2. Tìm Subnet Mask mới (MNM):</h5>
            <p>Phần Mạng lúc đầu có 24 bit, giờ mượn thêm 1 bit &rarr; Phần Mạng mới có <strong>25 bit (kí hiệu là /25)</strong>.</p>
            <p>Viết 25 số 1 ra hệ nhị phân để xem Subnet Mask là gì:</p>
            <div className="mono" style={{ background: '#000', padding: '0.75rem', margin: '0.5rem 0', color: '#ffb3c6' }}>
              11111111 . 11111111 . 11111111 . 10000000
            </div>
            <p>3 cụm đầu toàn số 1 đổi ra là 255. Cụm cuối cùng <code>10000000</code> đổi ra thập phân là <strong>128</strong> (vì 2<sup>7</sup> = 128).<br/>
            &rarr; Subnet Mask (MNM) mới của P1 là: <strong>255.255.255.128</strong>.</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>3. Tìm MC (Mạng con) và QB (Broadcast):</h5>
            <p>Nhớ lại vách ngăn bây giờ nằm ở bit thứ 25. Ta xét 8 bit cuối cùng, nó bị vách ngăn chia thành 2 phần: <code>1 bit mượn | 7 bit host</code>.</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Tìm MC:</strong> Quy tắc của MC là <em>toàn bộ bit phần Host phải bằng 0</em>. Giá trị bit mượn hiện tại đang bắt đầu ở số 0.<br/>
              &rarr; 8 bit cuối là <code>0 | 0000000</code>. Đổi ra thập phân = 0. Vậy MC = <strong>192.180.80.0</strong>.</li>
              
              <li><strong>Tìm QB:</strong> Quy tắc của QB là <em>toàn bộ bit phần Host phải bằng 1</em>. Phần bit mượn vẫn giữ nguyên là 0.<br/>
              &rarr; 8 bit cuối trở thành <code>0 | 1111111</code>. Tính tổng thập phân: 64 + 32 + 16 + 8 + 4 + 2 + 1 = <strong>127</strong>.<br/>
              Vậy QB = <strong>192.180.80.127</strong>.</li>
            </ul>
          </div>
          
          <div className="mono" style={{ background: '#000', padding: '1rem', marginTop: '1rem', borderRadius: '4px', color: 'var(--primary-color)' }}>
            <div style={{ color: '#fff' }}>// Tổng kết lại cho Phòng 1 (P1):</div>
            <div>MC = 192.180.80.0</div>
            <div>QB = 192.180.80.127</div>
            <div>MNM = 255.255.255.128</div>
            <br/>
            <div style={{ color: '#fff' }}>Dải IP dùng cho máy (Nằm giữa MC và QB):</div>
            <div style={{ color: '#fff' }}>IP bắt đầu: 192.180.80.1</div>
            <div style={{ color: '#fff' }}>IP kết thúc: 192.180.80.126</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid var(--text-muted)' }}>
          <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Bước 3: Tịnh tiến sang Phòng 2 (P2 - 62 máy)</h4>
          <p><strong>Bí quyết tịnh tiến:</strong> Địa chỉ mạng (MC) của phòng tiếp theo sẽ <strong>luôn nằm ngay sau</strong> địa chỉ Broadcast (QB) của phòng trước!</p>
          <p>QB của P1 là <code>...127</code> &rarr; MC của P2 chắc chắn bắt đầu từ <code>192.180.80.128</code>.</p>
          <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
            <p><strong>1. Tính số bit host:</strong> 2<sup>n</sup> - 2 &ge; 62 &rarr; 2<sup>6</sup> - 2 = 62. Vừa đẹp! Ta cần 6 bit Host.</p>
            <p><strong>2. Subnet Mask mới:</strong> Lấy 32 bit tổng trừ 6 bit host = 26 bit Mạng (/26).<br/>
            MNM sẽ là 26 số 1: <code>11111111.11111111.11111111.11000000</code> &rarr; <strong>255.255.255.192</strong>.</p>
            <p><strong>3. Tìm QB của P2:</strong> MC của P2 là 128 (nhị phân 8 bit cuối là <code>10 | 000000</code>).<br/>
            Để tìm QB, ta đổi 6 bit host thành toàn số 1: <code>10 | 111111</code>.<br/>
            Cụm <code>111111</code> có giá trị là 63. Cộng với 128 ở phần mạng = 191.<br/>
            &rarr; QB của P2 = <strong>192.180.80.191</strong>.</p>
            <p style={{ marginTop: '1rem' }}>Cứ dùng đúng tư duy logic này, bạn sẽ giải quyết ngon ơ cho P3, P4 mà không sợ nhầm lẫn!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
