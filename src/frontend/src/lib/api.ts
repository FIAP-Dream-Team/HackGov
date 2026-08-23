const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${path}`)
  }
  return response.json() as Promise<T>
}
