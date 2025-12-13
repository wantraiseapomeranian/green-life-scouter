import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as Icons from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { greenLocations, defaultCenter, markerTypes, residentialZones } from '../../data/mockClimateData';
import LocationModal from './LocationModal';
import ResidentialZone from './ResidentialZone';
import ZoneDetailModal from './ZoneDetailModal';
import { getSpecialLocationInfo, getCurrentTier, STREAK_TIERS } from '../../utils/specialLocations';

// Custom marker icon creator
function createCustomIcon(type, isRecommended = false, specialInfo = null) {
  const typeInfo = markerTypes[type];
  const IconComponent = Icons[typeInfo.icon];

  // 스트릭 특별 장소인 경우 특별 스타일 적용
  const isSpecial = specialInfo !== null;
  const tierColor = specialInfo?.tierInfo?.color || typeInfo.color;

  // 아이콘 스타일 결정
  let bgColor = typeInfo.color;
  let borderColor = 'white';
  let borderWidth = '3px';
  let size = '40px';
  let iconSize = [40, 40];
  let iconAnchor = [20, 20];
  let boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  let animation = 'none';

  if (isRecommended) {
    bgColor = '#f59e0b';
    borderColor = '#fbbf24';
    borderWidth = '4px';
    size = '50px';
    iconSize = [50, 50];
    iconAnchor = [25, 25];
    boxShadow = '0 4px 12px rgba(245, 158, 11, 0.5)';
    animation = 'pulse 2s infinite';
  } else if (isSpecial) {
    bgColor = tierColor;
    borderColor = tierColor;
    borderWidth = '4px';
    size = '48px';
    iconSize = [48, 48];
    iconAnchor = [24, 24];
    boxShadow = `0 4px 12px ${tierColor}80`;
    animation = 'pulse 3s infinite';
  }

  // 티어별 아이콘
  const TierBadgeIcon = isSpecial
    ? (specialInfo.tierInfo.tier === 'GOLD' ? Icons.Trophy
      : specialInfo.tierInfo.tier === 'SILVER' ? Icons.Crown
      : Icons.Star)
    : null;

  const iconHtml = renderToStaticMarkup(
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: '50%',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow: boxShadow,
        animation: animation,
        position: 'relative',
      }}
    >
      <IconComponent style={{ color: 'white', width: '24px', height: '24px' }} />
      {isRecommended && (
        <Icons.Sparkles
          style={{
            color: '#fbbf24',
            width: '16px',
            height: '16px',
            position: 'absolute',
            top: '-4px',
            right: '-4px'
          }}
        />
      )}
      {isSpecial && !isRecommended && TierBadgeIcon && (
        <TierBadgeIcon
          style={{
            color: tierColor,
            width: '14px',
            height: '14px',
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '2px',
          }}
        />
      )}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: iconSize,
    iconAnchor: iconAnchor,
  });
}

function MapController() {
  // useMap hook for future map control functionality
  useMap();
  return null;
}

