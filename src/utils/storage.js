/**
 * 안전한 localStorage 접근 유틸리티
 * localStorage 접근이 불가능한 환경에서도 앱이 작동하도록 처리
 */

/**
 * localStorage가 사용 가능한지 확인
 * 접근 불가 환경(iframe, 시크릿 모드 등)에서도 안전하게 처리
 */
export function isStorageAvailable() {
  try {
    // localStorage 객체 존재 여부 먼저 확인
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }

    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    // 시크릿 모드나 보안 설정으로 인한 접근 거부
    // SecurityError, QuotaExceededError, 또는 기타 접근 오류 처리
    return false;
  }
}

/**
 * 안전하게 localStorage에서 값 가져오기
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    if (!isStorageAvailable()) {
      return defaultValue;
    }

    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    // 모든 접근 오류를 조용히 처리하고 기본값 반환
    return defaultValue;
  }
}

/**
 * 안전하게 localStorage에 값 저장하기
 */
export function safeSetItem(key, value) {
  try {
    if (!isStorageAvailable()) {
      return false;
    }

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    // 모든 저장 오류를 조용히 처리 (메모리 폴백으로 전환됨)
    return false;
  }
}

/**
 * 메모리 기반 폴백 스토리지 (localStorage가 없을 때 사용)
 */
const memoryStorage = new Map();

export function getItem(key, defaultValue = null) {
  try {
    if (isStorageAvailable()) {
      return safeGetItem(key, defaultValue);
    }
  } catch {
    // 접근 오류 시 메모리 스토리지로 폴백
  }
  // localStorage가 없으면 메모리 스토리지 사용
  return memoryStorage.has(key) ? memoryStorage.get(key) : defaultValue;
}

export function setItem(key, value) {
  try {
    if (isStorageAvailable()) {
      return safeSetItem(key, value);
    }
  } catch {
    // 접근 오류 시 메모리 스토리지로 폴백
  }
  // localStorage가 없으면 메모리 스토리지 사용
  memoryStorage.set(key, value);
  return true;
}

