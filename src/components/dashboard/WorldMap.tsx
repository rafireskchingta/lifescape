import DistrictCard from './DistrictCard'

interface WorldMapProps {
  districts: any[];
}

export default function WorldMap({ districts }: WorldMapProps) {
  // Sort or ensure consistent order: Knowledge, Health, Career, Social
  const order = ['Knowledge', 'Health', 'Career', 'Social'];
  const sortedDistricts = [...districts].sort((a, b) => order.indexOf(a.district_name) - order.indexOf(b.district_name));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sortedDistricts.map(district => (
        <DistrictCard 
          key={district.id}
          name={district.district_name}
          level={district.district_level}
          xp={district.district_xp}
        />
      ))}
    </div>
  )
}
