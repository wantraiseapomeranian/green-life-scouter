import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, isStorageAvailable } from '../utils/storage';

/**
 * 안전한 localStorage를 사용하는 커스텀 훅
 * Storage 접근이 불가능한 경우 메모리 State로 폴백
 * 
 * @param {string} key - localStorage 키
 * @param {any} initialValue - 초기값
 * @returns {[any, function, boolean]} [값, setter 함수, storage 사용 가능 여부]
 */
export function useLocalStorage(key, initialValue) {
  // Storage 사용 가능 여부 확인
  const [isStorageReady, setIsStorageReady] = useState(() => {
    try {
      return isStorageAvailable();
    } catch {
      return false;
    }
  });
  
  // 초기값 설정 (Storage에서 로드 시도)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getItem(key, null);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage 초기값 로드 실패 (${key}):`, error);
      return initialValue;
    }
  });

  // Storage 상태 재확인
  useEffect(() => {
    try {
      const available = isStorageAvailable();
      setIsStorageReady(available);
    } catch {
      setIsStorageReady(false);
    }
  }, []);

  // 값 설정 함수
  const setValue = useCallback((value) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // State 업데이트 (항상 메모리에서 동작 - 즉시 반영)
      setStoredValue(valueToStore);
      
      // Storage에 저장 시도 (성공/실패와 관계없이 State는 이미 업데이트됨)
      try {
        const success = setItem(key, valueToStore);
        if (!success && isStorageReady) {
          // Storage 저장 실패 시 메모리 모드로 전환
          setIsStorageReady(false);
          console.warn(`localStorage 저장 실패 (${key}). 메모리 모드로 전환합니다.`);
        }
      } catch (storageError) {
        // Storage 접근 에러는 무시하고 메모리 모드로 계속 동작
        if (isStorageReady) {
          setIsStorageReady(false);
          console.warn(`localStorage 접근 오류 (${key}):`, storageError);
        }
      }
    } catch (error) {
      console.warn(`useLocalStorage 값 설정 실패 (${key}):`, error);
      // 에러 발생해도 State는 업데이트 (메모리 모드)
      setStoredValue(value instanceof Function ? value(storedValue) : value);
    }
  }, [key, storedValue, isStorageReady]);

  // Storage에서 값 다시 로드 (선택적)
  const reloadFromStorage = useCallback(() => {
    try {
      const item = getItem(key, null);
      if (item !== null) {
        setStoredValue(item);
      }
    } catch (error) {
      console.warn(`useLocalStorage 재로드 실패 (${key}):`, error);
    }
  }, [key]);

  return [storedValue, setValue, isStorageReady, reloadFromStorage];
}

/**
 * 여러 키를 한 번에 관리하는 훅
 * @param {Object} keys - { key: initialValue } 형태의 객체
 * @returns {Object} { key: [value, setValue, isReady] } 형태의 객체
 */
export function useMultipleLocalStorage(keys) {
  const result = {};
  
  Object.entries(keys).forEach(([key, initialValue]) => {
    result[key] = useLocalStorage(key, initialValue);
  });
  
  return result;
}

