import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import ActivityManager from '@/components/activities/ActivityManager'

export default async function ActivitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch activities
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <header className="hidden md:block mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold">Manajemen Aktivitas</h1>
          <p className="text-gray-500 mt-1">Lacak tugas harianmu untuk mendapatkan XP dan membangun LifeScape.</p>
        </header>

        <ActivityManager initialActivities={activities || []} />
      </div>
    </div>
  )
}
