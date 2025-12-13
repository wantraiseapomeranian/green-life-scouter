import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { getTermDefinition } from '../../data/terminology';

/**
 * 용어 설명 툴팁 컴포넌트
 * 전문 용어 옆에 도움말 아이콘을 배치하고, 클릭 시 설명을 보여줌
 *
 * @param {string} term - 표시할 용어 (TERM_DEFINITIONS에 정의된 키)
 * @param {string} className - 추가 CSS 클래스
 * @param {string} position - 툴팁 위치 ('top' | 'bottom'), 기본값 'bottom'
 */
export default function TermTooltip({ term, className = '', position = 'bottom' }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);
  const definition = getTermDefinition(term);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // 정의가 없으면 단순 텍스트만 반환
  if (!definition) {
    return <span className={className}>{term}</span>;
  }

  // 툴팁이 화면 밖으로 나가지 않도록 위치 계산
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const [tooltipStyle, setTooltipStyle] = useState({});
  
  useEffect(() => {
    if (isOpen && tooltipRef.current) {
      const buttonElement = tooltipRef.current.querySelector('button');
      
      if (buttonElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const bottomNavHeight = 80; // 하단 네비게이션 높이
        const tooltipHeight = 120; // 툴팁 예상 높이
        const tooltipWidth = 256; // 기본 너비
        const padding = 16; // 여유 공간
        
        // 아이콘 오른쪽 끝부터 화면 끝까지의 공간
        const spaceRight = viewportWidth - buttonRect.right;
        
        // 툴팁 최대 너비 설정 (화면 밖으로 나가지 않도록)
        const maxWidth = Math.min(tooltipWidth, spaceRight - padding);
        const finalWidth = Math.max(200, maxWidth); // 최소 200px
        
        // 위/아래 위치 결정
        const spaceBelow = viewportHeight - buttonRect.bottom - bottomNavHeight;
        const spaceAbove = buttonRect.top;
        
        let finalPosition = position;
        if (spaceBelow < tooltipHeight && spaceAbove > tooltipHeight) {
          finalPosition = 'top';
        } else {
          finalPosition = 'bottom';
        }
        
        setTooltipPosition(finalPosition);
        setTooltipStyle({
          left: `${buttonRect.width}px`, // 아이콘 오른쪽에 붙임
          maxWidth: `${finalWidth}px`,
          width: `${finalWidth}px`,
        });
      }
    }
  }, [isOpen, position]);

  const tooltipPositionClass = tooltipPosition === 'top'
    ? 'bottom-full mb-2'
    : 'top-full mt-2';

  const arrowPositionClass = tooltipPosition === 'top'
    ? 'top-full border-t-gray-800/90 border-x-transparent border-b-transparent'
    : 'bottom-full border-b-gray-800/90 border-x-transparent border-t-transparent';

  return (
    <span
      ref={tooltipRef}
      className={`relative inline-flex items-center gap-1 ${className}`}
    >
      <span className="truncate">{term}</span>
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-gray-200/50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 flex-shrink-0"
        aria-label={`${term} 설명 보기`}
        aria-expanded={isOpen}
      >
        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
      </button>

      {/* 툴팁 말풍선 - 아이콘 오른쪽에 붙이고, 화면 밖으로 나가지 않게 */}
      {isOpen && (
        <div
          className={`absolute ${tooltipPositionClass} z-[100] animate-in fade-in zoom-in-95 duration-200`}
          role="tooltip"
          style={tooltipStyle}
        >
          <div className="relative bg-gray-800/90 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2.5 shadow-xl">
            {/* 화살표 - 아이콘 쪽을 가리키도록 왼쪽에 배치 */}
            <div
              className={`arrow absolute left-4 ${arrowPositionClass} w-0 h-0 border-[6px]`}
            />
            {/* 용어 제목 */}
            <p className="font-semibold text-emerald-400 mb-1 break-keep">
              {term}
            </p>
            {/* 설명 */}
            <p className="text-gray-100 leading-relaxed break-keep">
              {definition}
            </p>
          </div>
        </div>
      )}
    </span>
  );
}
