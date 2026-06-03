'use client'

import { useState, useRef } from 'react'
import { updateProfile } from '@/app/actions/profile'

interface EditProfileModalProps {
  currentUsername: string
  currentAvatarUrl: string | null
  currentBio: string
  onClose: () => void
}

export default function EditProfileModal({ currentUsername, currentAvatarUrl, currentBio, onClose }: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [username, setUsername] = useState(currentUsername)
  const [bio, setBio] = useState(currentBio)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)
  const [file, setFile] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      // Create a local preview URL
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setToastMessage(null)
    
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('bio', bio)
      if (file) {
        formData.append('avatar', file)
      }
      
      await updateProfile(formData)
      onClose()
    } catch (error: any) {
      console.error(error)
      setToastMessage(`Waduh, gagal nyimpen nih! Error: ${error.message || 'Sistem ngambek'}. Coba lagi ya! 😅`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Edit Profil</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          {toastMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="text-xl leading-none">⚠️</span>
              <p>{toastMessage}</p>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer mb-3" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center bg-cover bg-center"
                   style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : 'none' }}>
                {!previewUrl && <span className="text-4xl text-gray-300">👤</span>}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold flex flex-col items-center gap-1">
                  <span>📷</span> Unggah
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Klik untuk mengubah foto profil</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
              placeholder="Masukkan username Anda"
            />
          </div>

          {/* Bio Input */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Biodata Singkat</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900 resize-none"
              placeholder="Ceritakan sedikit tentang Anda..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors disabled:bg-green-700/70 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}
