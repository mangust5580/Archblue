import { SELECTORS } from '../config/selectors.js'

export default class ProjectsCatalog {
  constructor(root = document) {
    this.root = root
    this.isInitialized = false
    this._handlers = []
  }

  init() {
    if (this.isInitialized) return

    const catalog = this.root.querySelector(SELECTORS.projectsCatalog.root)
    if (!catalog) return

    const filterBtns = Array.from(catalog.querySelectorAll(SELECTORS.projectsCatalog.filter))
    const items = Array.from(catalog.querySelectorAll(SELECTORS.projectsCatalog.item))
    const sortInput = catalog.querySelector(SELECTORS.select.input)
    const emptyState = catalog.querySelector(SELECTORS.projectsCatalog.empty)

    if (!items.length) return

    const state = {
      category: 'all',
      sort: (sortInput && sortInput.value) || 'new',
    }

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('category')) state.category = urlParams.get('category')
    if (urlParams.has('sort')) state.sort = urlParams.get('sort')

    this._apply(state, items, filterBtns, emptyState)

    filterBtns.forEach(btn => {
      const handler = () => {
        state.category = btn.dataset.category || 'all'
        this._syncUrl(state)
        this._apply(state, items, filterBtns, emptyState)
      }
      btn.addEventListener('click', handler)
      this._handlers.push({ el: btn, event: 'click', handler })
    })

    if (sortInput) {
      const handler = e => {
        state.sort = e.target.value
        this._syncUrl(state)
        this._apply(state, items, filterBtns, emptyState)
      }
      sortInput.addEventListener('change', handler)
      this._handlers.push({ el: sortInput, event: 'change', handler })
    }

    this.isInitialized = true
  }

  _apply(state, items, filterBtns, emptyState) {
    const matched = new Set(
      items.filter(item =>
        state.category === 'all' || (item.dataset.category || '') === state.category
      )
    )

    filterBtns.forEach(btn => {
      const isActive = (btn.dataset.category || 'all') === state.category
      btn.classList.toggle('projects-catalog__filter--active', isActive)
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })

    const allSorted = this._sort([...items], state.sort)
    const container = items[0]?.parentElement
    if (container) {
      allSorted.forEach(item => {
        item.hidden = !matched.has(item)
        container.appendChild(item)
      })
    }

    if (emptyState) emptyState.hidden = matched.size > 0
  }

  _sort(items, sortKey) {
    return items.sort((a, b) => {
      switch (sortKey) {
        case 'old':
          return (parseInt(a.dataset.year, 10) || 0) - (parseInt(b.dataset.year, 10) || 0)
        case 'area':
          return (parseInt(b.dataset.area, 10) || 0) - (parseInt(a.dataset.area, 10) || 0)
        case 'name':
          return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'ru')
        default:
          return (parseInt(b.dataset.year, 10) || 0) - (parseInt(a.dataset.year, 10) || 0)
      }
    })
  }

  _syncUrl(state) {
    const params = new URLSearchParams()
    if (state.category && state.category !== 'all') params.set('category', state.category)
    if (state.sort && state.sort !== 'new') params.set('sort', state.sort)
    const qs = params.toString()
    history.replaceState(
      null,
      '',
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    )
  }

  destroy() {
    this._handlers.forEach(({ el, event, handler }) => el.removeEventListener(event, handler))
    this._handlers = []
    this.isInitialized = false
  }
}
