import { SELECTORS } from '../config/selectors.js'
import { KEYS, CLASSES } from '../config/constants.js'

export default class Header {
  constructor(root = document) {
    this.root = root
    this.header = null
    this.burger = null
    this.menu = null
    this._onBurgerClick = this._onBurgerClick.bind(this)
    this._onKeydown = this._onKeydown.bind(this)
    this._onMenuClick = this._onMenuClick.bind(this)
    this._onOutsideClick = this._onOutsideClick.bind(this)
  }

  init() {
    this.header = this.root.querySelector(SELECTORS.header.root)
    if (!this.header) return

    this.burger = this.header.querySelector(SELECTORS.header.burger)
    this.menu = this.header.querySelector(SELECTORS.header.menu)
    if (!this.burger || !this.menu) return

    this.burger.addEventListener('click', this._onBurgerClick)
    this.root.addEventListener('keydown', this._onKeydown)
    this.menu.addEventListener('click', this._onMenuClick)
    this.root.addEventListener('click', this._onOutsideClick)
  }

  destroy() {
    this.burger?.removeEventListener('click', this._onBurgerClick)
    this.root.removeEventListener('keydown', this._onKeydown)
    this.menu?.removeEventListener('click', this._onMenuClick)
    this.root.removeEventListener('click', this._onOutsideClick)

    if (!this.menu?.hidden) this._close()

    this.header = null
    this.burger = null
    this.menu = null
  }

  _open() {
    this.menu.hidden = false
    this.burger.setAttribute('aria-expanded', 'true')
    this.burger.setAttribute('aria-label', 'Закрыть меню')
    this.header.classList.add(CLASSES.headerOpen)
    document.body.style.setProperty('overflow', 'hidden')
  }

  _close() {
    this.menu.hidden = true
    this.burger.setAttribute('aria-expanded', 'false')
    this.burger.setAttribute('aria-label', 'Открыть меню')
    this.header.classList.remove(CLASSES.headerOpen)
    document.body.style.removeProperty('overflow')
  }

  _onBurgerClick() {
    if (this.menu.hidden) {
      this._open()
    } else {
      this._close()
    }
  }

  _onKeydown(e) {
    if (e.key === KEYS.Escape && !this.menu.hidden) {
      this._close()
      this.burger.focus()
    }
  }

  _onMenuClick(e) {
    if (e.target.closest(SELECTORS.header.link)) {
      this._close()
    }
  }

  _onOutsideClick(e) {
    if (!this.menu.hidden && !this.header.contains(e.target)) {
      this._close()
    }
  }
}
