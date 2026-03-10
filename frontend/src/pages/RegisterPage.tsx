import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

export function RegisterPage() {
  const { refreshMe } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const resp = await axios.post<{ token: string }>('/api/auth/register/', {
        username: username.trim(),
        password,
      })
      localStorage.setItem('rumli_token', resp.data.token)
      axios.defaults.headers.common.Authorization = `Token ${resp.data.token}`
      await refreshMe()
      window.location.href = '/rooms'
    } catch (err: any) {
      const data = err?.response?.data
      const msg = data?.username ?? data?.password ?? data?.detail ?? 'Registration failed'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
              Rejestracja
            </Typography>
            <Typography color="text.secondary">Utwórz konto, aby rezerwować sale.</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Login"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
                <TextField
                  label="Hasło (min. 8 znaków)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  type="password"
                  required
                />
                <Button type="submit" variant="contained" size="large" disabled={busy}>
                  {busy ? 'Tworzenie…' : 'Utwórz konto'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

