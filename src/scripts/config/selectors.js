export const SELECTORS = {
  select: {
    root: '[data-js-select]',
    trigger: '[data-js-select-trigger]',
    value: '[data-js-select-value]',
    dropdown: '[data-js-select-dropdown]',
    option: '[data-js-select-option]',
    input: '[data-js-select-input]',
  },
  accordion: {
    root: '[data-js-accordion]',
    trigger: '[data-js-accordion-trigger]',
    panel: '[data-js-accordion-panel]',
  },
  alert: {
    root: '[data-js-alert]',
    close: '[data-js-alert-close]',
  },
  modal: {
    root: '[data-js-modal]',
    trigger: '[data-js-modal-trigger]',
    close: '[data-js-modal-close]',
    focusable: 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  },
  header: {
    root: '[data-js-header]',
    burger: '[data-js-header-burger]',
    menu: '[data-js-header-menu]',
    link: '[data-js-header-link]',
  },
  reviewsReveal: {
    root: '[data-js-reviews-reveal]',
    item: '[data-js-reviews-item]',
    more: '[data-js-reviews-more]',
  },
  projectGallery: {
    root: '[data-js-project-gallery]',
    item: '[data-js-project-gallery-item]',
  },
  projectPlans: {
    root: '[data-js-plans-slider]',
    prev: '[data-js-plans-prev]',
    next: '[data-js-plans-next]',
  },
  documentsReveal: {
    root: '[data-js-documents-reveal]',
    item: '[data-js-documents-item]',
    more: '[data-js-documents-more]',
  },
  projectFormFlow: {
    form: '#project-modal .project-modal__form',
  },
  inputMask: {
    phone: '[data-js-input-mask-phone]',
  },
  formValidation: {
    form: '[data-js-form-validation]',
    field: '[data-js-form-field]',
  },
  characterCounter: {
    textarea: '[data-js-character-counter-textarea]',
    output: '[data-js-character-counter-output]',
  },
  formSuccess: {
    message: '[data-js-form-success]',
  },
  articlesCatalog: {
    root: '[data-js-articles-catalog]',
    searchForm: '[data-js-articles-search-form]',
    searchInput: '[data-js-articles-search-input]',
    categoryBtn: '[data-js-articles-category-btn]',
    item: '[data-js-articles-item]',
    moreWrapper: '[data-js-articles-more-wrapper]',
    more: '[data-js-articles-more]',
    empty: '[data-js-articles-empty]',
  },
  projectsCatalog: {
    root: '[data-js-projects-catalog]',
    filter: '[data-js-projects-filter]',
    item: '[data-js-projects-item]',
    empty: '[data-js-projects-empty]',
  },
}
