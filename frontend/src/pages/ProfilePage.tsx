import { ArrowBack, Delete, Event, Person } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { deleteReservation, listMyReservations } from '../api/booking'
import type { Reservation } from '../api/types'
import { useAuth } from '../auth/AuthContext'

function fmt(iso: string) {
  return format(new Date(iso), 'yyyy-MM-dd HH:mm')
}

export function ProfilePage() {
  const { me } = useAuth()
  const [items, setItems] = useState<Reservation[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function refresh() {
    setError(null)
    setBusy(true)
    try {
      setItems(await listMyReservations())
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Nie udało się pobrać rezerwacji')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onDelete(id: number) {
    setError(null)
    setBusy(true)
    try {
      await deleteReservation(id)
      await refresh()
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Nie udało się cofnąć rezerwacji')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Person />
            <Stack>
              <Typography variant="h5" fontWeight={800}>
                Profil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zalogowany jako <strong>{me?.username}</strong>
              </Typography>
            </Stack>
          </Stack>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Twoje rezerwacje
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tutaj możesz przeglądać swoje rezerwacje i je cofać.
              </Typography>
              <Box mt={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                  <Button
                    component={RouterLink}
                    to="/rooms"
                    startIcon={<ArrowBack />}
                    variant="text"
                  >
                    Wróć do sal
                  </Button>
                  <Button onClick={refresh} variant="outlined" disabled={busy}>
                    Odśwież
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {error && <Alert severity="error">{error}</Alert>}

          {items && items.length === 0 && <Alert severity="info">Brak rezerwacji.</Alert>}

          {items &&
            items.map((r) => (
              <Card key={r.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Event fontSize="small" />
                    <Stack sx={{ flex: 1 }}>
                      <Typography fontWeight={800}>{r.room_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {fmt(r.start_at)} – {fmt(r.end_at)}
                      </Typography>
                    </Stack>
                    <IconButton
                      aria-label="cancel-reservation"
                      onClick={() => onDelete(r.id)}
                      disabled={busy}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Container>
    </Box>
  )
}

