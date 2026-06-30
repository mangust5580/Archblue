import { SELECTORS } from '../config/selectors.js'

export default class Alert {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.alert.root).forEach(el => {
      const close = el.querySelector(SELECTORS.alert.close)
      if (!close) return

      const handler = () => this.dismiss(el)
      close.addEventListener('click', handler)
      this.instances.push({ el, close, handler })
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ close, handler }) => {
      close.removeEventListener('click', handler)
    })
    this.instances = []
    this.isInitialized = false
  }

  dismiss(el) {
    el.dispatchEvent(new CustomEvent('alert:dismiss', { bubbles: true }))
    el.remove()
  }
}
