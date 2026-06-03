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

  const categories = ['All', 'Study', 'Exercise', 'Work', 'Social', 'Personal']

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Activities Quest Log</h1>
          <p className="text-gray-500">Manage your daily focus missions.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          {showAddForm ? 'Close Form' : '+ Add Activity'}
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search quests..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingQuests.map(activity => (
          <div key={activity.id} className="bg-white rounded-2xl border-2 border-transparent hover:border-green-100 shadow-sm overflow-hidden flex flex-col relative group transition-all">
             <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-2xl"></div>
             <div className="p-6 flex-1 flex flex-col">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                     {getCategoryIcon(activity.category)}
                   </div>
                   <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{activity.category}</span>
                 </div>
                 <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                   {activity.difficulty === 'Medium' ? 'Normal' : activity.difficulty}
                 </span>
               </div>
               
               <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
               <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                 {activity.description || 'Complete this task to earn district XP.'}
               </p>
               
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                   <span>⏱</span> 
                   {activity.difficulty === 'Easy' ? '30 mins' : activity.difficulty === 'Medium' ? '45 mins' : '120 mins'}
                 </div>
                 <button 
                   onClick={() => handleComplete(activity.id, activity.category, activity.difficulty)}
                   className="px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1"
                 >
                   <span>▶</span> Start
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
          <div key={activity.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative opacity-60">
             <div className="p-6 flex-1 flex flex-col grayscale">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                     {getCategoryIcon(activity.category)}
                   </div>
                   <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{activity.category}</span>
                 </div>
                 <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                   {activity.difficulty === 'Medium' ? 'Normal' : activity.difficulty}
                 </span>
               </div>
               
               <h3 className="text-xl font-bold text-gray-400 mb-2 line-through">{activity.title}</h3>
               <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                 {activity.description || 'Task completed.'}
               </p>
               
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                   <span>✓</span> Done
                 </div>
                 <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md flex items-center gap-1">
                   <span>✓</span> Completed
                 </div>
               </div>
             </div>
          </div>
        ))}
      </div>
      
      {filteredActivities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Quests Found</h3>
          <p className="text-gray-500 text-sm">Add a new activity or change your filters.</p>
        </div>
      )}
    </div>
  )
}
