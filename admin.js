document.addEventListener('DOMContentLoaded', () => {
    // --- KAMUS MASALAH & SOLUSI ---
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
        'P1': 'Inventarisasi lab dan ajukan pengadaan alat.', 'P2': 'Maintenance rutin peralatan.',
        'P3': 'Tingkatkan keamanan sekolah.', 'P4': 'Perbaiki layout fasilitas publik.',
        'P5': 'Evaluasi penggunaan lab.', 'P6': 'Undang praktisi dan sinkronisasi kurikulum.',
        'P7': 'Sederhanakan modul pembelajaran.', 'P8': 'Perkuat program konseling.',
        'P9': 'Pelatihan guru untuk metode interaktif.', 'P10': 'Seminar prospek karir.',
        'P11': 'Sertakan guru dalam magang industri.', 'P12': 'Kumpulkan feedback metode mengajar.',
        'P13': 'Tegakkan kode etik pengajar.', 'P14': 'Sediakan jam konsultasi siswa.',
        'P15': 'Terapkan presensi ketat bagi pengajar.', 'P16': 'Galakkan program kebersihan.',
        'P17': 'Tindak tegas pelanggaran ketertiban.', 'P18': 'Perbaiki fasilitas kelas.',
        'P19': 'Adakan kegiatan kebersamaan.', 'P20': 'Kampanyekan budaya 5S.'
    };

    // --- LOGIKA LOGIN ---
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(document.getElementById('username').value === 'admin' && document.getElementById('password').value === 'admin123') {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
            } else {
                document.getElementById('loginAlert').innerText = "Username/Password salah!";
                document.getElementById('loginAlert').classList.remove('hidden');
            }
        });
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    });

    // --- LOGIKA DASHBOARD ---
    let globalData = [];
    let variansiServer = 0;

    const prosesBtn = document.getElementById('prosesBtn');
    const statusText = document.getElementById('statusText');
    const panelDashboard = document.getElementById('panelDashboard');

    // Filter Dropdowns
    const filJurusan = document.getElementById('filterJurusan');
    const filKelas = document.getElementById('filterKelas');
    const filGender = document.getElementById('filterGender');

    prosesBtn.addEventListener('click', async () => {
        prosesBtn.disabled = true;
        prosesBtn.innerText = "Memproses (Loading...)";
        statusText.classList.remove('hidden');
        statusText.innerText = "Menghubungi Server Render...";
        statusText.className = "alert"; // reset color

        try {
            // GANTI DENGAN URL RENDER LU
            const RENDER_URL = 'https://backend-komputasi-pca.onrender.com/proses-klaster?k=3';
            const response = await fetch(RENDER_URL);
            const resData = await response.json();

            if(resData.status === "success") {
                globalData = resData.data_lengkap;
                variansiServer = resData.variansi_kumulatif;
                
                statusText.innerText = `✅ Sukses menarik ${globalData.length} data responden.`;
                statusText.classList.add('success');
                panelDashboard.classList.remove('hidden');

                // Isi Dropdown Filter Unik
                isiDropdown(filJurusan, [...new Set(globalData.map(item => item.JURUSAN))]);
                isiDropdown(filKelas, [...new Set(globalData.map(item => item.KELAS))]);
                isiDropdown(filGender, [...new Set(globalData.map(item => item.JENIS_KELAMIN))]);

                // Render UI Pertama Kali
                terapkanFilterDanRender();

            } else {
                throw new Error(resData.detail);
            }
        } catch (error) {
            statusText.innerText = `❌ Error: ${error.message}`;
            statusText.classList.add('error');
        } finally {
            prosesBtn.disabled = false;
            prosesBtn.innerText = "🚀 Tarik Ulang Data";
        }
    });

    // Event Listener Filter
    [filJurusan, filKelas, filGender].forEach(el => el.addEventListener('change', terapkanFilterDanRender));

    function isiDropdown(element, arrayData) {
        element.innerHTML = '<option value="ALL">Semua</option>';
        arrayData.forEach(val => {
            if(val) element.innerHTML += `<option value="${val}">${val}</option>`;
        });
    }

    function terapkanFilterDanRender() {
        // Proses Filter Data
        const jVal = filJurusan.value;
        const kVal = filKelas.value;
        const gVal = filGender.value;

        const filteredData = globalData.filter(d => {
            return (jVal === "ALL" || d.JURUSAN == jVal) &&
                   (kVal === "ALL" || d.KELAS == kVal) &&
                   (gVal === "ALL" || d.JENIS_KELAMIN == gVal);
        });

        // Update Metrik Atas
        document.getElementById('metricTotal').innerText = filteredData.length;
        document.getElementById('metricVariansi').innerText = variansiServer + "%";

        if(filteredData.length === 0) {
            document.getElementById('investigasiContainer').innerHTML = "<p style='color:red;'>Data tidak ditemukan.</p>";
            return;
        }

        renderSemuaGrafik(filteredData);
    }

    function renderSemuaGrafik(data) {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        // --- 1. SCATTER 3D ---
        const trace3D = {
            x: data.map(d => d.PC1), y: data.map(d => d.PC2), z: data.map(d => d.PC3),
            mode: 'markers', type: 'scatter3d',
            text: data.map(d => `<b>${d.NAMA}</b><br>Kls: ${d.KELAS} | Jur: ${d.JURUSAN}`),
            hoverinfo: 'text',
            marker: {
                size: 5, color: data.map(d => colors[d.CLUSTER % colors.length]),
                line: {width: 0.5, color: 'white'}, opacity: 0.9
            }
        };
        Plotly.newPlot('scatter3DChart', [trace3D], {
            title: { text: 'Sebaran 3D Klaster Siswa', font: {color:'white'} },
            paper_bgcolor: 'rgba(0,0,0,0)', scene: { xaxis:{color:'white'}, yaxis:{color:'white'}, zaxis:{color:'white'} }
        }, {responsive: true});

        // --- PREKONDISI MATEMATIKA DIMENSI ---
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

        // --- 2. RADAR CHART ---
        const traceRadar = {
            type: 'scatterpolar',
            r: [meanGlobal.Fasilitas, meanGlobal.Kurikulum, meanGlobal.Guru, meanGlobal.Lingkungan, meanGlobal.Fasilitas],
            theta: ['Fasilitas', 'Kurikulum', 'Guru', 'Lingkungan', 'Fasilitas'],
            fill: 'toself', line: {color: 'cyan'}
        };
        Plotly.newPlot('radarChart', [traceRadar], {
            paper_bgcolor: 'rgba(0,0,0,0)', polar: { bgcolor: 'rgba(0,0,0,0)', radialaxis: {visible: true, range: [0, 5], color:'white'}, angularaxis: {color:'white'} }
        }, {responsive: true});

        // --- 3. DONUT CHART (Proporsi Jurusan) ---
        const hitungJurusan = {};
        data.forEach(d => { hitungJurusan[d.JURUSAN] = (hitungJurusan[d.JURUSAN] || 0) + 1; });
        const traceDonut = {
            labels: Object.keys(hitungJurusan), values: Object.values(hitungJurusan),
            type: 'pie', hole: 0.5, textinfo: 'label+percent',
            marker: {colors: ['#1e3a8a', '#5b21b6', '#0f766e', '#991b1b', '#9a3412']}
        };
        Plotly.newPlot('donutChart', [traceDonut], { paper_bgcolor: 'rgba(0,0,0,0)', font:{color:'white'}, showlegend: false }, {responsive: true});

        // --- 4. BAR CHART (Rata-rata per Klaster) ---
        // Kelompokkan data per klaster
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
            cLabels.push(`Klaster ${c} (${cm.count})`);
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
            barmode: 'group', paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font:{color:'white'}
        }, {responsive: true});

        // --- 5. BEDAH INVESTIGASI OTOMATIS (HTML Generator) ---
        let htmlInvestigasi = '';
        Object.keys(clusterMap).sort().forEach(c => {
            const cm = clusterMap[c];
            const avgF = cm.F/cm.count, avgK = cm.K/cm.count, avgG = cm.G/cm.count, avgL = cm.L/cm.count;
            
            // Cari Dimensi Terburuk
            const arrDims = [ {name: 'Fasilitas', val: avgF}, {name: 'Kurikulum', val: avgK}, {name: 'Guru', val: avgG}, {name: 'Lingkungan', val: avgL} ];
            arrDims.sort((a,b) => a.val - b.val);
            const dimTerburuk = arrDims[0];

            // Cari P-Berapa yang paling hancur di dimensi tersebut
            let mapP = {}; let startP=0, endP=0;
            if(dimTerburuk.name === 'Fasilitas') { startP=1; endP=5;}
            else if(dimTerburuk.name === 'Kurikulum') { startP=6; endP=10;}
            else if(dimTerburuk.name === 'Guru') { startP=11; endP=15;}
            else { startP=16; endP=20;}

            for(let i=startP; i<=endP; i++) {
                let key = `P${i}`;
                let totalP = cm.rawData.reduce((sum, d) => sum + d[key], 0);
                mapP[key] = totalP / cm.count;
            }

            let pTerburuk = Object.keys(mapP).reduce((a, b) => mapP[a] < mapP[b] ? a : b);
            let skorPTerburuk = mapP[pTerburuk];

            let glassColor = "glass-green", status = "Aman";
            if(skorPTerburuk < 2.0) { glassColor = "glass-red"; status = "Kritis"; }
            else if(skorPTerburuk < 3.0) { glassColor = "glass-orange"; status = "Perlu Perbaikan"; }
            else if(skorPTerburuk < 4.0) { glassColor = "glass-blue"; status = "Cukup Memuaskan"; }

            htmlInvestigasi += `
                <div class="glass-alert ${glassColor}" style="margin-bottom: 15px; padding: 15px; border-radius:10px; background: rgba(255,255,255,0.05); border-left: 5px solid ${glassColor === 'glass-red' ? 'red' : 'white'};">
                    <h4 style="margin-top:0;">Klaster ${c} - Fokus: ${dimTerburuk.name} (${status})</h4>
                    <p style="margin: 5px 0;"><b>Akar Masalah Utama:</b> <i>"${kamusMasalah[pTerburuk]}"</i> (Skor: ${skorPTerburuk.toFixed(2)})</p>
                    <p style="margin: 5px 0;"><b>Saran Solusi:</b> ${kamusSolusi[pTerburuk]}</p>
                </div>
            `;
        });
        
        document.getElementById('investigasiContainer').innerHTML = htmlInvestigasi;
    }
});
