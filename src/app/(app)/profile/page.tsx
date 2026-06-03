import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { calculateLevel, getXpForLevel } from '@/lib/levelSystem'
import ProfileHeader from '@/components/profile/ProfileHeader'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  // Fetch Badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      unlocked_at,
      badges (
        id, name, description, icon
      )
    `)
    .eq('user_id', authData.user.id)
    .order('unlocked_at', { ascending: false })
    .limit(4)

  const currentLevel = calculateLevel(profile?.xp || 0);
  const currentLevelXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  const userProgress = Math.min(100, Math.max(0, ((profile?.xp || 0) - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100));

  const memberSince = new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 hidden">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        </header>

        {/* Identity Card Client Component */}
        <ProfileHeader profile={profile} memberSince={memberSince} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Focus Level Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Focus Level</h2>
                <p className="text-gray-500 text-sm">Keep completing tasks to reach the next milestone.</p>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="w-5 h-5 bg-green-700 rounded-full flex items-center justify-center text-white text-[10px]">★</span>
                <span className="text-sm font-bold text-green-800">Rank: Artisan</span>
              </div>
            </div>
            
            <div className="mt-auto flex items-end gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-green-700 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-black text-green-700">{currentLevel}</span>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-700">{(profile?.xp || 0).toLocaleString()} XP</span>
                  <span className="text-gray-400">{nextLevelXp.toLocaleString()} XP to Lvl {currentLevel + 1}</span>
                </div>
                <div className="w-full bg-blue-100 h-3 rounded-full overflow-hidden mb-2">
                  <div className="bg-green-700 h-full rounded-full transition-all duration-1000" style={{ width: `${userProgress}%` }}></div>
                </div>
                <p className="text-right text-xs font-bold text-blue-600">Just {(nextLevelXp - (profile?.xp || 0)).toLocaleString()} XP to go!</p>
              </div>
            </div>
          </div>

          {/* Top Badges Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-bold text-gray-900">Top Badges</h2>
               <Link href="/badges" className="text-sm font-bold text-green-600 hover:text-green-700">View All</Link>
             </div>
             
             <div className="flex-1 grid grid-cols-2 gap-4">
                {userBadges && userBadges.length > 0 ? (
                  userBadges.map((ub, idx) => {
                    const badge = ub.badges as any; // Cast array/obj correctly based on relation
                    const isFirst = idx === 0;
                    return (
                      <div key={idx} className={`${isFirst ? 'col-span-2 bg-blue-50' : 'bg-gray-50'} rounded-2xl p-4 flex items-center gap-4`}>
                        <div className={`w-12 h-12 rounded-full ${isFirst ? 'bg-blue-700' : 'bg-white'} flex items-center justify-center text-2xl shadow-sm`}>
                          {badge?.icon || '🏅'}
                        </div>
                        <div>
                          <h4 className={`font-bold ${isFirst ? 'text-gray-900' : 'text-gray-700'}`}>{badge?.name || 'Badge'}</h4>
                          {isFirst && <p className="text-xs text-gray-600 mt-1">{badge?.description}</p>}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
                    No badges unlocked yet. Keep completing quests!
                  </div>
                )}
                
                {/* Pad with locked badges if less than 3 */}
                {(!userBadges || userBadges.length < 3) && (
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">🔒</div>
                    <span className="font-bold text-sm text-gray-500">Locked</span>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Settings Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-200 hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">⚙️</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">Account Settings</h4>
              <p className="text-xs text-gray-500">Email, password, security</p>
            </div>
            <span className="text-gray-300">❯</span>
          </button>
          
          <button className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-200 hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">🔔</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">Notifications</h4>
              <p className="text-xs text-gray-500">Reminders and digests</p>
            </div>
            <span className="text-gray-300">❯</span>
          </button>

          <button className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-200 hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">🎨</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">Appearance</h4>
              <p className="text-xs text-gray-500">Theme and layout preferences</p>
            </div>
            <span className="text-gray-300">❯</span>
          </button>
        </div>
      </div>
    </div>
  )
}
