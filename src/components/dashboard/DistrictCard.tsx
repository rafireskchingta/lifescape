import { getVisualStage, getXpForLevel } from '@/lib/levelSystem'

interface DistrictCardProps {
  name: string;
  level: number;
  xp: number;
}

export default function DistrictCard({ name, level, xp }: DistrictCardProps) {
  const stage = getVisualStage(level);
  
  // XP calculations for progress bar
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const xpIntoLevel = Math.max(0, xp - currentLevelXp);
  const xpRequired = nextLevelXp - currentLevelXp;
  const progressPercent = Math.min(100, Math.max(0, (xpIntoLevel / xpRequired) * 100));

  // Determine stage label based on district
  const getStageLabel = () => {
    switch(name) {
      case 'Knowledge':
        return ['Empty Land', 'Bookshelf', 'Library', 'School', 'University'][stage - 1]
      case 'Health':
        return ['Empty Land', 'Jogging Track', 'Gym', 'Sports Center', 'Stadium'][stage - 1]
      case 'Career':
        return ['Empty Land', 'Small Office', 'Office Building', 'Business Center', 'Corporate Tower'][stage - 1]
      case 'Social':
        return ['Empty Land', 'Cafe', 'Community Park', 'Town Square', 'Festival Area'][stage - 1]
      default:
        return `Stage ${stage}`
    }
  }

  // Define colors based on District
  const getThemeColor = () => {
    switch(name) {
      case 'Knowledge': return 'bg-blue-500';
      case 'Health': return 'bg-red-500';
      case 'Career': return 'bg-yellow-500';
      case 'Social': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-between transition-transform hover:-translate-y-1">
      <div className="w-full flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500 font-medium">Level {level}</p>
        </div>
        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
          Stage {stage}
        </div>
      </div>

      {/* Visual Representation (Placeholder for 3D/SVG) */}
      <div className="w-32 h-32 my-6 flex items-center justify-center rounded-full bg-gray-50 border-4 border-gray-100 relative">
        <div className="text-5xl drop-shadow-sm">
          {name === 'Knowledge' && ['🌱', '📚', '🏛️', '🏫', '🎓'][stage - 1]}
          {name === 'Health' && ['🌱', '🏃', '🏋️', '🏟️', '🏆'][stage - 1]}
          {name === 'Career' && ['🌱', '💻', '🏢', '💼', '🏙️'][stage - 1]}
          {name === 'Social' && ['🌱', '☕', '🌳', '🎪', '🎆'][stage - 1]}
        </div>
      </div>

      <div className="w-full text-center mb-3">
        <p className="font-semibold text-gray-800">{getStageLabel()}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
          <span>{xpIntoLevel} XP</span>
          <span>{xpRequired} XP to Lv.{level + 1}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getThemeColor()}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
