import path from 'path'
import next from 'next'
import express from 'express'
import favicon from 'serve-favicon'
import bodyParser from 'body-parser'
import i18nextMiddleware from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'
import errorHandler from './middleware/errorHandler'
import createOAuthRoutes from './routes/oauth'
import createMemberRoutes from './routes/member'
import createPagesRoutes from './routes/pages'
import i18nConfig from './i18n.config'
import i18n from './i18n'
import querystringLookup1 from './querystringLookup1'

const port = process.env.PORT || 4000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// const lngDetector = new i18nextMiddleware.LanguageDetector()
// lngDetector.addDetector(querystringLookup1)

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  // .use(lngDetector)
  .init(
    {
      ...i18nConfig,
      backend: {
        loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json')
      }
    },
    () => {
      app.prepare().then(() => {
        const server = express()

        server.use(bodyParser.urlencoded({ extended: true }))
        server.use(bodyParser.json())
        server.use(i18nextMiddleware.handle(i18n))
        server.use('/locales', express.static(path.join(__dirname, '/locales')))

        // add favicon
        server.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))

        // API
        // server.use('/oauth', createOAuthRoutes(app, server));
        // server.use('/member', createMemberRoutes(app, server));

        // handle API error
        // server.use(errorHandler);

        // aws health check
        server.use('/health', (req, res) => res.send('success'))

        // pages
        server.use('/', createPagesRoutes(app, server))
        server.get('*', (req, res) => {
          // console.log(res.header, req.language)
          handle(req, res)
        })

        server.listen(port)
        console.log('Server is starting!')
      })
    }
  )
