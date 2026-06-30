import { SELECTORS } from '../config/selectors.js'

function extractDigits(value) {
  let digits = value.replace(/\D/g, '')
  if (digits[0] === '7' || digits[0] === '8') {
    digits = digits.slice(1)
  }
  return digits.slice(0, 10)
}

function formatPhone(digits) {
  if (!digits.length) return ''
  let result = '+7 (' + digits.slice(0, 3)
  if (digits.length > 3) result += ') ' + digits.slice(3, 6)
  if (digits.length > 6) result += '-' + digits.slice(6, 8)
  if (digits.length > 8) result += '-' + digits.slice(8, 10)
  return result
}

export default class InputMask {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return
    this.root.querySelectorAll(SELECTORS.inputMask.phone).forEach(input => {
      if (input.value) input.value = formatPhone(extractDigits(input.value))
      const onInput = e => this._onInput(e)
      input.addEventListener('input', onInput)
      this.instances.push({ input, onInput })
    })
    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ input, onInput }) => {
      input.removeEventListener('input', onInput)
    })
    this.instances = []
    this.isInitialized = false
  }

  _onInput(e) {
    const input = e.target
    input.value = formatPhone(extractDigits(input.value))
  }
}
