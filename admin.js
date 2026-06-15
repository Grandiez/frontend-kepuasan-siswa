document.addEventListener('DOMContentLoaded', () => {

    // --- KAMUS TEKS PERTANYAAN RESMI ---
    const listPertanyaan = [
        "1. Kelengkapan fasilitas lab/bengkel untuk praktik (P1)",
        "2. Kondisi dan kelayakan peralatan belajar di kelas (P2)",
        "3. Kenyamanan dan keamanan area sekolah secara umum (P3)",
        "4. Akses dan kebersihan fasilitas umum (Toilet, Kantin) (P4)",
        "5. Dukungan fasilitas terhadap kelancaran belajar (P5)",
        "6. Kesesuaian materi dengan kebutuhan industri/dunia kerja (P6)",
        "7. Tingkat kemudahan dalam memahami materi yang diajarkan (P7)",
        "8. Kesesuaian kurikulum dengan minat dan bakat siswa (P8)",
        "9. Variasi metode pembelajaran yang digunakan (P9)",
        "10. Manfaat materi pelajaran untuk masa depan karir (P10)",
        "11. Penguasaan materi oleh guru saat mengajar di kelas (P11)",
        "12. Kejelasan guru dalam menyampaikan penjelasan (P12)",
        "13. Sikap keteladanan, kedisiplinan, dan etika guru (P13)",
        "14. Kemudahan menghubungi guru saat mengalami kesulitan belajar (P14)",
        "15. Ketepatan waktu guru dalam mengisi jam pelajaran (P15)",
        "16. Tingkat kebersihan lingkungan sekolah secara keseluruhan (P16)",
        "17. Keamanan sekolah dari gangguan luar/ketertiban (P17)",
        "18. Kondusivitas suasana di dalam kelas saat belajar (P18)",
        "19. Keharmonisan hubungan antar sesama siswa dan warga sekolah (P19)",
        "20. Penerapan budaya sopan santun (5S) di lingkungan sekolah (P20)"
    ];

    // --- GENERATE PERTANYAAN SECARA KINETIK VIA JS ---
    const container = document.getElementById('pertanyaanContainer');
    if(container) {
        let htmlPertanyaan = '';
        listPertanyaan.forEach((tanya, index) => {
            let id = `P${index + 1}`;
            htmlPertanyaan += `
                <div class="slider-container">
                    <div class="slider-label">
                        <span style="flex:1;">${tanya}</span>
                        <span id="val_${id}" style="font-weight:600; color:#60a5fa; font-size: 1.15rem; margin-left: 10px;">3</span>
                    </div>
                    <input type="range" id="${id}" min="1" max="5" value="3" oninput="document.getElementById('val_${id}').innerText = this.value">
                </div>
            `;
        });
        container.innerHTML = htmlPertanyaan;
    }

    // --- DEKLARASI CREDENTIAL DATABASE SUPABASE DIRECT ---
    const SUPABASE_URL = "https://dzatrsuzjyehrsynjvvm.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YXRyc3V6anllaHJzeW5qdnZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ4NjM4MiwiZXhwIjoyMDk0MDYyMzgyfQ.yyaHi8zOeobXgucE1B2JVBM-oxD49s5vFnG5nmdceGs";

    // --- ELEMENT SELECTOR MANAGER ---
    const navKuesioner = document.getElementById('navKuesioner');
    const navAdmin = document.getElementById('navAdmin');
    
    const kuesionerSection = document.getElementById('kuesionerSection');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    const partBiodata = document.getElementById('partBiodata');
    const partPertanyaan = document.getElementById('partPertanyaan');
    const biodataAlert = document.getElementById('biodataAlert');

    // --- ALUR LOGIKA STEP KUESIONER SISWA ---
    document.getElementById('btnKePertanyaan').addEventListener('click', () => {
        const nama = document.getElementById('namaSiswa').value.trim();
        const kelas = document.getElementById('kelasSiswa').value;
        const jurusan = document.getElementById('jurusanSiswa').value;
        const gender = document.getElementById('genderSiswa').value;

        if(!nama || !kelas || !jurusan || !gender) {
            biodataAlert.innerText = "⚠️ Seluruh data diri wajib dilengkapi sebelum mengisi pertanyaan.";
            biodataAlert.classList.remove('hidden');
            return;
        }
        
        biodataAlert.classList.add('hidden');
        document.getElementById('haloSiswa').innerText = `Halo, ${nama}`;
        partBiodata.classList.add('hidden');
        partPertanyaan.classList.remove('hidden');
    });

    document.getElementById('btnBackBiodata').addEventListener('click', () => {
        partPertanyaan.classList.add('hidden');
        partBiodata.classList.remove('hidden');
    });

    // --- AKSI KIRIM DATA KE DATABASE ---
    document.getElementById('btnSubmitKuesioner').addEventListener('click', async () => {
        const btnSubmit = document.getElementById('btnSubmitKuesioner');
        const alertBox = document.getElementById('kuesionerAlert');
        
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Merekam ke Server...";
        
        let payload = {
            "Timestamp": new Date().toLocaleString("id-ID"),
            "Nama": document.getElementById('namaSiswa').value.trim(),
            "Kelas": document.getElementById('kelasSiswa').value,
            "Jurusan": document.getElementById('jurusanSiswa').value,
            "Jenis_Kelamin": document.getElementById('genderSiswa').value
        };

        for(let i=1; i<=20; i++) {
            payload[`P${i}`] = parseInt(document.getElementById(`P${i}`).value);
        }

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/kuesioner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if(response.ok) {
                alertBox.innerText = "✅ Terima kasih! Data evaluasi sukses direkam. Kontribusi Anda sangat berharga bagi pemenuhan data sensus kepuasan komputasi SMK N 1 Dawuan.";
                alertBox.className = "alert success";
                alertBox.classList.remove('hidden');
                document.getElementById('formKuesioner').reset();
                setTimeout(() => {
                    alertBox.classList.add('hidden');
                    partPertanyaan.classList.add('hidden');
                    partBiodata.classList.remove('hidden');
                    for(let i=1; i<=20; i++) document.getElementById(`val_P${i}`).innerText = "3";
                }, 4000);
            } else {
                const errData = await response.json();
                throw new Error(errData.message || "Koneksi database terputus.");
            }
        } catch (error) {
            alertBox.innerText = `❌ Gagal menyimpan: ${error.message}`;
            alertBox.className = "alert error";
            alertBox.classList.remove('hidden');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Kirim Komit Evaluasi ➔";
        }
    });

    // --- SISTEM PINDAH NAVIGASI (BEBAS BLOKIR KLIK) ---
    navKuesioner.addEventListener('click', () => {
        navKuesioner.classList.add('active');
        navAdmin.classList.remove('active');
        kuesionerSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
        dashboardSection.classList.add('hidden');
    });

    navAdmin.addEventListener('click', () => {
        navAdmin.classList.add('active');
        navKuesioner.classList.remove('active');
        kuesionerSection.classList.add('hidden');
        if (!dashboardSection.classList.contains('hidden')) {
            // Jika admin sudah terotentikasi sebelumnya
        } else {
            loginSection.classList.remove('hidden');
        }
    });

    // --- PROSES OTENTIKASI (ANTI ERROR ENTER KEYBOARD) ---
    const formLoginNode = document.getElementById('loginForm');
    if(formLoginNode) {
        formLoginNode.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah halaman reload saat tekan Enter
            
            // PENTING: Pakai .trim() agar spasi tidak sengaja dari HP terhapus otomatis
            const userVal = document.getElementById('username').value.trim();
            const passVal = document.getElementById('password').value.trim();

            if(userVal === 'admin' && passVal === 'admin123') {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                document.getElementById('loginAlert').classList.add('hidden');
                formLoginNode.reset();
            } else {
                document.getElementById('loginAlert').innerText = "❌ Akses ditolak. Username atau Password salah.";
                document.getElementById('loginAlert').classList.remove('hidden');
            }
        });
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        navKuesioner.classList.add('active');
        navAdmin.classList.remove('active');
        kuesionerSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
    });

    // --- MANAGEMEN ANALISIS GRAFIK EXECUTION ---
    let globalData = [];
    let variansiServer = 0;

    const prosesBtn = document.getElementById('prosesBtn');
    const statusText = document.getElementById('statusText');
    const panelDashboard = document.getElementById('panelDashboard');

    const filJurusan = document.getElementById('filterJurusan');
    const filKelas = document.getElementById('filterKelas');
    const filGender = document.getElementById('filterGender');

    if(prosesBtn) {
        prosesBtn.addEventListener('click', async () => {
            prosesBtn.disabled = true;
            prosesBtn.innerText = "Mengeksekusi Machine Learning (Loading...)";
            statusText.classList.remove('hidden');
            statusText.innerText = "Menghubungi Klaster Render Core Engine...";
            statusText.className = "alert"; 

            try {
                const RENDER_URL = 'https://backend-komputasi-pca.onrender.com/proses-klaster?k=3';
                const response = await fetch(RENDER_URL);
                const resData = await response.json();

                if(resData.status === "success") {
                    globalData = resData.data_lengkap;
                    variansiServer = resData.variansi_kumulatif;
                    
                    statusText.innerText = `✅ Validasi sukses. Komputasi PCA & K-Means berhasil merangkum data responden.`;
                    statusText.classList.add('success');
                    panelDashboard.classList.remove('hidden');

                    isiDropdown(filJurusan, [...new Set(globalData.map(item => item.JURUSAN))]);
                    isiDropdown(filKelas, [...new Set(globalData.map(item => item.KELAS))]);
                    isiDropdown(filGender, [...new Set(globalData.map(item => item.JENIS_KELAMIN))]);

                    terapkanFilterDanRender();
                } else {
                    throw new Error(resData.detail);
                }
            } catch (error) {
                statusText.innerText = `❌ Error API: ${error.message}`;
                statusText.classList.add('error');
            } finally {
                prosesBtn.disabled = false;
                prosesBtn.innerText = "🚀 Tarik Ulang Data Server";
            }
        });
    }

    [filJurusan, filKelas, filGender].forEach(el => {
        if(el) el.addEventListener('change', terapkanFilterDanRender);
    });

    function isiDropdown(element, arrayData) {
        element.innerHTML = '<option value="ALL">Semua</option>';
        arrayData.forEach(val => {
            if(val && val !== "Tidak Diketahui") element.innerHTML += `<option value="${val}">${val}</option>`;
        });
    }

    function terapkanFilterDanRender() {
        const jVal = filJurusan.value;
        const kVal = filKelas.value;
        const gVal = filGender.value;

        const filteredData = globalData.filter(d => {
            return (jVal === "ALL" || d.JURUSAN == jVal) &&
                   (kVal === "ALL" || d.KELAS == kVal) &&
                   (gVal === "ALL" || d.JENIS_KELAMIN == gVal);
        });

        document.getElementById('metricTotal').innerText = filteredData.length;
        document.getElementById('metricVariansi').innerText = variansiServer + "%";

        if(filteredData.length === 0) {
            document.getElementById('investigasiContainer').innerHTML = "<p style='color:#fca5a5;'>Data kosong pada filter ini.</p>";
            return;
        }

        renderSemuaGrafik(filteredData);
    }

    function renderSemuaGrafik(data) {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        // 1. SCATTER 3D INTERAKTIF
        const trace3D = {
            x: data.map(d => d.PC1), y: data.map(d => d.PC2), z: data.map(d => d.PC3),
            mode: 'markers', type: 'scatter3d',
            text: data.map(d => `<b>${d.NAMA}</b><br>Kls: ${d.KELAS} | Jur: ${d.JURUSAN}`),
            hoverinfo: 'text',
            marker: { size: 5, color: data.map(d => colors[d.CLUSTER % colors.length]), line: {width: 0.5, color: 'white'}, opacity: 0.9 }
        };
        Plotly.newPlot('scatter3DChart', [trace3D], {
            title: { text: 'Peta Sebaran 3D Komponen Klaster Siswa', font: {color:'white'} },
            paper_bgcolor: 'rgba(0,0,0,0)', scene: { xaxis:{color:'white'}, yaxis:{color:'white'}, zaxis:{color:'white'} },
            margin: { l: 0, r: 0, b: 0, t: 40 }
        }, {responsive: true});

        // REKAYASA DIMENSI MAKSIMAL
        data.forEach(d => {
            d.Fasilitas = (d.P1+d.P2+d.P3+d.P4+d.P5)/5;
            d.Kurikulum = (d.P6+d.P7+d.P8+d.P9+d.P10)/5;
            d.Guru = (d.P11+d.P12+d.P13+d.P14+d.P15)/5;
            d.Lingkungan = (d.P16+d.P17+d.P18+d.P19+d.P20)/5;
        });

        const meanGlobal = {
            'Fasilitas': data.reduce((sum, d) => sum + d.Fasilitas, 0) / data.length,
            'Kurikulum': data.reduce((sum, d) => sum + d.Kurikulum, 0) / data.length,
            'Guru': data.reduce((sum, d) => sum + d.Guru, 0) / data.length,
            'Lingkungan': data.reduce((sum, d) => sum + d.Lingkungan, 0) / data.length
        };

        // 2. RADAR CHART SULTAN
        const traceRadar = {
            type: 'scatterpolar',
            r: [meanGlobal.Fasilitas, meanGlobal.Kurikulum, meanGlobal.Guru, meanGlobal.Lingkungan, meanGlobal.Fasilitas],
            theta: ['Fasilitas', 'Kurikulum', 'Guru', 'Lingkungan', 'Fasilitas'],
            fill: 'toself', line: {color: '#60a5fa', width: 2}, fillcolor: 'rgba(96, 165, 250, 0.2)'
        };
        Plotly.newPlot('radarChart', [traceRadar], {
            paper_bgcolor: 'rgba(0,0,0,0)', polar: { bgcolor: 'rgba(0,0,0,0)', radialaxis: {visible: true, range: [0, 5], gridcolor:'rgba(255,255,255,0.1)', color:'white'}, angularaxis: {gridcolor:'rgba(255,255,255,0.1)', color:'white'} },
            margin: { l: 40, r: 40, b: 40, t: 40 }
        }, {responsive: true});

        // 3. DONUT CHART
        const hitungJurusan = {};
        data.forEach(d => { hitungJurusan[d.JURUSAN] = (hitungJurusan[d.JURUSAN] || 0) + 1; });
        const traceDonut = {
            labels: Object.keys(hitungJurusan), values: Object.values(hitungJurusan),
            type: 'pie', hole: 0.5, textinfo: 'label+percent',
            marker: {colors: ['#1e3a8a', '#5b21b6', '#0f766e', '#991b1b', '#9a3412']}
        };
        Plotly.newPlot('donutChart', [traceDonut], { paper_bgcolor: 'rgba(0,0,0,0)', font:{color:'white'}, showlegend: false, margin: { l: 20, r: 20, b: 20, t: 20 } }, {responsive: true});

        // 4. BAR CHART MULTI-KLASTER
        const clusterMap = {};
        data.forEach(d => {
            if(!clusterMap[d.CLUSTER]) clusterMap[d.CLUSTER] = {F:0, K:0, G:0, L:0, count:0, rawData: []};
            clusterMap[d.CLUSTER].F += d.Fasilitas; clusterMap[d.CLUSTER].K += d.Kurikulum;
            clusterMap[d.CLUSTER].G += d.Guru; clusterMap[d.CLUSTER].L += d.Lingkungan;
            clusterMap[d.CLUSTER].count += 1;
            clusterMap[d.CLUSTER].rawData.push(d);
        });

        const cLabels = [], cF = [], cK = [], cG = [], cL = [];
        Object.keys(clusterMap).sort().forEach(c => {
            const cm = clusterMap[c];
            cLabels.push(`Klaster ${c} (${cm.count} Siswa)`);
            cF.push(cm.F / cm.count); cK.push(cm.K / cm.count);
            cG.push(cm.G / cm.count); cL.push(cm.L / cm.count);
        });

        const traceBar = [
            {x: cLabels, y: cF, name: 'Fasilitas', type: 'bar', marker:{color: '#3b82f6'}},
            {x: cLabels, y: cK, name: 'Kurikulum', type: 'bar', marker:{color: '#f59e0b'}},
            {x: cLabels, y: cG, name: 'Guru', type: 'bar', marker:{color: '#10b981'}},
            {x: cLabels, y: cL, name: 'Lingkungan', type: 'bar', marker:{color: '#ef4444'}}
        ];
        Plotly.newPlot('barChart', traceBar, {
            barmode: 'group', paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font:{color:'white'},
            margin: { l: 40, r: 10, b: 40, t: 40 }
        }, {responsive: true});

        // 5. SISTEM INVESTIGASI OTOMATIS
        const kamusMasalah = {
            'P1': 'Fasilitas pendukung dirasa kurang lengkap', 'P2': 'Peralatan belajar banyak rusak',
            'P3': 'Area sekolah dirasa kurang aman', 'P4': 'Lokasi fasilitas sulit dijangkau',
            'P5': 'Fasilitas belum maksimal membantu belajar', 'P6': 'Materi kurang relevan dengan industri',
            'P7': 'Siswa kesulitan memahami materi', 'P8': 'Kurikulum belum sesuai minat',
            'P9': 'Metode pembelajaran membosankan', 'P10': 'Materi dirasa kurang bermanfaat',
            'P11': 'Guru kurang menguasai materi', 'P12': 'Penjelasan guru kurang jelas',
            'P13': 'Guru kurang memberi teladan', 'P14': 'Guru sulit dihubungi saat kesulitan',
            'P15': 'Guru sering terlambat mengajar', 'P16': 'Kebersihan lingkungan kurang terjaga',
            'P17': 'Lingkungan sekolah rawan gangguan', 'P18': 'Suasana kelas kurang kondusif',
            'P19': 'Hubungan sosial kurang harmonis', 'P20': 'Budaya sopan santun belum maksimal'
        };

        const kamusSolusi = {
