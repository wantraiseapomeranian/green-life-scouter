import { useEffect } from 'react';
import { Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { calculateGreenScore, getScoreColor, getScoreColorWithOpacity, getScoreGrade } from '../../utils/scoreCalculator';

// 점수 마커 아이콘 생성
function createScoreIcon(score) {
  const color = getScoreColor(score);
  const grade = getScoreGrade(score);

  const iconHtml = `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border-radius: 12px;
        padding: 6px 10px;
        box-shadow: 0 4px 12px ${color}66;
        border: 2px solid white;
        min-width: 48px;
        text-align: center;
      ">
        <div style="
          color: white;
          font-size: 18px;
          font-weight: bold;
          line-height: 1;
        ">${score}</div>
        <div style="
          color: rgba(255,255,255,0.9);
          font-size: 10px;
          margin-top: 2px;
        ">${grade.label}</div>
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${color};
        margin-top: -1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'score-marker',
    iconSize: [60, 50],
    iconAnchor: [30, 50],
  });
}

export default function ResidentialZone({ zone, onClick, onClose, isSelected, popupRefs }) {
  const score = calculateGreenScore(zone.details);
  const fillColor = getScoreColorWithOpacity(score, 0.35);
  const strokeColor = getScoreColor(score);

  // 모달이 닫힐 때 Popup도 닫기
  useEffect(() => {
    if (!isSelected && onClose) {
      const popup = popupRefs?.current?.get(`zone-${zone.id}`);
      if (popup && popup.isOpen()) {
        popup.close();
      }
    }
  }, [isSelected, zone.id, onClose, popupRefs]);

  return (
    <>
      {/* 구역 폴리곤 */}
      <Polygon
        positions={zone.polygon}
        pathOptions={{
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.6 : 0.4,
          color: strokeColor,
          weight: isSelected ? 3 : 2,
          opacity: isSelected ? 1 : 0.8,
        }}
        eventHandlers={{
          click: (e) => {
            e.originalEvent?.stopPropagation();
            // 폴리곤 클릭 시 바로 모달 열기 (Popup은 열지 않음)
            if (onClick) {
              onClick(zone);
            }
          },
        }}
      />

      {/* 점수 마커 */}
      <Marker
        position={[zone.center.lat, zone.center.lng]}
        icon={createScoreIcon(score)}
        eventHandlers={{
          click: (e) => {
            e.originalEvent?.stopPropagation();
            // 마커 클릭 시 바로 모달 열기 (Popup은 열지 않음)
            if (onClick) {
              onClick(zone);
            }
          },
        }}
      >
        <Popup
          closeOnClick={false}
          autoClose={false}
          ref={(popup) => {
            if (popup && popupRefs) {
              popupRefs.current.set(`zone-${zone.id}`, popup);
            } else if (popupRefs) {
              popupRefs.current.delete(`zone-${zone.id}`);
            }
          }}
          eventHandlers={{
            add: () => {
              // Popup이 열릴 때 즉시 모달도 함께 열리도록
              if (onClick) {
                onClick(zone);
              }
            },
          }}
        >
          <div className="text-center min-w-[180px]">
            <p className="font-bold text-gray-800 text-base">{zone.name}</p>
            <div
              className="text-2xl font-bold my-2"
              style={{ color: strokeColor }}
            >
              {score}점
            </div>
            <p className="text-xs text-gray-600 mb-2">{zone.description}</p>
            {zone.nearbyParks.length > 0 && (
              <p className="text-xs text-emerald-600">
                인근: {zone.nearbyParks.join(', ')}
              </p>
            )}
          </div>
        </Popup>
      </Marker>
    </>
  );
}
