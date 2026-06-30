import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipe from 'photoswipe'
import { SELECTORS } from '../config/selectors.js'

export default class ProjectGallery {
  constructor(root = document) {
    this.root = root
    this.instances = []
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return

    this.root.querySelectorAll(SELECTORS.projectGallery.root).forEach(el => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: el,
        children: SELECTORS.projectGallery.item,
        pswpModule: PhotoSwipe,
      })
      lightbox.init()
      this.instances.push(lightbox)
    })

    this.isInitialized = true
  }

  destroy() {
    this.instances.forEach(lb => lb.destroy())
    this.instances = []
    this.isInitialized = false
  }
}
