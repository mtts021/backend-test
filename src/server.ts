import { App } from './app'

const app = new App()

app.server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.server.log.error(err)
    process.exit(1)
  }

  console.log(address)
})
