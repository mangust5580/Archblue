import { SELECTORS } from '../config/selectors.js'
import { EVENTS } from '../config/constants.js'

function getControl(fieldEl) {
  if (fieldEl.classList.contains('select')) return fieldEl.querySelector('[data-js-select-trigger]')
  if (fieldEl.classList.contains('checkbox')) return fieldEl.querySelector('input[type="checkbox"]')
  return fieldEl.querySelector('input, textarea')
}

function getErrorClasses(fieldEl) {
  if (fieldEl.classList.contains('select')) return { modifier: 'select--error', element: 'select__error' }
  if (fieldEl.classList.contains('checkbox')) return { modifier: 'checkbox--error', element: 'checkbox__error' }
  return { modifier: 'field--error', element: 'field__error' }
}

function showError(fieldEl, message) {
  const control = getControl(fieldEl)
  const { modifier, element } = getErrorClasses(fieldEl)

  let errorEl = fieldEl.querySelector('[data-js-form-error]')
  if (!errorEl) {
    errorEl = document.createElement('span')
    errorEl.setAttribute('data-js-form-error', '')
    errorEl.setAttribute('role', 'alert')
    errorEl.className = element
    if (control?.id) {
      errorEl.id = `${control.id}-error`
      control.setAttribute('aria-describedby', errorEl.id)
    }
    fieldEl.appendChild(errorEl)
  }

  errorEl.textContent = message
  if (control) control.setAttribute('aria-invalid', 'true')
  fieldEl.classList.add(modifier)
}

function clearError(fieldEl) {
  const errorEl = fieldEl.querySelector('[data-js-form-error]')
  const control = getControl(fieldEl)

  if (errorEl) {
    if (control && control.getAttribute('aria-describedby') === errorEl.id) {
      control.removeAttribute('aria-describedby')
    }
    errorEl.remove()
  }

  if (control) control.removeAttribute('aria-invalid')
  fieldEl.classList.remove('field--error', 'select--error', 'checkbox--error')
}

function check(fieldEl) {
  const rule = fieldEl.dataset.jsFormField
  if (!rule) return null

  switch (rule) {
    case 'name': {
      const input = fieldEl.querySelector('input')
      return (input?.value || '').trim().length >= 2 ? null : 'Введите ваше имя'
    }
    case 'phone': {
      const input = fieldEl.querySelector('input')
      const digits = (input?.value || '').replace(/\D/g, '')
      const national = (digits[0] === '7' || digits[0] === '8') ? digits.slice(1) : digits
      return national.length === 10 ? null : 'Введите корректный телефон'
    }
    case 'email': {
      const input = fieldEl.querySelector('input')
      const v = (input?.value || '').trim()
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Введите корректный email'
    }
    case 'select': {
      const input = fieldEl.querySelector('input[type="hidden"]')
      return input?.value ? null : (fieldEl.dataset.validateError || 'Выберите значение')
    }
    case 'message': {
      const ta = fieldEl.querySelector('textarea')
      return (ta?.value || '').trim().length >= 10 ? null : 'Кратко опишите проект'
    }
    case 'checked': {
      const cb = fieldEl.querySelector('input[type="checkbox"]')
      return cb?.checked ? null : 'Подтвердите согласие на обработку данных'
    }
    default:
      return null
  }
}

export default class FormValidation {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.formValidation.form).forEach(form => {
      const onSubmit = e => this._onSubmit(e)
      const onInput = e => {
        const field = e.target.closest(SELECTORS.formValidation.field)
        if (field) clearError(field)
      }
      const onChange = e => {
        const field = e.target.closest(SELECTORS.formValidation.field)
        if (field) clearError(field)
      }
      form.addEventListener('submit', onSubmit)
      form.addEventListener('input', onInput)
      form.addEventListener('change', onChange)
      this.instances.push({ form, onSubmit, onInput, onChange })
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ form, onSubmit, onInput, onChange }) => {
      form.removeEventListener('submit', onSubmit)
      form.removeEventListener('input', onInput)
      form.removeEventListener('change', onChange)
    })
    this.instances = []
    this.isInitialized = false
  }

  _onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Array.from(form.querySelectorAll(SELECTORS.formValidation.field))
    let firstInvalid = null

    fields.forEach(fieldEl => {
      const error = check(fieldEl)
      if (error) {
        showError(fieldEl, error)
        if (!firstInvalid) firstInvalid = fieldEl
      } else {
        clearError(fieldEl)
      }
    })

    if (firstInvalid) {
      getControl(firstInvalid)?.focus()
      return
    }

    this._resetForm(form)
    form.dispatchEvent(new CustomEvent(EVENTS.formValid, { bubbles: true }))
  }

  _resetForm(form) {
    form.reset()
    form.querySelectorAll(SELECTORS.formValidation.field).forEach(fieldEl => clearError(fieldEl))
  }
}
