// Утилита для дебаунсинга функций
export function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    // Очищаем предыдущий таймер
    clearTimeout(timeoutId);
    
    // Устанавливаем новый таймер
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Утилита для троттлинга функций
export function throttle(func, delay) {
  let lastCall = 0;
  
  return function (...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Кэш для DOM элементов
class DOMCache {
  constructor() {
    this.cache = new Map();
  }
  
  get(selector) {
    if (!this.cache.has(selector)) {
      const element = document.querySelector(selector);
      if (element) {
        this.cache.set(selector, element);
      }
      return element;
    }
    return this.cache.get(selector);
  }
  
  getAll(selector) {
    const cacheKey = `all:${selector}`;
    if (!this.cache.has(cacheKey)) {
      const elements = document.querySelectorAll(selector);
      this.cache.set(cacheKey, elements);
      return elements;
    }
    return this.cache.get(cacheKey);
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(selector) {
    this.cache.delete(selector);
    this.cache.delete(`all:${selector}`);
  }
}

// Создаем глобальный экземпляр кэша
export const domCache = new DOMCache(); 