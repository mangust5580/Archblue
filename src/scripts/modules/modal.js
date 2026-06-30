import { SELECTORS } from '../config/selectors.js'
import { EVENTS } from '../config/constants.js'

export default class Modal {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
    this._onRootClick = this._onRootClick.bind(this)
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.modal.root).forEach(el => {
      const cancelHandler = (e) => {
        e.preventDefault()
        const inst = this._findByEl(el)
        if (inst) this._close(inst)
      }

      el.addEventListener('cancel', cancelHandler)
      this.instances.push({ el, opener: null, cancelHandler })
    })

    this.root.addEventListener('click', this._onRootClick)
    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ el, cancelHandler }) => {
      el.removeEventListener('cancel', cancelHandler)
      if (el.open) el.close()
    })

    this.root.removeEventListener('click', this._onRootClick)
    this.instances = []
    this.isInitialized = false
    document.body.style.removeProperty('overflow')
  }

  open(id, opener = document.activeElement) {
    const inst = this._findById(id)
    if (inst) {
      inst.opener = opener instanceof HTMLElement ? opener : null
      this._open(inst)
    }
  }

  close(id) {
    const inst = this._findById(id)
    if (inst) this._close(inst)
  }

  _findByEl(el) {
    return this.instances.find(inst => inst.el === el) || null
  }

  _findById(id) {
    return this.instances.find(inst => inst.el.id === id) || null
  }

  _onRootClick(e) {
    const trigger = e.target.closest(SELECTORS.modal.trigger)
    if (trigger) {
      const inst = this._findById(trigger.dataset.jsModalTrigger)
      if (inst) {
        inst.opener = trigger
        this._open(inst)
      }
      return
    }

    const closeEl = e.target.closest(SELECTORS.modal.close)
    if (closeEl) {
      const dialog = closeEl.closest(SELECTORS.modal.root)
      if (dialog) this._close(this._findByEl(dialog))
      return
    }

    if (e.target.matches(SELECTORS.modal.root)) {
      this._close(this._findByEl(e.target))
    }
  }

  _open(inst) {
    if (!inst || inst.el.open) return

    this._lockScroll()
    inst.el.showModal()
    inst.el.dispatchEvent(new CustomEvent(EVENTS.modalOpen, { bubbles: true }))

    const focusable = inst.el.querySelector(
      SELECTORS.modal.focusable
    )
    ;(focusable || inst.el).focus()
  }

  _close(inst) {
    if (!inst || !inst.el.open) return

    inst.el.close()
    this._unlockScroll()
    inst.el.dispatchEvent(new CustomEvent(EVENTS.modalClose, { bubbles: true }))

    if (inst.opener && inst.opener.isConnected) {
      inst.opener.focus()
    }
    inst.opener = null
  }

  _lockScroll() {
    document.body.style.setProperty('overflow', 'hidden')
  }

  _unlockScroll() {
    const anyOpen = this.instances.some(inst => inst.el.open)
    if (!anyOpen) document.body.style.removeProperty('overflow')
  }
}
