import { SELECTORS } from '../config/selectors.js'
import { EVENTS } from '../config/constants.js'

export default class ProjectFormFlow {
  constructor(root = document, modal) {
    this.root = root
    this.modal = modal
    this.isInitialized = false
    this._onFormValid = this._onFormValid.bind(this)
  }

  init() {
    if (this.isInitialized) return
    const form = this.root.querySelector(SELECTORS.projectFormFlow.form)
    if (form) form.addEventListener(EVENTS.formValid, this._onFormValid)
    this.isInitialized = true
  }

  destroy() {
    const form = this.root.querySelector(SELECTORS.projectFormFlow.form)
    if (form) form.removeEventListener(EVENTS.formValid, this._onFormValid)
    this.isInitialized = false
  }

  _onFormValid() {
    this.modal.close('project-modal')
    this.modal.open('thank-you-modal')
  }
}
