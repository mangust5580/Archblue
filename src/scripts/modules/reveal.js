export default class Reveal {
  constructor(root = document, config = {}) {
    this.root = root
    this.config = config
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    const { rootSelector, itemSelector, triggerSelector, triggerButtonSelector } = this.config

    this.root.querySelectorAll(rootSelector).forEach(el => {
      const triggerEl = el.querySelector(triggerSelector)
      const items = Array.from(el.querySelectorAll(itemSelector))
      if (!triggerEl || !items.length) return

      const button = triggerButtonSelector ? triggerEl.querySelector(triggerButtonSelector) : triggerEl
      if (!button) return

      const step = parseInt(el.dataset.step, 10) || Infinity
      const handler = () => this.onReveal(items, triggerEl, step)
      button.addEventListener('click', handler)
      this.instances.push({ button, handler })
      this.sync(items, triggerEl)
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ button, handler }) => button.removeEventListener('click', handler))
    this.instances = []
    this.isInitialized = false
  }

  onReveal(items, triggerEl, step) {
    items.filter(item => item.hasAttribute('hidden')).slice(0, step).forEach(item => item.removeAttribute('hidden'))
    this.sync(items, triggerEl)
  }

  sync(items, triggerEl) {
    triggerEl.hidden = !items.some(item => item.hasAttribute('hidden'))
  }
}
