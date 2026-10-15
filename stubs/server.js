// The three services the job talks to, stubbed in one process so the job runs locally.
import { createServer } from "node:http"

const counters = { accounts: 0, subscriptions: 0, messages: 0 }
let failMailOnce = process.env.FAIL_MAIL_ONCE === "1"

function service(name, port, routes) {
  createServer((request, response) => {
    let raw = ""
    request.on("data", (chunk) => { raw += chunk })
    request.on("end", () => {
      const route = routes[`${request.method} ${request.url}`]
      if (!route) {
        response.writeHead(404, { "content-type": "application/json" })
        response.end(JSON.stringify({ error: "no such route" }))
        return
      }
      const body = raw ? JSON.parse(raw) : {}
      const [status, payload] = route(body)
      console.log(`${name} ${request.method} ${request.url} ${JSON.stringify(body)} -> ${status}`)
      response.writeHead(status, { "content-type": "application/json" })
      response.end(JSON.stringify(payload))
    })
  }).listen(port, () => console.log(`${name} listening on ${port}`))
}

service("directory", 4101, {
  "POST /accounts": ({ email, company }) => [201, { id: `acc_${++counters.accounts}`, email, company }],
})

service("billing", 4102, {
  "POST /subscriptions": ({ accountId, plan }) => [201, { id: `sub_${++counters.subscriptions}`, accountId, plan }],
})

service("mail", 4103, {
  "POST /welcome": ({ accountId, email }) => {
    if (failMailOnce) {
      failMailOnce = false
      return [503, { error: "mail service temporarily unavailable" }]
    }
    return [202, { id: `msg_${++counters.messages}`, accountId, email }]
  },
})
