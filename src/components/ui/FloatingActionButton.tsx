import Link from 'next/link'

interface FloatingActionButtonProps {
  href: string;
}

export default function FloatingActionButton({ href }: FloatingActionButtonProps) {
  return (
    <Link 
      href={href}
      className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </Link>
  )
}
