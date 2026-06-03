import Link from 'next/link'
import Image from 'next/image'

interface MobileHeaderProps {
  avatarUrl?: string | null;
  username?: string | null;
}

export default function MobileHeader({ avatarUrl, username }: MobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-[#F8FAFC] sticky top-0 z-40 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <div 
            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden bg-cover bg-center shadow-sm"
            style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }}
          >
            {!avatarUrl && (username ? username.charAt(0).toUpperCase() : 'U')}
          </div>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="LifeScape Logo" width={24} height={24} className="w-6 h-6 rounded-md" />
          <h1 className="font-bold text-2xl leading-none text-gray-900 tracking-tight">LifeScape</h1>
        </Link>
      </div>
      
      <button className="w-10 h-10 flex items-center justify-center text-green-700 hover:bg-green-50 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </button>
    </header>
  )
}
