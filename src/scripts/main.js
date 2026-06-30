import Header from './modules/header.js'
import Select from './modules/select.js'
import Accordion from './modules/accordion.js'
import Alert from './modules/alert.js'
import Modal from './modules/modal.js'
import Reveal from './modules/reveal.js'
import ProjectGallery from './modules/project-gallery.js'
import ProjectPlansSlider from './modules/project-plans-slider.js'
import ProjectFormFlow from './modules/project-form-flow.js'
import InputMask from './modules/input-mask.js'
import FormValidation from './modules/form-validation.js'
import CharacterCounter from './modules/character-counter.js'
import FormSuccess from './modules/form-success.js'
import ArticlesCatalog from './modules/articles-catalog.js'
import ProjectsCatalog from './modules/projects-catalog.js'
import { SELECTORS } from './config/selectors.js'

class App {
  constructor(root = document) {
    this.root = root
    const modal = new Modal(this.root)
    this.modules = [
      new Header(this.root),
      new Select(this.root),
      new Accordion(this.root),
      new Alert(this.root),
      modal,
      new Reveal(this.root, {
        rootSelector: SELECTORS.reviewsReveal.root,
        itemSelector: SELECTORS.reviewsReveal.item,
        triggerSelector: SELECTORS.reviewsReveal.more,
      }),
      new Reveal(this.root, {
        rootSelector: SELECTORS.documentsReveal.root,
        itemSelector: SELECTORS.documentsReveal.item,
        triggerSelector: SELECTORS.documentsReveal.more,
        triggerButtonSelector: 'button',
      }),
      new ProjectGallery(this.root),
      new ProjectPlansSlider(this.root),
      new ProjectFormFlow(this.root, modal),
      new InputMask(this.root),
      new FormValidation(this.root),
      new CharacterCounter(this.root),
      new FormSuccess(this.root),
      new ArticlesCatalog(this.root),
      new ProjectsCatalog(this.root),
    ]
  }

  init() {
    this.modules.forEach(m => m.init())
  }

  destroy() {
    this.modules.forEach(m => m.destroy())
  }
}

const app = new App(document)

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init(), { once: true })
} else {
  app.init()
}

window.addEventListener('pagehide', () => app.destroy())
window.addEventListener('pageshow', (event) => {
  if (event.persisted) app.init()
})
