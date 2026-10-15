import { readFile } from "node:fs/promises"

import { openSubscription } from "./steps/billing.js"
import { createAccount } from "./steps/directory.js"
import { sendWelcome } from "./steps/mail.js"

const pendingFile = process.env.PENDING_FILE ?? "data/pending.json"
const signups = JSON.parse(await readFile(pendingFile, "utf8"))
console.log(`onboarding ${signups.length} sign-up(s) from ${pendingFile}`)

for (const signup of signups) {
  const account = await createAccount(signup)
  console.log(`[${signup.email}] step 1 directory: account ${account.id}`)
  const subscription = await openSubscription(account.id, signup.plan)
  console.log(`[${signup.email}] step 2 billing: subscription ${subscription.id}`)
  const message = await sendWelcome(account.id, signup.email)
  console.log(`[${signup.email}] step 3 mail: message ${message.id}`)
}

console.log("done")
