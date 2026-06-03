import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WorldClient from './WorldClient'

export default async function WorldPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch District Progress
  const { data: districts } = await supabase
    .from('district_progress')
    .select('*')
    .eq('user_id', user.id)

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      <header className="mb-6 lg:mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">My World</h1>
        <p className="text-gray-500">Inilah wujud visual dari produktivitasmu. Selesaikan Quests untuk membangun distrik yang lebih besar!</p>
      </header>

      <WorldClient districts={districts || []} />
    </div>
  )
}
