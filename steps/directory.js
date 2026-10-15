import { post } from "./http.js"

const base = process.env.DIRECTORY_URL ?? "http://localhost:4101"

export function createAccount({ email, company }) {
  return post("directory", base, "/accounts", { email, company })
}