export default function GreenMap({ recommendedLocations = [], showZones = true, habitCompletion = {}, streak = 0 }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'parks', 'zones'
  const recommendedIds = recommendedLocations.map(loc => loc.id);

  // 현재 스트릭 티어
  const currentTier = getCurrentTier(streak);
  
  // Popup 인스턴스를 저장하기 위한 ref
  const popupRefs = useRef(new Map());

  // 모달이 닫힐 때 Popup도 닫기
  useEffect(() => {
    if (!selectedLocation) {
      // 모든 location popup 닫기
      popupRefs.current.forEach((popup) => {
        if (popup && popup.isOpen()) {
          popup.close();
        }
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedZone) {
      // 모든 zone popup 닫기
      popupRefs.current.forEach((popup) => {
        if (popup && popup.isOpen()) {
          popup.close();
        }
      });
    }
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full min-h-[500px]" style={{ zIndex: 1 }}>
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <button
          onClick={() => setViewMode('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-lg transition-all ${
            viewMode === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setViewMode('parks')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-lg transition-all ${
            viewMode === 'parks'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          녹지시설
        </button>
        <button
          onClick={() => setViewMode('zones')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-lg transition-all ${
            viewMode === 'zones'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          주거구역
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg text-xs">
        <p className="font-bold text-gray-700 mb-2">환경 점수</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
            <span>85+ 최우수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }} />
            <span>70-84 우수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
            <span>55-69 보통</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }} />
            <span>40-54 주의</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span>40 미만 위험</span>
          </div>
        </div>

        {/* 스트릭 티어 레전드 */}
        {currentTier && (
          <>
            <div className="border-t border-gray-200 my-2" />
            <p className="font-bold text-gray-700 mb-2">스트릭 해금</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Icons.Star className="w-4 h-4" style={{ color: STREAK_TIERS.BRONZE.color }} />
                <span className={streak >= 3 ? 'text-gray-700' : 'text-gray-400'}>3일+ 브론즈</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Crown className="w-4 h-4" style={{ color: STREAK_TIERS.SILVER.color }} />
                <span className={streak >= 7 ? 'text-gray-700' : 'text-gray-400'}>7일+ 실버</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Trophy className="w-4 h-4" style={{ color: STREAK_TIERS.GOLD.color }} />
                <span className={streak >= 14 ? 'text-gray-700' : 'text-gray-400'}>14일+ 골드</span>
              </div>
            </div>
          </>
        )}
      </div>

      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        className="w-full h-full rounded-2xl overflow-hidden"
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController />

        {/* Residential Zones */}
        {(viewMode === 'all' || viewMode === 'zones') && showZones &&
          residentialZones.map((zone) => (
            <ResidentialZone
              key={zone.id}
              zone={zone}
              onClick={(zone) => {
                setSelectedZone(zone);
              }}
              onClose={() => {
                setSelectedZone(null);
              }}
              isSelected={selectedZone?.id === zone.id}
              popupRefs={popupRefs}
            />
          ))
        }

        {/* Green Locations (Parks, Shelters, Trails) */}
        {(viewMode === 'all' || viewMode === 'parks') &&
          greenLocations.map((location) => {
            const isRecommended = recommendedIds.includes(location.id);
            const specialInfo = getSpecialLocationInfo(location.id, streak);
            return (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createCustomIcon(location.type, isRecommended, specialInfo)}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent?.stopPropagation();
                    // 마커 클릭 시 바로 모달 열기 (Popup은 열지 않음)
                    setSelectedLocation(location);
                  },
                }}
              >
                <Popup
                  closeOnClick={false}
                  autoClose={false}
                  ref={(popup) => {
                    if (popup) {
                      popupRefs.current.set(`location-${location.id}`, popup);
                    } else {
                      popupRefs.current.delete(`location-${location.id}`);
                    }
                  }}
                  eventHandlers={{
                    add: () => {
                      // Popup이 열릴 때 즉시 모달도 함께 열리도록
                      setSelectedLocation(location);
                    },
                  }}
                >
                  <div className="text-center">
                    {isRecommended && (
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icons.Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600">추천</span>
                      </div>
                    )}
                    {specialInfo && !isRecommended && (
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icons.Star className="w-4 h-4" style={{ color: specialInfo.tierInfo.color }} />
                        <span className="text-xs font-medium" style={{ color: specialInfo.tierInfo.color }}>
                          {specialInfo.tierInfo.label}
                        </span>
                      </div>
                    )}
                    <p className="font-bold text-emerald-700">{location.name}</p>
                    <p className="text-sm text-gray-600">{markerTypes[location.type].label}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })
        }
      </MapContainer>

      {/* Location Modal (for parks/shelters/trails) */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          habitCompletion={habitCompletion}
          streak={streak}
        />
      )}

      {/* Zone Detail Modal (for residential zones) */}
      {selectedZone && (
        <ZoneDetailModal
          zone={selectedZone}
          onClose={() => {
            // 모달 닫기 - Popup은 useEffect에서 자동으로 닫힘
            setSelectedZone(null);
          }}
          onLocationClick={(location) => {
            // 녹지시설 클릭 시 해당 location의 상세정보 모달 열기
            setSelectedZone(null); // ZoneDetailModal 닫기
            setTimeout(() => {
              setSelectedLocation(location); // LocationModal 열기
            }, 100);
          }}
        />
      )}
    </div>
  );
}
