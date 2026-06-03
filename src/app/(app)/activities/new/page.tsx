import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AddActivityForm from '@/components/activities/AddActivityForm'

export default async function NewActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/activities" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tambah Misi Baru</h1>
          <p className="text-sm text-gray-500">Buat tugas baru untuk mendapatkan XP</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <AddActivityForm />
      </div>
    </div>
  )
}
