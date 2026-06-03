'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Beranda',
      href: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      )
    },
    {
      name: 'Aktivitas',
      href: '/activities',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5c0-.663-.414-1.238-1.011-1.439a1.696 1.696 0 00-1.745.47l-1.393 1.393a2.25 2.25 0 00-.659 1.591v2.96c0 .414.236.786.602 1.057l1.737 1.285c.348.257.558.66.558 1.092v3.742M13.5 4.5c.663 0 1.238.414 1.439 1.011a1.696 1.696 0 01-.47 1.745l-1.393 1.393a2.25 2.25 0 01-1.591.659h-2.96c-.414 0-.786-.236-1.057-.602l-1.285-1.737a1.5 1.5 0 01-.11-1.564l1.196-2.072M13.5 4.5c-.328-.655-.99-1.125-1.75-1.125s-1.422.47-1.75 1.125" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 100-6 3 3 0 000 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25V15" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-3 4.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l3 4.5" />
        </svg>
      )
    },
    {
      name: 'Dunia',
      href: '/world', // Not implemented yet, keeping as /dashboard for now or /world
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    },
    {
      name: 'Statistik',
      href: '/statistics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    },
    {
      name: 'Profil',
      href: '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F8FAFC] border-t border-gray-200 pb-safe z-40">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#4CAF50] text-[#111827] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="mb-1">
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-[#111827]' : ''}`}>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
