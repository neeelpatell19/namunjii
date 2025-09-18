const BASE_URL = import.meta.env.VITE_BASE_URL || ''

export async function apiGet(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText} ${text}`)
  }
  return res.json()
}


