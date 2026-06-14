document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIKA LOGIN ---
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginAlert = document.getElementById('loginAlert');

    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if(user === 'admin' && pass === 'admin123') {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
            } else {
                loginAlert.innerText = "Username atau Password salah!";
                loginAlert.classList.remove('hidden');
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            loginSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
            loginForm.reset();
        });
    }

    // --- LOGIKA KOMPUTASI & RENDER GRAFIK ---
    const prosesBtn = document.getElementById('prosesBtn');
    const statusText = document.getElementById('statusText');

    if(prosesBtn) {
        prosesBtn.addEventListener('click', async () => {
            prosesBtn.disabled = true;
            prosesBtn.innerText = "Memproses (Bisa memakan waktu 10-30 detik)...";
            statusText.innerText = "Menghubungi Server Render...";

            try {
                // GANTI INI DENGAN URL RENDER LU!
                const RENDER_API_URL = 'https://backend-komputasi-pca.onrender.com/proses-klaster';
                
                const response = await fetch(`${RENDER_API_URL}?k=3`); 
                const data = await response.json();

                if(data.status === "success") {
                    statusText.innerText = "✅ Komputasi Berhasil!";
                    
                    // Update Kotak Metrik
                    document.getElementById('metricTotal').innerText = data.jumlah_responden_diproses;
                    document.getElementById('metricDimensi').innerText = data.dimensi_setelah_pca;
                    document.getElementById('metricVariansi').innerText = data.variansi_kumulatif + "%";

                    // --- MENGGAMBAR GRAFIK PLOTLY ---
                    const plotData = data.plot_data;
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']; // Warna Klaster Neon
                    
                    const trace = {
                        x: plotData.x,
                        y: plotData.y,
                        mode: 'markers',
                        type: 'scatter',
                        text: plotData.nama, // Nama siswa bakal muncul pas di-hover pakai mouse
                        marker: {
                            size: 14,
                            color: plotData.cluster.map(c => colors[c % colors.length]),
                            line: { width: 1.5, color: 'rgba(255,255,255,0.7)' },
                            symbol: 'circle'
                        }
                    };

                    const layout = {
                        title: { text: 'Sebaran Klaster Kepuasan Siswa (Proyeksi 2D)', font: { color: 'white', size: 18 } },
                        paper_bgcolor: 'rgba(0,0,0,0)', // Dibuat transparan biar kaca belakangnya tembus
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        xaxis: { title: 'Komponen Utama 1', gridcolor: 'rgba(255,255,255,0.1)', tickfont: { color: 'white' } },
                        yaxis: { title: 'Komponen Utama 2', gridcolor: 'rgba(255,255,255,0.1)', tickfont: { color: 'white' } },
                        hovermode: 'closest',
                        margin: { t: 60, l: 60, r: 30, b: 60 }
                    };

                    // Taruh grafik di dalam div ber-ID clusterChart
                    Plotly.newPlot('clusterChart', [trace], layout, {responsive: true});

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
    }
});
