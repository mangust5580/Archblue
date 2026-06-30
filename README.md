# Archblue

[![Deploy GitHub Pages](https://github.com/mangust5580/Archblue/actions/workflows/deploy.yml/badge.svg)](https://github.com/mangust5580/Archblue/actions/workflows/deploy.yml)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Live demo](https://img.shields.io/badge/Live%20demo-GitHub%20Pages-222?logo=github)](https://mangust5580.github.io/Archblue/)

Archblue — портфолио-проект в формате многостраничного сайта для вымышленного архитектурного бюро.

Проект сделан как витринная работа: он показывает семантическую HTML-разметку, Pug-компоненты, SCSS-архитектуру, дизайн-токены, адаптивные изображения, модальные сценарии, клиентскую валидацию форм, базовую доступность, SEO-метаданные и production-oriented сборку статического сайта.

Контент, контакты, адреса, юридические страницы, отзывы, проекты и сценарии формы являются демонстрационными. Форма не отправляет и не сохраняет реальные данные: backend, CRM и сторонний form service не используются. Реальных клиентских данных, NDA-материалов и production-бизнес-информации в проекте нет.

## Состав проекта

* Главная страница с hero-блоком, услугами, проектами, преимуществами, статьями, отзывами и CTA.
* Страница о бюро с описанием подхода, команды, ценностей и процесса работы.
* Страница услуг и отдельная страница услуги.
* Каталог проектов и отдельная страница проекта с галереей, планировками и характеристиками.
* Страница статей и отдельная страница статьи.
* Страница отзывов.
* Страница контактов с формой заявки, картой, офисом, процессом обращения и FAQ.
* Страницы политики конфиденциальности и условий использования.
* Кастомная страница 404 для GitHub Pages.
* Модалка заявки с маской телефона, валидацией, счётчиком символов и thank-you-сценарием.
* Inline success-сообщение для формы на странице контактов.
* Адаптивная вёрстка от 320px.
* Подготовка к публикации на GitHub Pages через GitHub Actions.

## Quality checks

* `npm run check` passes.
* `npm run lint` passes.
* `npm run build` passes.
* В production-сборке используются адаптивные изображения, WebP/AVIF, JPEG fallback и 1x/2x `srcset`.
* В dev-сборке используются JPEG и 1x/2x `srcset` без WebP/AVIF для стабильной локальной разработки.
* Проверены базовые требования доступности: `label`, `aria-label`, `alt`, `width`/`height` у изображений и SVG, focus states, skip-link, landmarks.
* Проверены внутренние `.html`-ссылки и GitHub Pages-safe asset paths.

## Сборка

Проект использует кастомную Gulp 5 сборку для статического многостраничного сайта.

Сборка обрабатывает Pug-шаблоны, SCSS, JavaScript-модули, изображения, SVG-иконки, favicon, sitemap, robots.txt и production-артефакты для GitHub Pages.

Production output: `public/`.

GitHub Actions workflow собирает проект и публикует `public/` на GitHub Pages через официальный Pages artifact deployment. Workflow не пушит generated files в отдельную `gh-pages` ветку.

## Стек

* Pug.
* SCSS.
* CSS custom properties для дизайн-токенов.
* Vanilla JavaScript ES-модули.
* Gulp 5 pipeline.
* SVG sprite.
* Responsive images: JPEG 1x/2x в dev, AVIF/WebP/JPEG в production.
* Локальные шрифты.
* ESLint.
* Stylelint.
* GitHub Actions.
* GitHub Pages.

## JavaScript-модули

* Header / burger navigation.
* Modal.
* Project form flow.
* Thank-you modal flow.
* Input mask для телефона.
* Form validation.
* Form success message.
* Character counter.
* Custom select.
* Project gallery / lightbox.
* Reveal / show-more behaviour.
* Plans slider.

## Требования

Node.js `>=20`.

## Команды

```bash
npm ci
npm run dev
npm run build
npm run lint
npm run check
```

`npm run dev` запускает dev-сборку и локальную разработку.

`npm run build` создаёт production-сборку в `public/`.

`npm run lint` запускает ESLint и Stylelint.

`npm run check` запускает линтеры и production-сборку.

## Переменные окружения

Для генерации sitemap при production-сборке используется `SITE_URL`.

```bash
SITE_URL=https://mangust5580.github.io SITE_BASE_PATH=/Archblue npm run build
```

Для PowerShell:

```powershell
$env:SITE_URL="https://mangust5580.github.io"
$env:SITE_BASE_PATH="/Archblue"
npm run build
```

The deploy workflow runs `npm ci` and `npm run check` with `SITE_URL` as the GitHub Pages origin and `SITE_BASE_PATH` as the repository path.

`SITE_URL` нужен для sitemap. Open Graph / Twitter metadata используют production URL из site data.

## Публикация

Проект подготовлен для публикации на GitHub Pages.

| Параметр            | Значение                                  |
| ------------------- | ----------------------------------------- |
| Репозиторий         | `https://github.com/mangust5580/Archblue` |
| Live demo           | `https://mangust5580.github.io/Archblue/` |
| Workflow            | `.github/workflows/deploy.yml`            |
| Publish directory   | `public/`                                 |
| GitHub Pages source | GitHub Actions                            |

Для публикации:

1. В GitHub открыть `Settings → Pages`.
2. В `Build and deployment` выбрать `Source: GitHub Actions`.
3. Запушить изменения в ветку `main`.
4. Дождаться успешного workflow во вкладке `Actions`.
5. Открыть live demo.

## License

MIT License. See [LICENSE](LICENSE).

## Production

Проект готов для статического хостинга на GitHub Pages.

Для реального коммерческого продукта нужно заменить демонстрационные контакты, юридический текст, отзывы, кейсы и обработку формы на production-данные и backend-интеграцию.
