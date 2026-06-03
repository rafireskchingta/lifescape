import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { calculateLevel, getXpForLevel } from '@/lib/levelSystem'
import FloatingActionButton from '@/components/ui/FloatingActionButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  // 1. Fetch Profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle()

  const profile = profileData || {
    username: null as string | null,
    xp: 0,
    streak: 0,
    avatar_url: null as string | null
  }

  if (!profile.username) {
    profile.username = authData.user.user_metadata?.username || authData.user.email?.split('@')[0]
  }

  // 2. Fetch District Progress
  const { data: districts } = await supabase
    .from('district_progress')
    .select('*')
    .eq('user_id', authData.user.id)

  // 3. Fetch Recent Activities (Last 5 completed)
  const { data: recentActivities } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', authData.user.id)
    .eq('completed', true)
    .order('completed_at', { ascending: false, nullsFirst: false })
    .limit(5)

  // 4. Calculate Daily Target Progress (Activities completed today)
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  const { count: dailyCompletedCount } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authData.user.id)
    .eq('completed', true)
    .gte('completed_at', startOfDay.toISOString())

  const currentLevel = calculateLevel(profile?.xp || 0);
  const currentLevelXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  const userProgress = Math.min(100, Math.max(0, ((profile?.xp || 0) - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100));

  const dailyTarget = 3; // Static target for now
  const dailyProgress = Math.min(100, ((dailyCompletedCount || 0) / dailyTarget) * 100);

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex justify-between items-start md:items-center w-full">
            <div>
              <p className="text-gray-500 font-medium md:hidden">Selamat datang kembali,</p>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 md:hidden">{profile?.username || 'User'}</h1>
              
              <h1 className="hidden md:block text-3xl font-bold text-gray-900 tracking-tight mb-1">Selamat datang kembali, {profile?.username || 'User'}</h1>
              <p className="hidden md:block text-gray-500">Perjalananmu berlanjut hari ini. Mari kita ukir progres nyata.</p>
            </div>
            
            {/* Mobile Level Badge */}
            <div className="md:hidden flex flex-col items-end">
              <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 mb-1">
                <span>⭐</span> Lvl {currentLevel}
              </div>
              <span className="text-xs font-bold text-gray-900">{(profile?.xp || 0).toLocaleString()} XP</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">🔔</button>
            <div 
              className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden bg-cover bg-center shadow-sm"
              style={{ backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none' }}
            >
               {!profile?.avatar_url && profile?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile Streak Card */}
        <div className="md:hidden bg-[#F8FAFF] p-4 rounded-2xl border border-blue-50 shadow-sm flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#F3E8DC] flex items-center justify-center text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.streak || 0}-Day Streak</h2>
            <p className="text-xs text-gray-500 font-medium">Pertahankan! Selesaikan Quest hari ini.</p>
          </div>
        </div>

        {/* Desktop Profile Stats */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.01.272l1.242 5.347c.125.541-.456.963-.92.684l-4.717-2.836a.563.563 0 00-.583 0l-4.717 2.836c-.464.279-1.045-.143-.92-.684l1.242-5.347a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rank Saat Ini</p>
              <h2 className="text-3xl font-black text-green-700">Lvl {currentLevel}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total XP</p>
             <div className="flex items-baseline gap-2 mb-3">
               <h2 className="text-3xl font-black text-gray-900">{(profile?.xp || 0).toLocaleString()}</h2>
               <span className="text-sm font-bold text-gray-400">XP</span>
             </div>
             <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
               <div className="bg-[#0F766E] h-full rounded-full transition-all duration-1000" style={{ width: `${userProgress}%` }}></div>
             </div>
             <p className="text-xs font-gray-500 text-right font-medium">{(nextLevelXp - (profile?.xp || 0)).toLocaleString()} XP menuju level berikutnya</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Daily Streak</p>
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="text-3xl font-black text-gray-900">{profile?.streak || 0}</h2>
                <span className="text-sm font-bold text-gray-400">Hari</span>
              </div>
              <p className="text-xs font-bold text-green-600">Pertahankan!</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
          </div>
        </div>

        {/* District Summary */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">District Kamu</h2>
              <p className="text-sm text-gray-500">Kumpulkan resource untuk membangun District-mu</p>
            </div>
            <Link href="/world" className="text-sm font-bold text-green-600 hover:text-green-700">Lihat Semua →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {districts?.map((d) => {
               const dLevel = calculateLevel(d.district_xp);
               const dNextXp = getXpForLevel(dLevel + 1);
               const dCurrXp = getXpForLevel(dLevel);
               const dProgress = Math.min(100, Math.max(0, (d.district_xp - dCurrXp) / (dNextXp - dCurrXp) * 100));
               
               const icons: Record<string, React.ReactNode> = { 
                 Knowledge: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
                 Health: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
                 Career: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>,
                 Social: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.103a6.375 6.375 0 0112.75 0zM7.5 13.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" /></svg>
               };
               const colors: Record<string, string> = { Knowledge: 'bg-blue-600', Health: 'bg-red-600', Career: 'bg-green-600', Social: 'bg-yellow-500' };
               const textColors: Record<string, string> = { Knowledge: 'text-blue-600', Health: 'text-red-600', Career: 'text-green-600', Social: 'text-yellow-600' };

               return (
                 <div key={d.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                   <div className="flex justify-between items-start">
                     <div className={`w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center ${textColors[d.district_name]}`}>
                       {icons[d.district_name]}
                     </div>
                     <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">Lvl {dLevel}</span>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-800 mb-2">{d.district_name}</p>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                       <div className={`${colors[d.district_name]} h-full rounded-full`} style={{ width: `${dProgress}%` }}></div>
                     </div>
                   </div>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Quests</h2>
                <p className="text-sm text-gray-500">Quest terakhir yang kamu selesaikan</p>
              </div>
              <Link href="/activities" className="text-sm font-bold text-green-600 hover:text-green-700">Lihat Log →</Link>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
              {recentActivities && recentActivities.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.category === 'Study' ? 'bg-blue-50 text-blue-500' :
                          activity.category === 'Exercise' ? 'bg-orange-50 text-orange-500' :
                          activity.category === 'Work' ? 'bg-purple-50 text-purple-500' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {activity.category === 'Study' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                          ) : activity.category === 'Exercise' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                          ) : activity.category === 'Work' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{activity.title}</h4>
                          <p className="text-xs font-medium text-gray-500">{new Date(activity.completed_at || activity.created_at).toLocaleDateString()} • +{activity.difficulty === 'Hard' ? '50' : activity.difficulty === 'Medium' ? '30' : '15'} XP</p>
                        </div>
                      </div>
                      <span className="text-green-500 font-bold text-sm bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                        <span>✓</span> Selesai
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Belum ada aktivitas. Yuk selesaikan Quest pertamamu!
                </div>
              )}
            </div>
          </div>

          {/* Daily Target */}
          <div className="hidden lg:block">
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center h-full">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Daily Target</p>
               
               <div className="relative w-40 h-40 mb-8">
                 {/* SVG Circular Progress */}
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                   {/* Background Circle */}
                   <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                   {/* Progress Circle */}
                   <circle 
                     cx="50" 
                     cy="50" 
                     r="40" 
                     stroke="#047857" 
                     strokeWidth="8" 
                     fill="none" 
                     strokeDasharray="251.2" 
                     strokeDashoffset={251.2 - (251.2 * dailyProgress) / 100}
                     strokeLinecap="round" 
                     className="transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-4xl font-black text-gray-900">{Math.round(dailyProgress)}%</span>
                 </div>
               </div>

               <p className="text-sm text-gray-600 mb-6">
                 {(dailyCompletedCount || 0) >= dailyTarget 
                   ? "Luar biasa! Target harianmu sudah tercapai." 
                   : `Kamu hampir sampai! Selesaikan ${dailyTarget - (dailyCompletedCount || 0)} Quest lagi untuk mencapai target.`}
               </p>
               
               <Link href="/activities" className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-colors">
                 Lihat Quest Tersisa
               </Link>
             </div>
          </div>

        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton href="/activities/new" />
    </div>
  )
}
