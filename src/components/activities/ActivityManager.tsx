'use client'

import { useState } from 'react'
import { addActivity, completeActivity, deleteActivity } from '@/app/actions/activity'

export default function ActivityManager({ initialActivities }: { initialActivities: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activities, setActivities] = useState(initialActivities)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleComplete = async (id: string, category: string, difficulty: string) => {
    // Optimistic update
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: true, completed_at: new Date().toISOString() } : a))
    try {
      await completeActivity(id, category, difficulty)
    } catch (e) {
      console.error(e)
      // Revert on failure
      setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: false, completed_at: null } : a))
    }
  }

  const handleDelete = async (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id))
    try {
      await deleteActivity(id)
    } catch (e) {
      console.error(e)
      window.location.reload()
    }
  }

  const filteredActivities = activities.filter(a => {
    if (filterCategory !== 'All' && a.category !== filterCategory) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  })

  const pendingQuests = filteredActivities.filter(a => !a.completed)
  const completedQuests = filteredActivities.filter(a => a.completed)

  const categories = ['Semua', 'Belajar', 'Olahraga', 'Kerja', 'Sosial', 'Personal']

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Study': return '📖';
      case 'Exercise': return '🏋️';
      case 'Work': return '💼';
      case 'Social': return '👥';
      default: return '📌';
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-gray-100 text-gray-600';
      case 'Medium': return 'bg-green-100 text-green-700';
      case 'Hard': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  return (
    <div>
      {/* Top Bar: Search & Filters */}
      <div className="hidden md:flex justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Log Misi Aktivitas</h1>
          <p className="text-gray-500">Kelola misi fokus harianmu.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          {showAddForm ? 'Tutup Form' : '+ Tambah Aktivitas'}
        </button>
      </div>

      <div className="bg-transparent md:bg-white md:p-4 rounded-2xl md:border md:border-gray-100 md:shadow-sm flex flex-col gap-4 mb-4 md:mb-8">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Cari aktivitas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm shadow-sm"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2 w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  filterCategory === cat 
                  ? 'bg-[#4CAF50] text-white border-transparent shadow-sm font-medium' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end text-sm text-[#0F766E] font-bold md:hidden">
          <span className="flex items-center gap-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filter Status
          </span>
        </div>
      </div>

      {/* Add Form (Collapsible) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Add New Quest</h2>
          <form 
            action={async (formData) => {
              setIsSubmitting(true)
              try {
                await addActivity(formData)
                window.location.reload()
              } catch(e) {
                console.error(e)
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" required type="text" className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="e.g. Advanced Calculus prep" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" required className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white">
                <option value="Study">Study</option>
                <option value="Exercise">Exercise</option>
                <option value="Work">Work</option>
                <option value="Social">Social</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select name="difficulty" required className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" disabled={isSubmitting} className="w-full bg-green-700 text-white p-3 rounded-xl font-bold hover:bg-green-800 disabled:bg-gray-400 transition-colors">
                {isSubmitting ? 'Adding...' : 'Add Quest'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {pendingQuests.map(activity => (
          <div key={activity.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative group transition-all">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0F766E] rounded-l-2xl"></div>
             <div className="p-5 flex-1 flex flex-col pl-6">
               <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-[#0F766E] bg-blue-50 px-2 py-0.5 rounded-md">{activity.category}</span>
                   <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                     <span>⏱</span> 
                     {activity.difficulty === 'Easy' ? '30m' : activity.difficulty === 'Medium' ? '45m' : '2h'}
                   </div>
                 </div>
                 <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                   {activity.difficulty === 'Hard' && '🔥 '}{activity.difficulty}
                 </span>
               </div>
               
               <h3 className="text-[19px] font-bold text-[#111827] mb-2 leading-tight">{activity.title}</h3>
               <p className="text-[15px] text-gray-600 line-clamp-3 mb-4 flex-1">
                 {activity.description || 'Selesaikan tugas ini untuk mendapatkan XP distrik.'}
               </p>
               
               <div className="flex items-center justify-between mt-auto">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                   Me
                 </div>
                 <button 
                   onClick={() => handleComplete(activity.id, activity.category, activity.difficulty)}
                   className="px-5 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                 >
                   <span>▶</span> Mulai
                 </button>
               </div>
             </div>
             
             {/* Delete Button (appears on hover) */}
             <button 
               onClick={() => handleDelete(activity.id)} 
               className="absolute top-4 right-4 w-6 h-6 bg-red-50 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
               title="Delete Quest"
             >
               ✕
             </button>
          </div>
        ))}
        
        {/* Completed Quests */}
        {completedQuests.map(activity => (
          <div key={activity.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4CAF50] rounded-l-2xl"></div>
             <div className="p-5 flex-1 flex flex-col pl-6">
               <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">{activity.category}</span>
                   <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                     <span>⏱</span> 
                     {activity.difficulty === 'Easy' ? '30m' : activity.difficulty === 'Medium' ? '45m' : '2h'}
                   </div>
                 </div>
                 <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600`}>
                   {activity.difficulty}
                 </span>
               </div>
               
               <h3 className="text-[19px] font-bold text-[#111827] mb-2 leading-tight">{activity.title}</h3>
               <p className="text-[15px] text-gray-600 line-clamp-3 mb-4 flex-1">
                 {activity.description || 'Tugas telah selesai.'}
               </p>
               
               <div className="flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-1.5 text-sm font-bold text-[#047857]">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   Selesai Hari Ini
                 </div>
                 <button className="text-sm font-bold text-[#0F766E]">
                   Detail
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>
      
      {filteredActivities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Misi Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm">Tambahkan aktivitas baru atau ubah filtermu.</p>
        </div>
      )}
    </div>
  )
}
