import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { calculateLevel, getXpForLevel } from '@/lib/levelSystem'

export default async function StatisticsPage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    redirect('/login')
  }

  // Fetch Profile & District
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single()
  const { data: districts } = await supabase.from('district_progress').select('*').eq('user_id', authData.user.id)
  const { data: userBadges } = await supabase.from('user_badges').select(`unlocked_at, badges(id, name, icon)`).eq('user_id', authData.user.id).limit(4)

  // Fetch all completed activities from the last 21 days for the heatmap
  const twentyOneDaysAgo = new Date();
  twentyOneDaysAgo.setDate(twentyOneDaysAgo.getDate() - 21);
  twentyOneDaysAgo.setHours(0,0,0,0);

  const { data: recentActivities } = await supabase
    .from('activities')
    .select('completed_at')
    .eq('user_id', authData.user.id)
    .eq('completed', true)
    .gte('completed_at', twentyOneDaysAgo.toISOString())

  // Process Heatmap Data (Array of 21 days)
  const heatmapData = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i)); // From 20 days ago to today
    d.setHours(0,0,0,0);
    const dateStr = d.toISOString().split('T')[0];
    
    // Count activities on this day
    const count = recentActivities?.filter(a => {
      if(!a.completed_at) return false;
      return a.completed_at.startsWith(dateStr);
    }).length || 0;

    return { date: dateStr, count };
  });

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Your Progress</h1>
            <p className="text-gray-500 text-lg">Tracking your cozy productivity journey.</p>
          </div>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* XP Line Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">XP Earned</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Daily</button>
                <button className="px-3 py-1 bg-white text-gray-500 hover:bg-gray-50 text-xs font-bold rounded-md transition-colors">Weekly</button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative flex items-end min-h-[200px]">
               {/* Simple SVG Chart Representation */}
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0 90 Q 20 80 40 40 T 80 20 T 100 10" fill="none" stroke="#047857" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 0 100 L 0 90 Q 20 80 40 40 T 80 20 T 100 10 L 100 100 Z" fill="url(#gradient)" opacity="0.2" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#047857" stopOpacity="1" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                    </linearGradient>
                  </defs>
               </svg>
               <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs font-semibold text-gray-400 mt-4 border-t border-gray-100 pt-2">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span className="text-green-700">Fri</span><span>Sat</span><span>Sun</span>
               </div>
               <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] font-semibold text-gray-400 pb-8 pr-2">
                 <span>1000</span><span>500</span><span>0</span>
               </div>
            </div>
          </div>

          {/* Current Streak Heatmap */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-orange-500">🔥</span> Current Streak
            </h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-green-700">{profile?.streak || 0}</span>
              <span className="text-gray-500 font-medium">Days</span>
            </div>

            <div className="grid grid-cols-7 gap-2 mt-auto mb-2">
              {heatmapData.map((d, i) => {
                 let bg = "bg-gray-100"; // 0
                 if(d.count === 1) bg = "bg-green-300";
                 if(d.count === 2) bg = "bg-green-400";
                 if(d.count >= 3) bg = "bg-green-600";
                 const isToday = i === 20;

                 return (
                   <div 
                     key={i} 
                     className={`aspect-square rounded-[4px] ${bg} ${isToday ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
                     title={`${d.count} tasks on ${d.date}`}
                   ></div>
                 )
              })}
            </div>
            <p className="text-center text-xs text-gray-400 font-semibold mt-2">Last 21 Days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* District Development */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">District Development</h2>
            <div className="space-y-6">
              {districts?.map((d) => {
                 const dLevel = calculateLevel(d.district_xp);
                 const dNextXp = getXpForLevel(dLevel + 1);
                 const dCurrXp = getXpForLevel(dLevel);
                 const dProgress = Math.min(100, Math.max(0, (d.district_xp - dCurrXp) / (dNextXp - dCurrXp) * 100));
                 
                 const icons: Record<string, string> = { Knowledge: '📚', Health: '🧘', Career: '💼', Social: '👥' };
                 const names: Record<string, string> = { Knowledge: 'Scholar\'s Library', Health: 'Mindful Meadow', Career: 'Vitality Peaks', Social: 'Town Square' };
                 const colors: Record<string, string> = { Knowledge: 'bg-blue-800', Health: 'bg-teal-700', Career: 'bg-green-700', Social: 'bg-amber-600' };
                 const textColors: Record<string, string> = { Knowledge: 'text-blue-800', Health: 'text-teal-700', Career: 'text-green-700', Social: 'text-amber-600' };

                 return (
                   <div key={d.id}>
                     <div className="flex justify-between items-center mb-2">
                       <div className={`flex items-center gap-2 text-sm font-bold ${textColors[d.district_name]}`}>
                         <span>{icons[d.district_name]}</span> {names[d.district_name] || d.district_name}
                       </div>
                       <span className={`text-sm font-bold ${textColors[d.district_name]}`}>Level {dLevel}</span>
                     </div>
                     <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                       <div className={`h-full ${colors[d.district_name]} rounded-full`} style={{ width: `${dProgress}%` }}></div>
                     </div>
                   </div>
                 )
              })}
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Badges</h2>
              <Link href="/badges" className="text-sm font-bold text-green-600 hover:text-green-700">View All</Link>
            </div>
            
            <div className="grid grid-cols-4 gap-4 h-full pb-8">
               {userBadges && userBadges.length > 0 ? (
                  userBadges.map((ub, idx) => {
                    const badge = ub.badges as any;
                    const bgColors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-300', 'bg-purple-200'];
                    const textColors = ['text-yellow-800', 'text-blue-800', 'text-green-900', 'text-purple-800'];
                    
                    return (
                      <div key={idx} className={`${bgColors[idx % 4]} rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm`}>
                        <div className="text-3xl bg-white/50 w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                          {badge?.icon || '🏅'}
                        </div>
                        <h4 className={`font-bold text-xs leading-tight ${textColors[idx % 4]}`}>{badge?.name || 'Badge'}</h4>
                      </div>
                    )
                  })
               ) : (
                  <div className="col-span-4 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-3xl mb-2">🏅</span>
                    <span className="text-sm">No badges yet</span>
                  </div>
               )}
               
               {/* Padding with locked badges */}
               {Array.from({ length: Math.max(0, 4 - (userBadges?.length || 0)) }).map((_, idx) => (
                 <div key={`locked-${idx}`} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl text-gray-300">🔒</div>
                    <h4 className="font-bold text-xs text-gray-400">Mystery Goal</h4>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
