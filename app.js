// GANTI BAGIAN INI DENGAN URL DAN KEY SUPABASE LU
const SUPABASE_URL = 'https://xyzxyzxyz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJh...masukin_anon_key_lu_disini...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Update Angka di sebelah Slider secara real-time
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', (e) => {
        document.getElementById(`val-${e.target.id}`).innerText = e.target.value;
    });
});

// Logika Submit Data
document.getElementById('kuesionerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const submitBtn = document.getElementById('submitBtn');
    const alertBox = document.getElementById('alertBox');
    
    submitBtn.innerText = 'Mengirim Data...';
    submitBtn.disabled = true;

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    // Ambil semua data dari P1 sampai P20
    const dataResponden = {
        Timestamp: timestamp,
        Nama: document.getElementById('nama').value,
        Kelas: document.getElementById('kelas').value,
        Jurusan: document.getElementById('jurusan').value,
        Jenis_Kelamin: document.getElementById('jenis_kelamin').value,
        P1: parseInt(document.getElementById('p1').value),
        P2: parseInt(document.getElementById('p2').value),
        P3: parseInt(document.getElementById('p3').value),
        P4: parseInt(document.getElementById('p4').value),
        P5: parseInt(document.getElementById('p5').value),
        P6: parseInt(document.getElementById('p6').value),
        P7: parseInt(document.getElementById('p7').value),
        P8: parseInt(document.getElementById('p8').value),
        P9: parseInt(document.getElementById('p9').value),
        P10: parseInt(document.getElementById('p10').value),
        P11: parseInt(document.getElementById('p11').value),
        P12: parseInt(document.getElementById('p12').value),
        P13: parseInt(document.getElementById('p13').value),
        P14: parseInt(document.getElementById('p14').value),
        P15: parseInt(document.getElementById('p15').value),
        P16: parseInt(document.getElementById('p16').value),
        P17: parseInt(document.getElementById('p17').value),
        P18: parseInt(document.getElementById('p18').value),
        P19: parseInt(document.getElementById('p19').value),
        P20: parseInt(document.getElementById('p20').value)
    };

    // Tembak data ke tabel 'kuesioner' di Supabase
    const { data, error } = await supabase
        .from('kuesioner')
        .insert([dataResponden]);

    if (error) {
        alertBox.className = 'alert error';
        alertBox.innerText = `Gagal menyimpan data: ${error.message}`;
    } else {
        alertBox.className = 'alert success';
        alertBox.innerText = 'Terima kasih. Data evaluasi sensus berhasil disimpan.';
        document.getElementById('kuesionerForm').reset(); 
        
        // Kembalikan semua indikator angka slider ke 3
        document.querySelectorAll('.slider-val').forEach(span => span.innerText = '3');
    }

    alertBox.classList.remove('hidden');
    submitBtn.innerText = 'Kirim Evaluasi (Sensus)';
    submitBtn.disabled = false;
});
