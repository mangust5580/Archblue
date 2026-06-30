import { SELECTORS } from '../config/selectors.js'
import { EVENTS } from '../config/constants.js'

export default class FormSuccess {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
    this._onFormValid = this._onFormValid.bind(this)
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.formSuccess.message).forEach(messageEl => {
      const form = messageEl.closest('form')
      if (!form) return

      const onInput = () => this._hide(messageEl)
      const onChange = () => this._hide(messageEl)

      form.addEventListener('input', onInput)
      form.addEventListener('change', onChange)
      this.instances.push({ form, messageEl, onInput, onChange })
    })

    this.root.addEventListener(EVENTS.formValid, this._onFormValid)
    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ form, onInput, onChange }) => {
      form.removeEventListener('input', onInput)
      form.removeEventListener('change', onChange)
    })
    this.root.removeEventListener(EVENTS.formValid, this._onFormValid)
    this.instances = []
    this.isInitialized = false
  }

  _onFormValid(e) {
    const instance = this.instances.find(inst => inst.form === e.target)
    if (!instance) return
    this._show(instance.messageEl)
  }

  _show(messageEl) {
    messageEl.removeAttribute('hidden')
  }

  _hide(messageEl) {
    messageEl.setAttribute('hidden', '')
  }
}
