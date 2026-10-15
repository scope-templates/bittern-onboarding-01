import { post } from "./http.js"

const base = process.env.BILLING_URL ?? "http://localhost:4102"

export function openSubscription(accountId, plan) {
  return post("billing", base, "/subscriptions", { accountId, plan })
}
