import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-green-200">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold">LS</div>
            <span className="font-bold text-xl text-green-900 tracking-tight">LifeScape</span>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-green-700">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-green-700">How It Works</a>
            <a href="#districts" className="text-sm font-medium text-gray-500 hover:text-green-700">Districts</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-green-700">Log In</Link>
            <Link href="/register" className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span>🎯</span> Gamified Focus for Modern Achievers
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
              Bangun Duniamu<br/>
              <span className="text-green-700">Melalui Progres Nyata</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Ubah tugas harian, kebiasaan, dan tujuan jangka panjangmu menjadi pulau visual yang berkembang seiring pencapaianmu. Produktivitas yang menenangkan, tanpa tekanan berlebih.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="/login" className="px-8 py-4 bg-green-700 hover:bg-green-800 text-white text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-green-700/25">
                Mulai Perjalananmu
              </Link>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/50 flex items-center justify-center shadow-2xl">
             {/* Placeholder for 3D Isometric Island */}
             <div className="text-center">
               <div className="text-6xl mb-4">🏝️</div>
               <p className="text-green-800 font-semibold">3D Island Illustration</p>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Alat Produktivitas yang Terasa Seperti Bermain</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Kami menggabungkan efisiensi struktural dengan elemen visual gamifikasi untuk menciptakan ruang kerja yang mendukung kesejahteraan mentalmu.</p>
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
              <h3 className="text-xl font-bold mb-3">Catat Tugas</h3>
              <p className="text-gray-500">Tambahkan kegiatan harian atau kebiasaan baru ke dalam daftar Quests kamu.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-2 border-green-600 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mb-6 bg-white relative">2</div>
              <h3 className="text-xl font-bold mb-3">Selesaikan & Kumpulkan</h3>
              <p className="text-gray-500">Coret tugas dan kumpulkan resource untuk membangun distrik spesifik.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-2 border-green-600 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mb-6 bg-white relative">3</div>
              <h3 className="text-xl font-bold mb-3">Perluas Wilayah</h3>
              <p className="text-gray-500">Lihat pulau visualmu bertambah besar dan indah merepresentasikan kerja kerasmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Siap Membangun Duniamu?</h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto">Bergabunglah dan mulailah perjalanan produktivitas yang terasa seperti merawat taman zen digital.</p>
            <Link href="/login" className="inline-block px-8 py-4 bg-white text-green-800 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
              Mulai Perjalananmu
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>© 2026 LifeScape. All rights reserved.</p>
      </footer>
    </div>
  )
}
