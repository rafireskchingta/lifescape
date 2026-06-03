'use client'

import { useState } from 'react'
import { addActivity } from '@/app/actions/activity'
import { useRouter } from 'next/navigation'

export default function AddActivityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  return (
    <form 
      action={async (formData) => {
        setIsSubmitting(true)
        try {
          await addActivity(formData)
          router.push('/activities')
        } catch(e) {
          console.error(e)
          setIsSubmitting(false)
        }
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
    >
      <div className="md:col-span-3">
        <label className="block text-sm font-bold text-gray-700 mb-2">Judul Misi</label>
        <input name="title" required type="text" className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 font-medium" placeholder="Contoh: Belajar Kalkulus Lanjutan" />
      </div>
      
      <div className="md:col-span-3">
        <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi (Opsional)</label>
        <textarea name="description" rows={3} className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900" placeholder="Tambahkan rincian lebih lanjut untuk misi ini..."></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
        <select name="category" required className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white text-gray-900 font-medium">
          <option value="Study">Belajar</option>
          <option value="Exercise">Olahraga</option>
          <option value="Work">Kerja</option>
          <option value="Social">Sosial</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Tingkat Kesulitan</label>
        <select name="difficulty" required className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white text-gray-900 font-medium">
          <option value="Easy">Mudah (30 menit)</option>
          <option value="Medium">Normal (45 menit)</option>
          <option value="Hard">Sulit (2+ jam)</option>
        </select>
      </div>

      <div className="flex items-end pt-4 md:pt-0">
        <button type="submit" disabled={isSubmitting} className="w-full bg-[#047857] text-white p-3.5 rounded-xl font-bold hover:bg-[#065f46] disabled:bg-gray-400 transition-colors shadow-lg shadow-green-700/20">
          {isSubmitting ? 'Menambahkan...' : 'Buat Misi'}
        </button>
      </div>
    </form>
  )
}
