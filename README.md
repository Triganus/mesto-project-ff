# Mesto Project

## Ссылки / Links

- GitHub Repository: https://github.com/Triganus/mesto-project-ff
- [GitHub Pages](https://triganus.github.io/mesto-project-ff/)

## Описание проекта / Project Description

Mesto - это интерактивная веб-страница, где пользователи могут делиться фотографиями, ставить лайки и редактировать свой профиль. Проект представляет собой одностраничное приложение (SPA) с адаптивным дизайном и полной интеграцией с сервером API.

Mesto is an interactive web page where users can share photos, like posts, and edit their profile. The project is a single-page application (SPA) with responsive design and full API server integration.

## Технологии / Technologies

- HTML5
- CSS3 (Flexbox, Grid Layout)
- JavaScript (ES6+)
- Webpack
- Babel
- REST API
- Git

## Функциональность / Features

- ✅ Адаптивный дизайн / Responsive design
- ✅ Загрузка данных пользователя с сервера / Loading user data from server
- ✅ Загрузка карточек с сервера / Loading cards from server
- ✅ Редактирование профиля с сохранением на сервере / Profile editing with server persistence
- ✅ Обновление аватара пользователя / User avatar updating
- ✅ Добавление новых карточек на сервер / Adding new cards to server
- ✅ Удаление карточек с сервера / Deleting cards from server
- ✅ Постановка и снятие лайков с синхронизацией / Liking and unliking with synchronization
- ✅ Отображение количества лайков / Displaying like count
- ✅ Валидация форм / Form validation
- ✅ Модальные окна / Modal windows
- ✅ UX улучшения (индикация загрузки) / UX improvements (loading indicators)
- ✅ Попап подтверждения удаления / Delete confirmation popup

## API Интеграция / API Integration

Проект интегрирован с сервером Mesto API:
- **Базовый URL**: `https://nomoreparties.co/v1/wff-cohort-40`
- **Аутентификация**: Bearer токен в заголовке `authorization`
- **Формат данных**: JSON

### Эндпоинты / Endpoints:
- `GET /users/me` - получение информации о пользователе
- `PATCH /users/me` - обновление профиля пользователя
- `PATCH /users/me/avatar` - обновление аватара
- `GET /cards` - получение карточек
- `POST /cards` - создание новой карточки
- `DELETE /cards/:cardId` - удаление карточки
- `PUT /cards/likes/:cardId` - постановка лайка
- `DELETE /cards/likes/:cardId` - снятие лайка

## Установка и запуск / Installation and Running

1. Клонировать репозиторий / Clone the repository:
```bash
git clone https://github.com/your-username/mesto-project-ff.git
```

2. Установить зависимости / Install dependencies:
```bash
npm install
```

3. Запустить проект в режиме разработки / Run the project in development mode:
```bash
npm run dev
```

4. Собрать проект для продакшена / Build the project for production:
```bash
npm run build
```

## Структура проекта / Project Structure

```
mesto-project-ff/
├── src/                    # Исходный код / Source code
│   ├── components/        # Компоненты / Components
│   │   ├── api.js        # API функции / API functions
│   │   ├── card.js       # Компонент карточки / Card component
│   │   ├── modal.js      # Модальные окна / Modal windows
│   │   └── validation.js # Валидация форм / Form validation
│   ├── images/           # Изображения / Images
│   ├── pages/            # Страницы и стили / Pages and styles
│   ├── index.js          # Точка входа / Entry point
│   └── index.html        # HTML шаблон / HTML template
├── dist/                  # Собранный проект / Built project
├── webpack.config.js      # Конфигурация Webpack / Webpack configuration
├── package.json          # Зависимости и скрипты / Dependencies and scripts
└── README.md             # Документация / Documentation
```

## Использование / Usage

1. **Редактирование профиля**: Нажмите на кнопку редактирования рядом с именем
2. **Обновление аватара**: Наведите курсор на аватар и нажмите на появившуюся иконку
3. **Добавление карточки**: Нажмите кнопку "+" для добавления новой карточки
4. **Лайки**: Нажмите на сердечко под карточкой для постановки/снятия лайка
5. **Удаление карточки**: Нажмите на иконку корзины (только для своих карточек)

## Планы по улучшению / Future Improvements

- Добавление анимаций / Adding animations
- Улучшение производительности / Performance optimization
- Расширение функциональности / Feature expansion
- Улучшение UX/UI / UX/UI improvements
- Оптимизация работы с API / API optimization

## Лицензия / License

MIT
