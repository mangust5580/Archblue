import { ATTRIBUTES } from '../config/constants.js'
import { SELECTORS } from '../config/selectors.js'

export default class Accordion {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.accordion.root).forEach(el => {
      const triggers = Array.from(el.querySelectorAll(SELECTORS.accordion.trigger))
      if (!triggers.length) return

      const multiple = el.dataset.jsAccordionMultiple === 'true'
      const handlers = triggers.map(trigger => {
        const handler = () => this.onTrigger(el, triggers, trigger, multiple)
        trigger.addEventListener('click', handler)
        return handler
      })

      this.instances.push({ el, triggers, handlers })
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(({ triggers, handlers }) => {
      triggers.forEach((trigger, i) => trigger.removeEventListener('click', handlers[i]))
    })
    this.instances = []
    this.isInitialized = false
  }

  onTrigger(root, triggers, trigger, multiple) {
    const isExpanded = trigger.getAttribute(ATTRIBUTES.ariaExpanded) === 'true'

    if (!multiple && !isExpanded) {
      triggers.forEach(t => {
        if (t !== trigger) this.setExpanded(root, t, false)
      })
    }

    this.setExpanded(root, trigger, !isExpanded)
  }

  setExpanded(root, trigger, expand) {
    const panelId = trigger.getAttribute(ATTRIBUTES.ariaControls)
    const panel = panelId ? root.querySelector(`#${panelId}`) : null

    trigger.setAttribute(ATTRIBUTES.ariaExpanded, String(expand))

    if (panel) {
      if (expand) {
        panel.removeAttribute('hidden')
      } else {
        panel.setAttribute('hidden', '')
      }
    }
  }
}
