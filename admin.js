document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIKA LOGIN ---
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginAlert = document.getElementById('loginAlert');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Autentikasi sederhana sesuai draf asli lu
        if(user === 'admin' && pass === 'admin123') {
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
        } else {
            loginAlert.innerText = "Username atau Password salah!";
            loginAlert.classList.remove('hidden');
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        loginForm.reset();
    });

    // --- LOGIKA KOMPUTASI (FETCH KE RENDER) ---
    const prosesBtn = document.getElementById('prosesBtn');
    const statusText = document.getElementById('statusText');

    prosesBtn.addEventListener('click', async () => {
        prosesBtn.disabled = true;
        prosesBtn.innerText = "Memproses (Bisa memakan waktu 10-30 detik)...";
        statusText.innerText = "Menghubungi Server Render...";

        try {
            // GANTI URL INI DENGAN URL RENDER LU (CONTOH: https://api-kepuasan-smkn1.onrender.com)
            const RENDER_API_URL = 'https://backend-komputasi-pca.onrender.com/proses-klaster';
            
            const response = await fetch(`${RENDER_API_URL}?k=3`); // Nembak API Minta 3 Klaster
            const data = await response.json();

            if(data.status === "success") {
                statusText.innerText = "✅ Komputasi Berhasil!";
                
                // Update Kotak Metrik
                document.getElementById('metricTotal').innerText = data.jumlah_responden_diproses;
                document.getElementById('metricDimensi').innerText = data.dimensi_setelah_pca;
                document.getElementById('metricVariansi').innerText = data.variansi_kumulatif + "%";

                // Karena kita butuh nampilin grafik 2D (PC1 vs PC2), nanti kita sesuaikan
                // script Python di Render biar nge-return koordinatnya juga. 
                // Untuk sekarang, kita buat animasi sukses dulu di Chart container.
                document.getElementById('clusterChart').innerHTML = 
                    `<h3 style="text-align:center; padding-top:150px; color:#34d399;">
                    Data berhasil ditarik dan diproses!<br>
                    ${data.jumlah_responden_diproses} siswa terbagi ke dalam 3 klaster.
                    </h3>`;
            } else {
                statusText.innerText = `❌ Error: ${data.detail}`;
                statusText.style.color = "#ef4444";
            }
        } catch (error) {
            statusText.innerText = "❌ Gagal menghubungi server. Pastikan Render sudah 'Live'.";
            statusText.style.color = "#ef4444";
            console.error(error);
        } finally {
            prosesBtn.disabled = false;
            prosesBtn.innerText = "🚀 Proses Ulang Data";
        }
    });
});
