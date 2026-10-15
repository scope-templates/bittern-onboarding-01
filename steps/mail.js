import { post } from "./http.js"

const base = process.env.MAIL_URL ?? "http://localhost:4103"

export function sendWelcome(accountId, email) {
  return post("mail", base, "/welcome", { accountId, email })
}
