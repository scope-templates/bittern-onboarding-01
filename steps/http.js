export async function post(service, base, path, body) {
  const response = await fetch(new URL(path, base), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`${service} ${path} answered ${response.status}`)
  }
  return response.json()
}
