// Компонент для ленивой загрузки изображений
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        // Загружаем изображение когда оно на 10% видимо
        threshold: 0.1,
        // Загружаем изображение за 50px до появления в viewport
        rootMargin: '50px'
      });
    }
  }

  // Метод для загрузки изображения
  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      // Добавляем класс для анимации загрузки
      img.classList.add('loading');
      
      // Создаем новое изображение для предзагрузки
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        // Когда изображение загружено, устанавливаем src и убираем класс загрузки
        img.src = src;
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
      
      imageLoader.onerror = () => {
        // В случае ошибки загрузки
        img.classList.remove('loading');
        img.classList.add('error');
        console.error('Ошибка загрузки изображения:', src);
      };
      
      imageLoader.src = src;
    }
  }

  // Метод для наблюдения за изображением
  observe(img) {
    if (this.imageObserver) {
      this.imageObserver.observe(img);
    } else {
      // Fallback для браузеров без поддержки Intersection Observer
      this.loadImage(img);
    }
  }

  // Метод для прекращения наблюдения
  unobserve(img) {
    if (this.imageObserver) {
      this.imageObserver.unobserve(img);
    }
  }

  // Метод для отключения наблюдателя
  disconnect() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  }
}

// Создаем глобальный экземпляр
const lazyLoader = new LazyImageLoader();

export { lazyLoader }; 