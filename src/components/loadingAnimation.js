// Компонент для управления анимациями загрузки
class LoadingManager {
  constructor() {
    this.loadingElements = new Set();
  }

  // Показать анимацию загрузки для кнопки
  showButtonLoading(button, loadingText = 'Загрузка...') {
    if (!button) return;
    
    // Сохраняем оригинальный текст
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent;
    }
    
    // Устанавливаем текст загрузки и добавляем класс
    button.textContent = loadingText;
    button.classList.add('loading');
    button.disabled = true;
    
    this.loadingElements.add(button);
  }

  // Скрыть анимацию загрузки для кнопки
  hideButtonLoading(button) {
    if (!button) return;
    
    // Восстанавливаем оригинальный текст
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
    
    // Убираем класс и включаем кнопку
    button.classList.remove('loading');
    button.disabled = false;
    
    this.loadingElements.delete(button);
  }

  // Показать глобальный индикатор загрузки
  showGlobalLoading() {
    let loader = document.querySelector('.global-loader');
    
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'global-loader';
      loader.innerHTML = `
        <div class="global-loader__spinner"></div>
        <div class="global-loader__text">Загрузка...</div>
      `;
      document.body.appendChild(loader);
    }
    
    loader.classList.add('visible');
    return loader;
  }

  // Скрыть глобальный индикатор загрузки
  hideGlobalLoading() {
    const loader = document.querySelector('.global-loader');
    if (loader) {
      loader.classList.remove('visible');
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 300);
    }
  }

  // Создать скелетон для карточки
  createCardSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'card-skeleton';
    skeleton.innerHTML = `
      <div class="card-skeleton__image"></div>
      <div class="card-skeleton__content">
        <div class="card-skeleton__title"></div>
        <div class="card-skeleton__actions">
          <div class="card-skeleton__like"></div>
          <div class="card-skeleton__count"></div>
        </div>
      </div>
    `;
    return skeleton;
  }

  // Очистить все анимации загрузки
  clearAll() {
    this.loadingElements.forEach(element => {
      this.hideButtonLoading(element);
    });
    this.hideGlobalLoading();
  }
}

// Создаем глобальный экземпляр
const loadingManager = new LoadingManager();

export { loadingManager };