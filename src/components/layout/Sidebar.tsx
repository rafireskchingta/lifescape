import Link from 'next/link'
import Image from 'next/image'

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <Image src="/assets/logo.png" alt="LifeScape Logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
        <div>
          <h1 className="font-bold text-xl leading-none text-green-900 tracking-tight">LifeScape</h1>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Fokus Tergamifikasi</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
          <span className="text-lg">📱</span> Beranda
        </Link>
        <Link href="/activities" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 transition-colors">
          <span className="text-lg">📋</span> Aktivitas
        </Link>
        <Link href="/world" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
          <span className="text-lg">🌍</span> Dunia
        </Link>
        <Link href="/statistics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
          <span className="text-lg">📊</span> Statistik
        </Link>
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors">
          <span className="text-lg">👤</span> Profil
        </Link>
      </nav>

      <div className="p-6">
        <form action={async () => {
          'use server'
          const { logout } = await import('@/app/actions/auth')
          await logout()
        }}>
          <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-bold transition-colors shadow-sm">
            <span>🚪</span> Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
