# Stobix-Bot 🚀

Scripts ini digunakan untuk mengotomatiskan mining otomatis di Stobix untuk $SBXP Points airdrop!  

---

## 📌 Fitur

### Stobix Auto Mining & Task Bot
- ✅ **Auto Task Completion**: Selesaikan semua tugas (follow_x, retweet_x, join_discord, dll.) dari untuk setiap token di `tokens.txt`.
- ⛏️ **Auto Mining**: Mulai mining otomatis setiap 8 jam untuk kumpulkan $SBXP Points.
- 🔌 **Proxy Support**: Load hingga 1519 proxy dari `proxy.txt` dengan auto-switch untuk stabilitas maksimal.
- ⏳ **Smart Times Remaining**: Hitung waktu mining berikutnya berdasarkan token pertama, cocok untuk ~4000 akun tanpa lag.
- 🎨 **Vibrant Logs**: Log penuh warna dengan emoji (✅, ❌, 🔄, ⏳, 🎉) untuk melacak status tugas, mining, dan proxy.

---

## 🚀 Cara Penggunaan

1. **Clone Repository Ini**
```sh
git clone https://github.com/marioatmajanugraha/Stobix-Bot.git
cd Stobix-Bot
```

---

2. **Install Dependencies**
```sh
npm install axios chalk@4.1.2 cfonts http-proxy-agent https-proxy-agent socks-proxy-agent readline-sync
```

---

3. **Siapkan File**
   
  - Buat `proxy.txt` (opsional) dengan format:
    ```sh
    http://username:password@host:port
    socks5://host:port
    ```
  - Buat `wallets.json` (jika pakai opsi 1) dengan format:
    ```json
    [
        {
            "address": "0x...",
            "privateKey": "0x..."
        }
    ]
    ```

- **Untuk Auto Mining & Task
  - Pastikan `tokens.txt` berisi token dari `stobix_autoref.js`, satu token per baris:
    ```sh
    1-vFGWIQ_OXO3dvo7WUYy1ZU--_iO9axRtinXb_x0R4gMfRPjXR2TZR5GGzA8nOs
    ```
  - Siapkan `proxy.txt` (opsional) seperti di atas.

---

4. **Jalankan Script**
- **Untuk Auto Mining & Task**:
  ```sh
  node mine.js
  ```
  - Pilih penggunaan proxy (y/n).
  - Script akan otomatis memproses semua token, menyelesaikan tugas, dan memulai mining.

---

5. **Ikuti Instruksi**
- Waktu mining berikutnya ditampilkan setelah semua token diproses.

---

## ⚠️ Disclaimer
Gunakan script ini dengan bijak dan sesuai aturan Stobix. Developer tidak bertanggung jawab atas penyalahgunaan atau banned akun. Pastikan proxy menggunakan sticky sessions untuk referral akurat (jika pakai proxy rotating).

---

## 🤝 Kontribusi
Ingin menambahkan fitur atau perbaikan? Fork repo ini dan ajukan pull request! Kami terbuka untuk ide baru.

---

## 📞 Kontak
Pertanyaan? Hubungi: [@balveerxyz](https://t.me/balveerxyz)  
Join channel Telegram gratis: [t.me/airdroplocked](https://t.me/airdroplocked)  
