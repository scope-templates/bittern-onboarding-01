# Bittern Onboarding

Bittern Onboarding, the job that sets up every new customer account. It reads the pending sign-ups and, for each one, calls three services in a row: the directory creates the account, billing opens the subscription, and mail sends the welcome message. The job stops at the first failure.

## Run locally

```sh
npm install
npm run stubs      # the three services, one process, ports 4101, 4102 and 4103
npm start          # runs the onboarding job once over data/pending.json
```

Start the stubs with `FAIL_MAIL_ONCE=1` to make the mail service answer 503 on its first welcome request. The job stops at that sign-up; run `npm start` again and the stub logs show a second account and a second subscription created for the same sign-up before the welcome message goes out.

## Steps

| Step | Service   | Request                                        | Result          |
| ---- | --------- | ---------------------------------------------- | --------------- |
| 1    | directory | `POST /accounts` with `email` and `company`    | account id      |
| 2    | billing   | `POST /subscriptions` with `accountId`, `plan` | subscription id |
| 3    | mail      | `POST /welcome` with `accountId` and `email`   | message id      |

Each sign-up runs the three steps in order. A failed step throws, the job exits non-zero, and nothing records which steps already ran, so a rerun starts every sign-up from step 1.

## Environment

| Variable        | Default                 | Purpose                    |
| --------------- | ----------------------- | -------------------------- |
| `DIRECTORY_URL` | `http://localhost:4101` | the directory service      |
| `BILLING_URL`   | `http://localhost:4102` | the billing service        |
| `MAIL_URL`      | `http://localhost:4103` | the mail service           |
| `PENDING_FILE`  | `data/pending.json`     | the sign-ups to onboard    |

`data/pending.json` is a list of objects with `email`, `company` and `plan`.
