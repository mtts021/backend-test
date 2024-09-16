import { App } from './app'
import { makeConnection } from './external/database'

const app = new App()

makeConnection()
  .then(() => {
    app.server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        app.server.log.error(err)
        process.exit(1)
      }

      console.log(address)
    })
  })
  .catch((err) => console.log(err))
