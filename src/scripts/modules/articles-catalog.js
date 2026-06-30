import { SELECTORS } from '../config/selectors.js'

const INITIAL_VISIBLE = 3
const LOAD_STEP = 3

export default class ArticlesCatalog {
  constructor(root = document) {
    this.root = root
    this.isInitialized = false
    this._handlers = []
  }

  init() {
    if (this.isInitialized) return

    const catalog = this.root.querySelector(SELECTORS.articlesCatalog.root)
    if (!catalog) return

    const searchForm = this.root.querySelector(SELECTORS.articlesCatalog.searchForm)
    const searchInput = this.root.querySelector(SELECTORS.articlesCatalog.searchInput)
    const categoryBtns = Array.from(this.root.querySelectorAll(SELECTORS.articlesCatalog.categoryBtn))
    const items = Array.from(catalog.querySelectorAll(SELECTORS.articlesCatalog.item))
    const moreWrapper = catalog.querySelector(SELECTORS.articlesCatalog.moreWrapper)
    const moreBtn = moreWrapper
      ? moreWrapper.querySelector(SELECTORS.articlesCatalog.more)
      : null
    const emptyState = catalog.querySelector(SELECTORS.articlesCatalog.empty)

    if (!items.length) return

    const state = { category: 'all', query: '', visibleCount: INITIAL_VISIBLE }

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('category')) state.category = urlParams.get('category')
    if (urlParams.has('q')) {
      state.query = urlParams.get('q').trim()
      if (searchInput) searchInput.value = state.query
    }

    this._apply(state, items, categoryBtns, moreWrapper, emptyState)

    categoryBtns.forEach(btn => {
      const handler = () => {
        state.category = btn.dataset.category || 'all'
        state.visibleCount = INITIAL_VISIBLE
        this._syncUrl(state)
        this._apply(state, items, categoryBtns, moreWrapper, emptyState)
      }
      btn.addEventListener('click', handler)
      this._handlers.push({ el: btn, event: 'click', handler })
    })

    if (searchForm) {
      const handler = e => {
        e.preventDefault()
        state.query = searchInput ? searchInput.value.trim() : ''
        state.visibleCount = INITIAL_VISIBLE
        this._syncUrl(state)
        this._apply(state, items, categoryBtns, moreWrapper, emptyState)
      }
      searchForm.addEventListener('submit', handler)
      this._handlers.push({ el: searchForm, event: 'submit', handler })
    }

    if (moreBtn) {
      const handler = () => {
        state.visibleCount += LOAD_STEP
        this._apply(state, items, categoryBtns, moreWrapper, emptyState)
      }
      moreBtn.addEventListener('click', handler)
      this._handlers.push({ el: moreBtn, event: 'click', handler })
    }

    this.isInitialized = true
  }

  _apply(state, items, categoryBtns, moreWrapper, emptyState) {
    const q = state.query.toLowerCase()

    const matched = items.filter(item => {
      const cat = item.dataset.category || ''
      const title = (item.dataset.title || '').toLowerCase()
      const text = (item.dataset.text || '').toLowerCase()
      const catMatch = state.category === 'all' || cat === state.category
      const queryMatch = !q || title.includes(q) || text.includes(q) || cat.includes(q)
      return catMatch && queryMatch
    })

    categoryBtns.forEach(btn => {
      const isActive = (btn.dataset.category || 'all') === state.category
      btn.classList.toggle('articles-categories__button--active', isActive)
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })

    items.forEach(item => { item.hidden = true })
    matched.slice(0, state.visibleCount).forEach(item => { item.hidden = false })

    if (emptyState) emptyState.hidden = matched.length > 0
    if (moreWrapper) moreWrapper.hidden = matched.length <= state.visibleCount
  }

  _syncUrl(state) {
    const params = new URLSearchParams()
    if (state.query) params.set('q', state.query)
    if (state.category && state.category !== 'all') params.set('category', state.category)
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
