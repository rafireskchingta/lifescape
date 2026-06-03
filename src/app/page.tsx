import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-green-200">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo.png" alt="LifeScape Logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">LifeScape</span>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-green-700">Fitur</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-green-700">Cara Kerja</a>
            <a href="#districts" className="text-sm font-medium text-gray-500 hover:text-green-700">Districts</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-green-700">Masuk</Link>
            <Link href="/register" className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm">Daftar</Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="text-gray-500 hover:text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Gamified Focus untuk Generasi Modern
            </div>
            <h1 className="text-[40px] leading-[1.1] md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A]">
              Bangun Duniamu<br/>
              <span className="text-green-700">Melalui Progres Nyata</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0">
              Ubah tugas harianmu menjadi sebuah Epic Quest. Dapatkan XP, pertahankan Streak-mu, dan bangun District virtualmu sendiri dengan menyelesaikan pekerjaan di dunia nyata.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto pt-2">
              <Link href="/register" className="w-full md:w-auto text-center px-8 py-3.5 bg-green-700 hover:bg-green-800 text-white text-base font-bold rounded-full transition-all shadow-lg hover:shadow-green-700/25">
                Mulai Petualangan
              </Link>
              <Link href="#how-it-works" className="w-full md:w-auto text-center px-8 py-3.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-base font-bold rounded-full transition-all shadow-sm">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/50 flex items-center justify-center shadow-2xl">
             {/* Placeholder for 3D Isometric Island */}
             <div className="text-center">
               <div className="text-green-800 font-semibold bg-green-50 px-6 py-12 rounded-3xl border border-green-100">
                 [Ilustrasi Pulau 3D]
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-24 bg-[#EEF2F6] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Produktivitas yang<br className="md:hidden" /> Menenangkan</h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">Kami menggabungkan efisiensi struktural dengan elemen visual yang menciptakan ruang kerja tanpa beban.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700 mb-6 text-xl">👁️</div>
                <h3 className="text-xl font-bold mb-3">Visualisasi Progresi</h3>
                <p className="text-gray-500">Setiap tugas yang kamu selesaikan tidak hanya dicentang, tetapi membangun struktur fisik di pulau digitalmu. Lihat duniamu berkembang seiring usahamu.</p>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 text-xl">🔥</div>
                <h3 className="text-xl font-bold mb-3">Rantai Kebiasaan</h3>
                <p className="text-gray-500">Bangun momentum dengan streak harian. Indikator visual api ringan akan menyala saat kamu konsisten, tanpa hukuman keras jika terlewat.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">Cara Membangun Pulau-mu</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gray-100 -z-10"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-2 border-green-600 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mb-6 bg-white relative">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Selesaikan Quests</h3>
              <p className="text-gray-500 leading-relaxed">Kelola tugas harianmu layaknya misi game. Selesaikan pekerjaan dan dapatkan reward langsung berupa XP.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Level Up Terus</h3>
              <p className="text-gray-500 leading-relaxed">Kumpulkan XP dan tingkatkan levelmu. Semakin produktif kamu, semakin tinggi Rank yang kamu raih.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bangun District-mu</h3>
              <p className="text-gray-500 leading-relaxed">Gunakan poin yang kamu kumpulkan untuk membangun dan mengembangkan District virtual unik milikmu sendiri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-[#115E38] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Membangun<br className="md:hidden"/> Duniamu?</h2>
            <p className="text-green-100 text-sm md:text-base mb-8 max-w-xl mx-auto">Bergabunglah dengan ribuan pengguna yang telah menemukan keseimbangan antara produktivitas dan ketenangan.</p>
            <Link href="/register" className="inline-block px-8 py-3.5 bg-white text-green-800 font-bold rounded-full hover:bg-gray-50 transition-colors shadow-lg w-full md:w-auto">
              Mulai Petualangan
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>© 2026 LifeScape. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  )
}
