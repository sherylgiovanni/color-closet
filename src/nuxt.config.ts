require('dotenv').config()
const API_SERVER = (process.env.NUXT_ENV_API_SERVER || 'https://api-sandbox.byu.edu').replace(/\/+$/, '') // strip trailing slash(es)

export default {
  ssr: false,

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: (pageTitle: string): string => (pageTitle ? `${pageTitle} - ` : '') + 'Color Closet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description ?? ''
      }
    ],
    script: [
      {
        src: 'https://cdn.byu.edu/byu-theme-components/2.x.x/byu-theme-components.min.js',
        async: ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://cdn.byu.edu/shared-icons/latest/favicons/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/byu-theme-components/2.x.x/byu-theme-components.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/theme-fonts/1.x.x/ringside/fonts.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/theme-fonts/1.x.x/public-sans/fonts.css'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#002E5D' },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: (`${API_SERVER}`).replace(/\/?$/, '/'), // ensure trailing slash // TODO: If most of your API endpoints start from a common base, then change it here, or add it after API_SERVER, like `${API_SERVER}/foo`
    https: true
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.sass'],
    defaultAssets: {
      font: {
        family: 'Roboto'
      },
      icons: 'mdi'
    },
    theme: {
      themes: {
        light: {
          primary: '#002E5D',
          secondary: '#666666',
          accent: '#0062B8',
          error: '#A3082A',
          info: '#006073',
          success: '#10A170',
          warning: '#FFB700'
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config: { devtool?: string }, { isDev, isClient }: { isDev: boolean, isClient: boolean }): void {
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  buildModules: [['@byu-oit/nuxt-common', {
    pluginOptions: {
      'implicit-grant': {
        baseUrl: API_SERVER
      }
    }
  }]],
  ignore: [
    '**/*.spec.*',
    './__mocks__/**'
  ]
}
