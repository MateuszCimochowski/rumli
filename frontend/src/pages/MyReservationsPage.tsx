import { Delete, Event } from '@mui/icons-material'
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
import { deleteReservation, listMyReservations } from '../api/booking'
import type { Reservation } from '../api/types'

function fmt(iso: string) {
  return format(new Date(iso), 'yyyy-MM-dd HH:mm')
}

export function MyReservationsPage() {
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
      setError(err?.response?.data?.detail ?? 'Nie udało się usunąć rezerwacji')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5" fontWeight={800} sx={{ flex: 1 }}>
              Moje rezerwacje
            </Typography>
            <Button onClick={refresh} variant="outlined" disabled={busy}>
              Odśwież
            </Button>
          </Stack>

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
                    <IconButton aria-label="delete" onClick={() => onDelete(r.id)} disabled={busy}>
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

