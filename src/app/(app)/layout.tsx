import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNavigation from '@/components/layout/BottomNavigation'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  let profile = null;
  if (authData.user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', authData.user.id)
      .maybeSingle()
    
    profile = data || {
      username: null as string | null,
      avatar_url: null as string | null
    };

    if (!profile.username) {
      profile.username = authData.user.user_metadata?.username || authData.user.email?.split('@')[0]
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Header (hidden on md and up) */}
      <MobileHeader avatarUrl={profile?.avatar_url} username={profile?.username} />

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="md:ml-64 p-4 md:p-8 pb-28 md:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (hidden on md and up) */}
      <BottomNavigation />
    </div>
  )
}
