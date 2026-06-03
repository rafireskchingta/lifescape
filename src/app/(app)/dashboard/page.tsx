import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { calculateLevel, getXpForLevel } from '@/lib/levelSystem'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

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
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Selamat datang kembali, {profile?.username || 'User'}</h1>
            <p className="text-gray-500">Your journey continues today. Let's make it count.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">🔔</button>
            <div 
              className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden bg-cover bg-center shadow-sm"
              style={{ backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none' }}
            >
               {!profile?.avatar_url && profile?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Top Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl shadow-inner">
              🏅
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Rank</p>
              <h2 className="text-3xl font-black text-green-700">Lvl {currentLevel}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Experience</p>
             <div className="flex items-baseline gap-2 mb-3">
               <h2 className="text-3xl font-black text-gray-900">{(profile?.xp || 0).toLocaleString()}</h2>
               <span className="text-sm font-bold text-gray-400">XP</span>
             </div>
             <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
               <div className="bg-[#0F766E] h-full rounded-full transition-all duration-1000" style={{ width: `${userProgress}%` }}></div>
             </div>
             <p className="text-xs text-gray-500 text-right font-medium">{(nextLevelXp - (profile?.xp || 0)).toLocaleString()} XP to next level</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Daily Streak</p>
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="text-3xl font-black text-gray-900">{profile?.streak || 0}</h2>
                <span className="text-sm font-bold text-gray-400">Days</span>
              </div>
              <p className="text-xs font-bold text-green-600">Keep it up!</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-3xl">
              🔥
            </div>
          </div>
        </div>

        {/* District Summary */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">District Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {districts?.map((d) => {
               const dLevel = calculateLevel(d.district_xp);
               const dNextXp = getXpForLevel(dLevel + 1);
               const dCurrXp = getXpForLevel(dLevel);
               const dProgress = Math.min(100, Math.max(0, (d.district_xp - dCurrXp) / (dNextXp - dCurrXp) * 100));
               
               const icons: Record<string, string> = { Knowledge: '📖', Health: '❤️', Career: '💼', Social: '👥' };
               const colors: Record<string, string> = { Knowledge: 'bg-blue-600', Health: 'bg-red-600', Career: 'bg-green-600', Social: 'bg-yellow-500' };
               const textColors: Record<string, string> = { Knowledge: 'text-blue-600', Health: 'text-red-600', Career: 'text-green-600', Social: 'text-yellow-600' };

               return (
                 <div key={d.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                   <div className="flex justify-between items-start">
                     <div className={`w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-lg ${textColors[d.district_name]}`}>
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
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link href="/activities" className="text-sm font-bold text-green-600 hover:text-green-700">View All</Link>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {recentActivities && recentActivities.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-lg">
                          ✓
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 mb-0.5">Completed "{activity.title}"</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.completed_at || activity.created_at).toLocaleDateString()} • {activity.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        +XP
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Belum ada aktivitas yang diselesaikan. <Link href="/activities" className="text-green-600 font-bold hover:underline">Selesaikan sekarang!</Link>
                </div>
              )}
            </div>
          </div>

          {/* Daily Target */}
          <div>
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
                 {dailyCompletedCount >= dailyTarget 
                   ? "Luar biasa! Target harianmu sudah tercapai." 
                   : `Kamu hampir sampai! Selesaikan ${dailyTarget - (dailyCompletedCount || 0)} tugas lagi untuk mencapai target.`}
               </p>
               
               <Link href="/activities" className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-colors">
                 View Remaining Tasks
               </Link>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
