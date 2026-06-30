import { SELECTORS } from '../config/selectors.js'

export default class CharacterCounter {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.characterCounter.textarea).forEach(textarea => {
      const fieldEl = textarea.closest('[data-js-form-field]')
      const output = fieldEl
        ? fieldEl.querySelector(SELECTORS.characterCounter.output)
        : null
      if (!output) return

      const max = parseInt(textarea.getAttribute('maxlength'), 10) || 0
      const form = textarea.closest('form')

      const onInput = () => this._update(textarea, output, max)
      const onReset = () => this._reset(output, max)

      this._update(textarea, output, max)

      textarea.addEventListener('input', onInput)
      if (form) form.addEventListener('reset', onReset)

      this.instances.push({ textarea, form, onInput, onReset })
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ textarea, form, onInput, onReset }) => {
      textarea.removeEventListener('input', onInput)
      if (form) form.removeEventListener('reset', onReset)
    })
    this.instances = []
    this.isInitialized = false
  }

  _update(textarea, output, max) {
    const count = textarea.value.length
    output.textContent = `${count} / ${max}`
    output.classList.toggle('field__counter--warning', count >= 400 && count < 475)
    output.classList.toggle('field__counter--danger', count >= 475)
  }

  _reset(output, max) {
    output.textContent = `0 / ${max}`
    output.classList.remove('field__counter--warning', 'field__counter--danger')
  }
}
