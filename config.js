import { env } from '#gulp/utils/env.js'

export default {
  site: {
    siteUrl: process.env.SITE_URL || 'https://mangust5580.github.io',
    basePath: process.env.SITE_BASE_PATH || '/Archblue',
    name: 'Archblue',
    shortName: 'Archblue',
  },

  engines: {
    templates: 'pug',
    styles: 'scss',
    scripts: 'esbuild',
  },

  features: {
    i18n: {
      enabled: false,
    },
    svgSprite: {
      enabled: true,
    },
    media: {
      audio: {
        enabled: false,
      },
      video: {
        enabled: false,
      },
    },
  },

  images: {
    dev: {
      formats: { webp: false, avif: false },
    },
    prod: {
      formats: { webp: true, avif: true },
    },
  },

  templates: {
    data: {
      globals: env.isDev
        ? 'src/shared/data/global.dev.json'
        : 'src/shared/data/global.json',
    },
  },

  paths: {
    assets: {
      static: ['src/static/**/*', 'src/static/.nojekyll'],
    },
  },
}
