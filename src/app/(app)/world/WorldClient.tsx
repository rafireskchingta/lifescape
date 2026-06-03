'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DistrictProgress {
  id: string;
  user_id: string;
  district_name: string;
  district_xp: number;
}

interface WorldClientProps {
  districts: DistrictProgress[];
}

const DISTRICT_STAGES = [
  { level: 50, asset: 'university', name: 'Universitas', reqXp: 4900, nextLevel: null },
  { level: 30, asset: 'school', name: 'Sekolah', reqXp: 2900, nextLevel: 50 },
  { level: 15, asset: 'library', name: 'Perpustakaan', reqXp: 1400, nextLevel: 30 },
  { level: 5, asset: 'bookshelf', name: 'Rak Buku', reqXp: 400, nextLevel: 15 },
  { level: 1, asset: 'none', name: 'Kosong', reqXp: 0, nextLevel: 5 },
];

const HEALTH_STAGES = [
  { level: 50, asset: 'stadium', name: 'Stadion', reqXp: 4900, nextLevel: null },
  { level: 30, asset: 'sportscenter', name: 'Pusat Olahraga', reqXp: 2900, nextLevel: 50 },
  { level: 15, asset: 'gym', name: 'Pusat Kebugaran', reqXp: 1400, nextLevel: 30 },
  { level: 5, asset: 'joggingtrack', name: 'Jalur Lari', reqXp: 400, nextLevel: 15 },
  { level: 1, asset: 'none', name: 'Kosong', reqXp: 0, nextLevel: 5 },
];

const CAREER_STAGES = [
  { level: 50, asset: 'corporatetower', name: 'Menara Perusahaan', reqXp: 4900, nextLevel: null },
  { level: 30, asset: 'bussinesscenter', name: 'Pusat Bisnis', reqXp: 2900, nextLevel: 50 },
  { level: 15, asset: 'officebuilding', name: 'Gedung Kantor', reqXp: 1400, nextLevel: 30 },
  { level: 5, asset: 'smalloffice', name: 'Kantor Kecil', reqXp: 400, nextLevel: 15 },
  { level: 1, asset: 'none', name: 'Kosong', reqXp: 0, nextLevel: 5 },
];

const SOCIAL_STAGES = [
  { level: 50, asset: 'festivalarea', name: 'Area Festival', reqXp: 4900, nextLevel: null },
  { level: 30, asset: 'townsquare', name: 'Alun-alun', reqXp: 2900, nextLevel: 50 },
  { level: 15, asset: 'communitypark', name: 'Taman Komunitas', reqXp: 1400, nextLevel: 30 },
  { level: 5, asset: 'cafe', name: 'Kafe', reqXp: 400, nextLevel: 15 },
  { level: 1, asset: 'none', name: 'Kosong', reqXp: 0, nextLevel: 5 },
];

const STAGE_MAP: Record<string, typeof DISTRICT_STAGES> = {
  Knowledge: DISTRICT_STAGES,
  Health: HEALTH_STAGES,
  Career: CAREER_STAGES,
  Social: SOCIAL_STAGES,
};

const FOLDER_MAP: Record<string, string> = {
  Knowledge: 'knowledge',
  Health: 'health',
  Career: 'career',
  Social: 'social',
};

const DISTRICT_NAME_ID: Record<string, string> = {
  Knowledge: 'Pengetahuan',
  Health: 'Kesehatan',
  Career: 'Karier',
  Social: 'Sosial',
};

// Calculate Level based on new formula
function calculateLevel(xp: number) {
  if (xp < 0) return 1;
  return Math.floor(xp / 100) + 1;
}

