# Project: Birson

## Tech Stack
- Frontend: React 19, TypeScript
- Styling: Tailwind CSS v4
- Routing: React Router v7
- Package manager: npm
- HMR and build: Vite 7

## Commands
- `npm run dev` — run development server
- `npm run build` — build for production
- `npm run lint` — lint code

## Code Conventions
- Функциональные компоненты с хуками, без классов
- TypeScript strict mode
- Именование: PascalCase для компонентов, camelCase для функций/переменных
- Каждый компонент — в отдельной папке с index.ts, Component.tsx, Component.test.tsx
- Импорты через алиас @/ для src/

## Project Structure
- /src/components — переиспользуемые компоненты
- /src/pages — страницы
- /src/hooks — кастомные хуки
- /src/utils — утилиты
- /src/api — API-клиент и запросы
- /src/context — React Contexts
- /src/entities — сущности (интерфейсы и константы)
- /src/shared — общие компоненты и утилиты
- /src/icons — SVG-иконки
- /src/layout — макеты и навигация
- /src/images/icons.svg — SVG-спрайт

## Rules
- Всегда типизировать пропсы через interface
- Не использовать any
- Прежде чем писать новый компонент пересмотреть, может быть он уже есть
