// 1. Inisialisasi Supabase
// Ganti URL dan KEY di bawah ini dengan milik lu dari Dashboard Supabase
const SUPABASE_URL = 'https://xyzxyzxyz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJh...masukin_anon_key_lu_disini...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Update Angka di sebelah Slider secara real-time
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', (e) => {
        document.getElementById(`val-${e.target.id}`).innerText = e.target.value;
    });
});

// 3. Logika Submit Data
document.getElementById('kuesionerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman refresh

    const submitBtn = document.getElementById('submitBtn');
    const alertBox = document.getElementById('alertBox');
    
    submitBtn.innerText = 'Mengirim Data...';
    submitBtn.disabled = true;

    // Ambil Timestamp sekarang
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    // Siapkan struktur data sesuai tabel lu
    const dataResponden = {
        Timestamp: timestamp,
        Nama: document.getElementById('nama').value,
        Kelas: document.getElementById('kelas').value,
        Jurusan: document.getElementById('jurusan').value,
        Jenis_Kelamin: document.getElementById('jenis_kelamin').value,
        P1: parseInt(document.getElementById('p1').value),
        P2: parseInt(document.getElementById('p2').value)
        // INGAT: Tambahin P3 sampai P20 di sini nanti sesuai id di HTML
    };

    // Tembak data ke Supabase (ke tabel bernama 'kuesioner')
    const { data, error } = await supabase
        .from('kuesioner')
        .insert([dataResponden]);

    if (error) {
        alertBox.className = 'alert error';
        alertBox.innerText = `Gagal menyimpan data: ${error.message}`;
    } else {
        alertBox.className = 'alert success';
        alertBox.innerText = 'Terima kasih. Data evaluasi sensus berhasil disimpan.';
        document.getElementById('kuesionerForm').reset(); // Kosongin form
        
        // Reset angka slider ke 3
        document.querySelectorAll('.slider-val').forEach(span => span.innerText = '3');
    }

    alertBox.classList.remove('hidden');
    submitBtn.innerText = 'Kirim Evaluasi (Sensus)';
    submitBtn.disabled = false;
});
