'use client'

import { useState } from 'react'
import EditProfileModal from './EditProfileModal'

interface ProfileHeaderProps {
  profile: any
  memberSince: string
}

export default function ProfileHeader({ profile, memberSince }: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl p-8 mb-8 border border-blue-100/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-8 right-8 z-20">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 text-sm font-semibold rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors border border-gray-100 shadow-sm"
          >
            <span>✎</span> Edit Profil
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
          <div 
            className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-gray-100 bg-cover bg-center"
            style={{ backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none' }}
          >
             {!profile?.avatar_url && <span className="text-5xl">👤</span>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{profile?.username || 'Fokus Master'}</h1>
            <p className="text-gray-600 mb-6 max-w-2xl leading-relaxed">
              {profile?.bio || '-'}
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-600 shadow-sm flex items-center gap-2 border border-gray-100">
                <span>📅</span> Bergabung sejak {memberSince}
              </div>
              <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-600 shadow-sm flex items-center gap-2 border border-gray-100">
                <span className="text-orange-500">🔥</span> {profile?.streak || 0} Hari Beruntun
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          currentUsername={profile?.username || ''} 
          currentAvatarUrl={profile?.avatar_url || null}
          currentBio={profile?.bio || ''}
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  )
}
