import { createServer } from 'https'
import next from 'next'
import fs from 'fs'
import { parse } from 'url'

const app = next({ dev: process.env.NODE_ENV != 'production' })
const handler = app.getRequestHandler()

const httpsOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem')
}

app.prepare().then(() => {
    const port = process.env.PORT ?? 3000

    createServer(httpsOptions, async (req, res) => {
        const parsedUrl = parse(req.url ?? '', true)
        handler(req, res, parsedUrl)
    })
    .listen(port)
})