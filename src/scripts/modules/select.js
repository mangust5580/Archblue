import { ATTRIBUTES, CLASSES, KEYS, ROLES } from '../config/constants.js'
import { SELECTORS } from '../config/selectors.js'

const isAriaDisabled = el => el?.getAttribute(ATTRIBUTES.ariaDisabled) === 'true'
const isOptionDisabled = option => isAriaDisabled(option)
const isScrollableY = el => /(auto|scroll|overlay)/.test(window.getComputedStyle(el).overflowY)
const canScroll = el => el && el.scrollHeight > el.clientHeight

export default class Select {
  constructor(root = document) {
    this.root = root
    this.document = root?.ownerDocument ?? document
    this.instances = []
    this.instanceId = 0
    this.isInitialized = false
    this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this)
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.select.root).forEach(root => {
      const trigger = root.querySelector(SELECTORS.select.trigger)
      const value = root.querySelector(SELECTORS.select.value)
      const dropdown = root.querySelector(SELECTORS.select.dropdown)
      const input = root.querySelector(SELECTORS.select.input)
      const options = Array.from(root.querySelectorAll(SELECTORS.select.option))

      if (!trigger || !value || !dropdown || options.length === 0) return

      const instance = {
        root,
        trigger,
        value,
        dropdown,
        input,
        options,
        activeIndex: -1,
        isRequired: root.hasAttribute(ATTRIBUTES.selectRequired),
        form: root.closest('form'),
        placeholder: root.dataset.jsSelectPlaceholder ?? value.textContent.trim(),
        onTriggerClick: null,
        onRootKeyDown: null,
        onFormReset: null,
        onOptionClicks: [],
      }

      this.setupA11y(instance)

      instance.onTriggerClick = () => {
        if (this.isDisabled(instance)) return
        this.toggle(instance)
      }

      instance.onRootKeyDown = event => this.onKeyDown(event, instance)
      instance.onFormReset = () => this.resetInstance(instance)

      trigger.addEventListener('click', instance.onTriggerClick)
      root.addEventListener('keydown', instance.onRootKeyDown)
      instance.form?.addEventListener('reset', instance.onFormReset)

      options.forEach((option, index) => {
        const handler = event => {
          event.preventDefault()
          if (this.isDisabled(instance) || isOptionDisabled(option)) return
          this.selectIndex(instance, index)
          this.close(instance, { focusTrigger: true })
        }
        option.addEventListener('click', handler)
        instance.onOptionClicks.push(handler)
      })

      this.setupInitialSelection(instance)
      this.instances.push(instance)
    })

    this.document.addEventListener('pointerdown', this.onDocumentPointerDown)
    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(instance => {
      instance.trigger.removeEventListener('click', instance.onTriggerClick)
      instance.root.removeEventListener('keydown', instance.onRootKeyDown)
      instance.form?.removeEventListener('reset', instance.onFormReset)
      instance.options.forEach((option, index) => {
        option.removeEventListener('click', instance.onOptionClicks[index])
      })
    })
    this.document.removeEventListener('pointerdown', this.onDocumentPointerDown)
    this.instances = []
    this.isInitialized = false
  }

  ensureId(element, prefix) {
    if (element.id) return element.id
    this.instanceId += 1
    element.id = `${prefix}-${this.instanceId}`
    return element.id
  }

  setupA11y(instance) {
    const { root, trigger, dropdown, options, isRequired } = instance
    const rootId = this.ensureId(root, 'js-select')
    const dropdownId = this.ensureId(dropdown, `${rootId}-listbox`)

    trigger.setAttribute(ATTRIBUTES.ariaHaspopup, ROLES.listbox)
    trigger.setAttribute(ATTRIBUTES.ariaControls, dropdownId)
    trigger.setAttribute(ATTRIBUTES.ariaExpanded, 'false')
    dropdown.setAttribute(ATTRIBUTES.role, ROLES.listbox)

    if (isRequired) trigger.setAttribute(ATTRIBUTES.ariaRequired, 'true')

    options.forEach((option, index) => {
      this.ensureId(option, `${rootId}-option-${index + 1}`)
      option.setAttribute(ATTRIBUTES.role, ROLES.option)
      if (!option.hasAttribute(ATTRIBUTES.ariaSelected)) {
        option.setAttribute(ATTRIBUTES.ariaSelected, 'false')
      }
    })
  }

  isDisabled(instance) {
    return (
      instance.trigger.disabled ||
      instance.root.classList.contains(CLASSES.selectDisabled) ||
      isAriaDisabled(instance.root) ||
      isAriaDisabled(instance.trigger)
    )
  }

  setupInitialSelection(instance) {
    const byInput = instance.input?.value
      ? instance.options.find(opt => opt.dataset.value === instance.input.value)
      : null
    const byAria = instance.options.find(opt => opt.getAttribute(ATTRIBUTES.ariaSelected) === 'true')
    const initial = byInput ?? byAria
    if (!initial) return
    const index = instance.options.indexOf(initial)
    if (index >= 0) this.selectIndex(instance, index, { silent: true })
  }

  toggle(instance) {
    if (instance.root.classList.contains(CLASSES.selectOpen)) {
      this.close(instance, { focusTrigger: true })
    } else {
      this.open(instance)
    }
  }

  open(instance) {
    if (this.isDisabled(instance)) return
    this.closeAll(instance)
    instance.root.classList.add(CLASSES.selectOpen)
    instance.trigger.setAttribute(ATTRIBUTES.ariaExpanded, 'true')

    const selectedIndex = instance.options.findIndex(opt => opt.getAttribute(ATTRIBUTES.ariaSelected) === 'true')
    const fallback = instance.options.findIndex(opt => !isOptionDisabled(opt))
    this.setActiveIndex(instance, selectedIndex >= 0 ? selectedIndex : fallback)
    this.ensureDropdownVisible(instance)
  }

  close(instance, { focusTrigger = false } = {}) {
    instance.root.classList.remove(CLASSES.selectOpen)
    instance.trigger.setAttribute(ATTRIBUTES.ariaExpanded, 'false')
    this.setActiveIndex(instance, -1)
    if (focusTrigger) instance.trigger.focus()
  }

  closeAll(except = null) {
    this.instances.forEach(instance => {
      if (instance !== except) this.close(instance)
    })
  }

  resetInstance(instance) {
    instance.options.forEach(opt => opt.setAttribute(ATTRIBUTES.ariaSelected, 'false'))
    instance.root.classList.remove(CLASSES.selectSelected)
    instance.value.textContent = instance.placeholder
    if (instance.input) instance.input.value = ''
    this.close(instance)
  }

  selectIndex(instance, index, { silent = false } = {}) {
    const option = instance.options[index]
    if (!option || isOptionDisabled(option)) return

    instance.options.forEach(opt => opt.setAttribute(ATTRIBUTES.ariaSelected, 'false'))
    option.setAttribute(ATTRIBUTES.ariaSelected, 'true')

    instance.value.textContent = option.textContent?.trim() ?? ''
    instance.root.classList.add(CLASSES.selectSelected)

    if (instance.input) {
      instance.input.value = option.dataset.value ?? option.textContent?.trim() ?? ''
      if (!silent) instance.input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  setActiveIndex(instance, index) {
    instance.options.forEach(opt => opt.classList.remove(CLASSES.optionActive))
    instance.activeIndex = index

    if (index < 0) {
      instance.trigger.removeAttribute(ATTRIBUTES.ariaActivedescendant)
      return
    }

    const option = instance.options[index]
    if (!option) return
    option.classList.add(CLASSES.optionActive)
    instance.trigger.setAttribute(ATTRIBUTES.ariaActivedescendant, option.id)
    option.scrollIntoView({ block: 'nearest' })
  }

  moveActive(instance, step) {
    const enabled = instance.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !isOptionDisabled(option))

    if (!enabled.length) return

    const current = enabled.findIndex(({ index }) => index === instance.activeIndex)
    const next = current < 0 ? 0 : (current + step + enabled.length) % enabled.length
    this.setActiveIndex(instance, enabled[next].index)
    this.ensureDropdownVisible(instance)
  }

  moveEdge(instance, isEnd) {
    const enabled = instance.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !isOptionDisabled(option))

    if (!enabled.length) return
    const target = isEnd ? enabled[enabled.length - 1] : enabled[0]
    this.setActiveIndex(instance, target.index)
    this.ensureDropdownVisible(instance)
  }

  getScrollableParent(element) {
    let current = element.parentElement
    while (current && current !== this.document.body) {
      if (isScrollableY(current) && canScroll(current)) return current
      current = current.parentElement
    }
    const scrollEl = this.document.scrollingElement || this.document.documentElement
    return canScroll(scrollEl) ? scrollEl : null
  }

  ensureDropdownVisible(instance) {
    window.requestAnimationFrame(() => {
      if (!instance.root.classList.contains(CLASSES.selectOpen)) return
      const container = this.getScrollableParent(instance.root)
      if (!container) return

      const dropRect = instance.dropdown.getBoundingClientRect()
      const isDocScroll = container === this.document.scrollingElement || container === this.document.documentElement
      const containerBottom = isDocScroll
        ? window.innerHeight || this.document.documentElement.clientHeight
        : container.getBoundingClientRect().bottom
      const containerTop = isDocScroll ? 0 : container.getBoundingClientRect().top
      const margin = 8

      const overflowBottom = dropRect.bottom - containerBottom + margin
      const overflowTop = containerTop - dropRect.top + margin

      if (overflowBottom > 0) {
        container.scrollTop += overflowBottom
      } else if (overflowTop > 0) {
        container.scrollTop -= overflowTop
      }
    })
  }

  onKeyDown(event, instance) {
    if (this.isDisabled(instance)) return
    const isOpen = instance.root.classList.contains(CLASSES.selectOpen)
    const { key } = event

    if (key === KEYS.Tab) {
      if (isOpen) this.close(instance)
      return
    }

    if (key === KEYS.Escape) {
      if (!isOpen) return
      event.preventDefault()
      this.close(instance, { focusTrigger: true })
      return
    }

    if (key === KEYS.ArrowDown || key === KEYS.ArrowUp) {
      event.preventDefault()
      if (!isOpen) {
        this.open(instance)
        return
      }
      this.moveActive(instance, key === KEYS.ArrowDown ? 1 : -1)
      return
    }

    if (key === KEYS.Home || key === KEYS.End) {
      if (!isOpen) return
      event.preventDefault()
      this.moveEdge(instance, key === KEYS.End)
      return
    }

    if (key === KEYS.Enter || key === KEYS.Space) {
      event.preventDefault()
      if (!isOpen) {
        this.open(instance)
        return
      }
      if (instance.activeIndex >= 0) this.selectIndex(instance, instance.activeIndex)
      this.close(instance, { focusTrigger: true })
    }
  }

  onDocumentPointerDown(event) {
    this.instances.forEach(instance => {
      if (!instance.root.classList.contains(CLASSES.selectOpen)) return
      if (!instance.root.contains(event.target)) this.close(instance)
    })
  }
}
