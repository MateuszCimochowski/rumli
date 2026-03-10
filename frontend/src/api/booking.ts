import axios from 'axios'
import type { Reservation, Room } from './types'

export async function listRooms() {
  const resp = await axios.get<Room[]>('/api/rooms/')
  return resp.data
}

export async function checkAvailability(startIso: string, endIso: string) {
  const resp = await axios.get<Room[]>('/api/rooms/availability/', { params: { start: startIso, end: endIso } })
  return resp.data
}

export async function createReservation(roomId: number, startIso: string, endIso: string) {
  const resp = await axios.post<Reservation>('/api/reservations/', {
    room: roomId,
    start_at: startIso,
    end_at: endIso,
  })
  return resp.data
}

export async function listMyReservations() {
  const resp = await axios.get<Reservation[]>('/api/reservations/mine/')
  return resp.data
}

export async function deleteReservation(id: number) {
  await axios.delete(`/api/reservations/${id}/`)
}

