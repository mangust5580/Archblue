import Swiper from 'swiper'
import { Navigation, A11y, Keyboard } from 'swiper/modules'
import { SELECTORS } from '../config/selectors.js'

export default class ProjectPlansSlider {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.projectPlans.root).forEach(el => {
      const swiper = new Swiper(el, {
        modules: [Navigation, A11y, Keyboard],
        slidesPerView: 1.1,
        spaceBetween: 16,
        navigation: {
          prevEl: SELECTORS.projectPlans.prev,
          nextEl: SELECTORS.projectPlans.next,
          disabledClass: 'project-single-plans__nav-btn--disabled',
        },
        keyboard: {
          enabled: true,
        },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        },
      })

      this.instances.push(swiper)
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(s => s.destroy())
    this.instances = []
    this.isInitialized = false
  }
}
