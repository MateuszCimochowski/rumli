import { Alert, Box, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await login(username.trim(), password)
    } catch (err: any) {
      const msg = err?.response?.data?.non_field_errors?.[0] ?? err?.response?.data?.detail ?? 'Login failed'
      setError(String(msg))
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
              Rumli
            </Typography>
            <Typography color="text.secondary">Zaloguj się, aby rezerwować sale i biurka.</Typography>
            <Alert severity="info">
              Możesz też użyć konta demo: <b>demo</b> / <b>demo1234!</b>
            </Alert>
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
                  label="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  type="password"
                  required
                />
                <Button type="submit" variant="contained" size="large" disabled={busy}>
                  {busy ? 'Logowanie…' : 'Zaloguj'}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Nie masz konta?{' '}
                  <Link component={RouterLink} to="/register">
                    Zarejestruj się
                  </Link>
                  .
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

