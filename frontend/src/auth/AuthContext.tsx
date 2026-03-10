import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

type Me = { id: number; username: string; is_staff: boolean }

type AuthState = {
  token: string | null
  me: Me | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const TOKEN_KEY = 'rumli_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [me, setMe] = useState<Me | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Token ${token}`
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete axios.defaults.headers.common.Authorization
    }
  }, [token])

  const refreshMe = useCallback(async () => {
    if (!token) {
      setMe(null)
      return
    }
    const resp = await axios.get<Me>('/api/auth/me/')
    setMe(resp.data)
  }, [token])

  const login = useCallback(async (username: string, password: string) => {
    const resp = await axios.post<{ token: string }>('/api/auth/login/', { username, password })
    localStorage.setItem(TOKEN_KEY, resp.data.token)
    setToken(resp.data.token)
    await refreshMe()
  }, [refreshMe])

  const logout = useCallback(async () => {
    try {
      if (token) await axios.post('/api/auth/logout/')
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setMe(null)
    }
  }, [token])

  useEffect(() => {
    ;(async () => {
      try {
        await refreshMe()
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setMe(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [refreshMe])

  const value = useMemo<AuthState>(
    () => ({ token, me, isLoading, login, logout, refreshMe }),
    [token, me, isLoading, login, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

