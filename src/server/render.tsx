import * as React from "react"
import ReactDOM from "react-dom/server"
import { Request, Response } from "express"
import createHistory from "history/createMemoryHistory"
import { flushChunkNames } from "react-universal-component/server"
import flushChunks from "webpack-flush-chunks"
import App from "../client/components/App"

export default ({ clientStats }) => (req: Request, res: Response) => {
  const history = createHistory({ initialEntries: [req.path] })
  const app = ReactDOM.renderToString(<App history={history} />)
  const chunkNames = flushChunkNames()

  const { js, styles, cssHash, scripts, stylesheets } = flushChunks(
    clientStats,
    { chunkNames }
  )

  console.log("PATH", req.path)
  console.log("DYNAMIC CHUNK NAMES RENDERED", chunkNames)
  console.log("SCRIPTS SERVED", scripts)
  console.log("STYLESHEETS SERVED", stylesheets)

  res.send(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>react-universal-component-boilerplate-typescript</title>
          ${styles}
        </head>
        <body>
          <div id="root">${app}</div>
          ${cssHash}
          ${js}
        </body>
      </html>`
  )
}
