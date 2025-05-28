// Компонент для оптимизации производительности
class PerformanceOptimizer {
  constructor() {
    this.renderQueue = [];
    this.isRendering = false;
    this.frameId = null;
  }

  // Батчинг DOM операций
  batchDOMUpdates(callback) {
    this.renderQueue.push(callback);
    
    if (!this.isRendering) {
      this.isRendering = true;
      this.frameId = requestAnimationFrame(() => {
        this.flushRenderQueue();
      });
    }
  }

  // Выполнение всех операций в очереди
  flushRenderQueue() {
    const queue = [...this.renderQueue];
    this.renderQueue = [];
    
    // Группируем операции чтения и записи
    const reads = [];
    const writes = [];
    
    queue.forEach(operation => {
      if (operation.type === 'read') {
        reads.push(operation.callback);
      } else {
        writes.push(operation.callback);
      }
    });
    
    // Сначала выполняем все чтения
    reads.forEach(read => read());
    
    // Затем все записи
    writes.forEach(write => write());
    
    this.isRendering = false;
  }

  // Оптимизированное добавление элементов
  addElement(container, element, position = 'append') {
    this.batchDOMUpdates({
      type: 'write',
      callback: () => {
        if (position === 'prepend') {
          container.prepend(element);
        } else {
          container.append(element);
        }
      }
    });
  }

  // Оптимизированное удаление элементов
  removeElement(element, withAnimation = true) {
    if (withAnimation) {
      element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        this.batchDOMUpdates({
          type: 'write',
          callback: () => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          }
        });
      }, 300);
    } else {
      this.batchDOMUpdates({
        type: 'write',
        callback: () => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      });
    }
  }

  // Дебаунсинг скролла
  createScrollHandler(callback, delay = 16) {
    let ticking = false;
    
    return function(event) {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback(event);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  // Оптимизация изображений
  optimizeImage(img, options = {}) {
    const {
      quality = 0.8,
      maxWidth = 800,
      maxHeight = 600
    } = options;

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Вычисляем новые размеры
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Рисуем изображение
        ctx.drawImage(img, 0, 0, width, height);
        
        // Конвертируем в blob
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
    });
  }

  // Виртуализация списка (для больших списков карточек)
  createVirtualList(container, items, renderItem, itemHeight = 300) {
    const containerHeight = container.clientHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // +2 для буфера
    
    let scrollTop = 0;
    let startIndex = 0;
    
    const virtualContainer = document.createElement('div');
    virtualContainer.style.height = `${items.length * itemHeight}px`;
    virtualContainer.style.position = 'relative';
    
    const visibleContainer = document.createElement('div');
    visibleContainer.style.position = 'absolute';
    visibleContainer.style.top = '0';
    visibleContainer.style.width = '100%';
    
    virtualContainer.appendChild(visibleContainer);
    container.appendChild(virtualContainer);
    
    const updateVisibleItems = () => {
      startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, items.length);
      
      // Очищаем контейнер
      visibleContainer.innerHTML = '';
      
      // Рендерим видимые элементы
      for (let i = startIndex; i < endIndex; i++) {
        const item = renderItem(items[i], i);
        item.style.position = 'absolute';
        item.style.top = `${i * itemHeight}px`;
        item.style.width = '100%';
        visibleContainer.appendChild(item);
      }
    };
    
    // Обработчик скролла
    const scrollHandler = this.createScrollHandler((e) => {
      scrollTop = container.scrollTop;
      updateVisibleItems();
    });
    
    container.addEventListener('scroll', scrollHandler);
    
    // Первоначальный рендер
    updateVisibleItems();
    
    return {
      update: (newItems) => {
        items = newItems;
        virtualContainer.style.height = `${items.length * itemHeight}px`;
        updateVisibleItems();
      },
      destroy: () => {
        container.removeEventListener('scroll', scrollHandler);
        container.removeChild(virtualContainer);
      }
    };
  }

  // Очистка ресурсов
  cleanup() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderQueue = [];
    this.isRendering = false;
  }
}

// Создаем глобальный экземпляр
const performanceOptimizer = new PerformanceOptimizer();

export { performanceOptimizer }; 