export default function WorldClient({ districts }: WorldClientProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string, message: string }[]>([]);

  // Default array of 4 districts to ensure all show up even if 0 XP
  const fullDistricts = ['Knowledge', 'Health', 'Career', 'Social'].map(name => {
    const d = districts.find(d => d.district_name === name);
    return {
      name,
      xp: d?.district_xp || 0,
    };
  });

  const worldLevel = Math.floor(fullDistricts.reduce((sum, d) => sum + calculateLevel(d.xp), 0) / 4);
  const worldStage = worldLevel >= 51 ? 'Metropolis' : worldLevel >= 26 ? 'City' : worldLevel >= 11 ? 'Town' : 'Village';

  // Check for unlocks
  useEffect(() => {
    const newUnlocked: string[] = [];
    fullDistricts.forEach(d => {
      const level = calculateLevel(d.xp);
      const stages = STAGE_MAP[d.name];
      const currentStage = stages.find(s => level >= s.level)!;
      
      if (currentStage.asset !== 'none') {
        const unlockKey = `unlocked_${d.name}_${currentStage.level}`;
        if (!localStorage.getItem(unlockKey)) {
          localStorage.setItem(unlockKey, 'true');
          newUnlocked.push(`🎉 ${currentStage.name} Terbuka di Lahan ${DISTRICT_NAME_ID[d.name]}!`);
        }
      }
    });

    if (newUnlocked.length > 0) {
      const newToasts = newUnlocked.map(msg => ({ id: Math.random().toString(), message: msg }));
      setToasts(prev => [...prev, ...newToasts]);
      
      // Auto dismiss toasts
      setTimeout(() => {
        setToasts(prev => prev.filter(t => !newToasts.find(nt => nt.id === t.id)));
      }, 5000);
    }
  }, [districts]);

  const activeDistrictObj = fullDistricts.find(d => d.name === selectedDistrict);
  
  let dLevel = 1;
  let dStages = DISTRICT_STAGES;
  let currentStage = dStages[dStages.length - 1];
  let nextStage = null;
  let progress = 0;
  let reqXpNext = 0;

  if (activeDistrictObj) {
    dLevel = calculateLevel(activeDistrictObj.xp);
    dStages = STAGE_MAP[activeDistrictObj.name];
    currentStage = dStages.find(s => dLevel >= s.level)!;
    
    if (currentStage.nextLevel) {
      nextStage = dStages.find(s => s.level === currentStage.nextLevel)!;
      reqXpNext = nextStage.reqXp - activeDistrictObj.xp;
      
      const currentThreshold = (currentStage.level - 1) * 100;
      const nextThreshold = (nextStage.level - 1) * 100;
      progress = ((activeDistrictObj.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    } else {
      progress = 100;
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[80vh] relative">
      
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-white border border-green-200 shadow-lg rounded-xl px-4 py-3 text-sm font-bold text-green-800 animate-[bounceIn_0.5s_ease-out]">
            {toast.message}
          </div>
        ))}
      </div>

      {/* World Map Container */}
      <div className="flex-1 bg-[#87CEEB] rounded-3xl relative overflow-hidden shadow-inner min-h-[60vh] lg:min-h-0 border-4 border-white">
        
        {/* World Header Info */}
        <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Level Dunia: {worldLevel}</p>
          <h2 className="text-2xl font-black text-gray-900 leading-none">{worldStage === 'Village' ? 'Desa' : worldStage === 'Town' ? 'Kota Kecil' : worldStage === 'City' ? 'Kota' : 'Metropolis'}</h2>
        </div>

        {/* The Island Background */}
        <Image 
          src="/assets/world.jpg" 
          alt="LifeScape Island" 
          fill 
          className="object-cover object-center absolute inset-0 z-0"
          priority
        />
        
        {/* Clickable Island Area & Buildings */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
          <div className="relative w-full max-w-2xl aspect-square lg:aspect-[4/3] grid grid-cols-2 grid-rows-2 gap-4">
            
            {/* Top Left: Knowledge */}
            <div 
              onClick={() => setSelectedDistrict('Knowledge')}
              className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 rounded-3xl flex flex-col items-center justify-center p-4 ${selectedDistrict === 'Knowledge' ? 'ring-4 ring-white bg-white/20' : 'hover:bg-white/10'}`}
            >
              {(() => {
                const lvl = calculateLevel(fullDistricts[0].xp);
                const asset = STAGE_MAP['Knowledge'].find(s => lvl >= s.level)?.asset;
                if (asset !== 'none') {
                   return <Image src={`/assets/knowledge/${asset}.jpg`} alt="Bangunan Pengetahuan" width={160} height={160} className="object-contain drop-shadow-2xl rounded-2xl" />;
                }
                return <div className="text-white/50 font-bold text-sm bg-black/20 px-3 py-1 rounded-full">Lahan Pengetahuan</div>;
              })()}
            </div>

            {/* Top Right: Health */}
            <div 
              onClick={() => setSelectedDistrict('Health')}
              className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 rounded-3xl flex flex-col items-center justify-center p-4 ${selectedDistrict === 'Health' ? 'ring-4 ring-white bg-white/20' : 'hover:bg-white/10'}`}
            >
              {(() => {
                const lvl = calculateLevel(fullDistricts[1].xp);
                const asset = STAGE_MAP['Health'].find(s => lvl >= s.level)?.asset;
                if (asset !== 'none') {
                   return <Image src={`/assets/health/${asset}.jpg`} alt="Bangunan Kesehatan" width={160} height={160} className="object-contain drop-shadow-2xl rounded-2xl" />;
                }
                return <div className="text-white/50 font-bold text-sm bg-black/20 px-3 py-1 rounded-full">Lahan Kesehatan</div>;
              })()}
            </div>

            {/* Bottom Left: Career */}
            <div 
              onClick={() => setSelectedDistrict('Career')}
              className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 rounded-3xl flex flex-col items-center justify-center p-4 ${selectedDistrict === 'Career' ? 'ring-4 ring-white bg-white/20' : 'hover:bg-white/10'}`}
            >
              {(() => {
                const lvl = calculateLevel(fullDistricts[2].xp);
                const asset = STAGE_MAP['Career'].find(s => lvl >= s.level)?.asset;
                if (asset !== 'none') {
                   return <Image src={`/assets/career/${asset}.jpg`} alt="Bangunan Karier" width={160} height={160} className="object-contain drop-shadow-2xl rounded-2xl" />;
                }
                return <div className="text-white/50 font-bold text-sm bg-black/20 px-3 py-1 rounded-full">Lahan Karier</div>;
              })()}
            </div>

            {/* Bottom Right: Social */}
            <div 
              onClick={() => setSelectedDistrict('Social')}
              className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 rounded-3xl flex flex-col items-center justify-center p-4 ${selectedDistrict === 'Social' ? 'ring-4 ring-white bg-white/20' : 'hover:bg-white/10'}`}
            >
              {(() => {
                const lvl = calculateLevel(fullDistricts[3].xp);
                const asset = STAGE_MAP['Social'].find(s => lvl >= s.level)?.asset;
                if (asset !== 'none') {
                   return <Image src={`/assets/social/${asset}.jpg`} alt="Bangunan Sosial" width={160} height={160} className="object-contain drop-shadow-2xl rounded-2xl" />;
                }
                return <div className="text-white/50 font-bold text-sm bg-black/20 px-3 py-1 rounded-full">Lahan Sosial</div>;
              })()}
            </div>

          </div>
        </div>
      </div>

      {/* District Detail Panel (Desktop Sidebar / Mobile Bottom Sheet) */}
      <div className={`
        fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 transform 
        lg:relative lg:w-96 lg:rounded-3xl lg:shadow-xl lg:transform-none lg:flex lg:flex-col
        ${selectedDistrict ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        {/* Mobile drag handle indicator */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 lg:hidden"></div>

        <div className="p-6 lg:p-8 flex-1 overflow-y-auto">
          {selectedDistrict ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Lahan {DISTRICT_NAME_ID[selectedDistrict]}</h3>
                  <p className="text-sm font-bold text-green-600 mt-1">Level {dLevel}</p>
                </div>
                <button 
                  onClick={() => setSelectedDistrict(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 lg:hidden"
                >
                  ✕
                </button>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-500">Total XP</span>
                  <span className="text-gray-900">{activeDistrictObj!.xp.toLocaleString()} XP</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}></div>
                </div>
                {nextStage && (
                  <p className="text-xs text-gray-400 font-medium mt-2 text-right">
                    {reqXpNext.toLocaleString()} XP menuju {nextStage.name}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bangunan Saat Ini</p>
                  <div className="flex items-center gap-4">
                    {currentStage.asset !== 'none' ? (
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden shadow-sm">
                        <Image src={`/assets/${FOLDER_MAP[selectedDistrict]}/${currentStage.asset}.jpg`} alt={currentStage.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-xl shadow-sm">🌱</div>
                    )}
                    <h4 className="font-bold text-gray-900 text-lg">{currentStage.name}</h4>
                  </div>
                </div>

                {nextStage && (
                  <div className="bg-white rounded-2xl p-4 border border-dashed border-gray-200 opacity-60">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bangunan Selanjutnya (Lv.{nextStage.level})</p>
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 shadow-inner">
                         🔒
                       </div>
                       <h4 className="font-bold text-gray-600 text-lg">{nextStage.name}</h4>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10 lg:py-0">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">👆</div>
              <h3 className="text-xl font-bold text-gray-900">Pilih Lahan</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-[200px]">Ketuk area di map untuk melihat detail masing-masing lahan.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile bottom sheet */}
      {selectedDistrict && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSelectedDistrict(null)}
        />
      )}

      {/* Bounce keyframe for toast */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
