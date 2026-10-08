import os
import subprocess
import webbrowser
import time
import urllib.request
from urllib.error import URLError

def wait_for_server(url, timeout=30):
    start_time = time.time()
    print(f"Đang đợi server khoi dong tai {url}...")
    while time.time() - start_time < timeout:
        try:
            urllib.request.urlopen(url)
            return True
        except URLError:
            time.sleep(1)
    return False

def main():
    # Lấy thư mục hiện tại của file python
    app_dir = os.path.dirname(os.path.abspath(__file__))
    url = "http://localhost:5173"
    
    print("========================================")
    print("   KHOI DONG HE THONG CHIA IP (SUBNET)  ")
    print("========================================")
    
    # Khởi động server ẩn ở dưới nền
    print("-> Dang kich hoat server...")
    process = subprocess.Popen(["npm", "run", "dev"], cwd=app_dir, shell=True)
    
    # Đợi server lên sóng
    if wait_for_server(url):
        print("-> Server da san sang! Dang mo trinh duyet...")
        webbrowser.open(url)
        print("\n[!] De nguyen cua so nay de web hoat dong.")
        print("[!] Nhap Ctrl+C de tat web khi hoc xong.")
        try:
            process.wait()
        except KeyboardInterrupt:
            print("\n-> Dang tat server...")
            process.terminate()
    else:
        print("-> Loi: Khong the ket noi den server (timeout).")
        process.terminate()
        input("Nhan Enter de thoat...")

if __name__ == "__main__":
    main()
