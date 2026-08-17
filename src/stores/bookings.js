import { defineStore } from 'pinia'
import { ref } from 'vue'
import { downloadCsv, downloadPdf } from '../utils/exporters'

const seedBookings = [
  [1, 1, 'Community Free Clinic — August Session', '2026-08-20', '09:00 – 12:00', 'Chen Xue', 'user@test.com', '0412345678', 'confirmed'],
  [2, 2, 'Happy Knocking — In-Home Wellness Visit', '2026-08-24', '10:00 – 11:00', 'Margaret Lee', 'margaret@example.com', '0412345601', 'confirmed'],
  [3, 3, 'Cardio-Cerebral Health Workshop', '2026-08-25', '10:00 – 11:30', 'Peter Chan', 'peter@example.com', '0412345602', 'confirmed'],
  [4, 4, 'Joyful Age Companionship — Volunteer Shift', '2026-08-28', '13:00 – 16:00', 'Samir Patel', 'samir@example.com', '0412345603', 'confirmed'],
  [5, 1, 'Community Free Clinic — August Session', '2026-08-20', '09:00 – 12:00', 'June Taylor', 'june@example.com', '0412345604', 'confirmed'],
  [6, 2, 'Happy Knocking — In-Home Wellness Visit', '2026-08-31', '10:00 – 11:00', 'Helen Wu', 'helen@example.com', '0412345605', 'cancelled'],
  [7, 3, 'Cardio-Cerebral Health Workshop', '2026-08-25', '10:00 – 11:30', 'George Brown', 'george@example.com', '0412345606', 'confirmed'],
  [8, 4, 'Joyful Age Companionship — Volunteer Shift', '2026-08-28', '13:00 – 16:00', 'Nora Lim', 'nora@example.com', '0412345607', 'confirmed'],
  [9, 1, 'Community Free Clinic — August Session', '2026-08-27', '14:00 – 17:00', 'David Kim', 'david@example.com', '0412345608', 'confirmed'],
  [10, 2, 'Happy Knocking — In-Home Wellness Visit', '2026-08-24', '10:00 – 11:00', 'Grace Young', 'grace@example.com', '0412345609', 'confirmed'],
  [11, 3, 'Cardio-Cerebral Health Workshop', '2026-08-25', '10:00 – 11:30', 'Amy Wong', 'volunteer@test.com', '0412345610', 'confirmed'],
  [12, 1, 'Community Free Clinic — August Session', '2026-08-27', '14:00 – 17:00', 'Lin Hao', 'admin@test.com', '0412345611', 'cancelled'],
  [13, 4, 'Joyful Age Companionship — Volunteer Shift', '2026-08-28', '13:00 – 16:00', 'Chen Xue', 'user@test.com', '0412345678', 'confirmed']
].map(([id, programmeId, programmeName, sessionDate, sessionTime, userName, userEmail, phone, status]) => ({
  id, programmeId, programmeName, sessionDate, sessionTime, userName, userEmail, phone, status
}))

const exportColumns = [
  { label: 'ID', value: (b) => b.id },
  { label: 'Programme', value: (b) => b.programmeName },
  { label: 'Date', value: (b) => b.sessionDate },
  { label: 'Time', value: (b) => b.sessionTime },
  { label: 'Name', value: (b) => b.userName },
  { label: 'Email', value: (b) => b.userEmail },
  { label: 'Phone', value: (b) => b.phone },
  { label: 'Status', value: (b) => b.status }
]

export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref([...seedBookings])

  function confirmedCount(programmeId, date, time) {
    return bookings.value.filter((b) =>
      b.programmeId === programmeId && b.sessionDate === date && b.sessionTime === time && b.status === 'confirmed'
    ).length
  }

  function remainingCapacity(programmeId, session) {
    return Math.max(0, session.capacity - confirmedCount(programmeId, session.date, session.time))
  }

  function hasDuplicateBooking(email, programmeId, date, time) {
    return bookings.value.some((b) =>
      b.userEmail.toLowerCase() === email.toLowerCase() &&
      b.programmeId === programmeId && b.sessionDate === date && b.sessionTime === time && b.status === 'confirmed'
    )
  }

  function hasScheduleConflict(email, date, time) {
    return bookings.value.some((b) =>
      b.userEmail.toLowerCase() === email.toLowerCase() && b.sessionDate === date && b.sessionTime === time && b.status === 'confirmed'
    )
  }

  function addBooking(booking, capacity) {
    if (hasDuplicateBooking(booking.userEmail, booking.programmeId, booking.sessionDate, booking.sessionTime)) {
      return { ok: false, message: 'You already have a confirmed booking for this session.' }
    }
    if (hasScheduleConflict(booking.userEmail, booking.sessionDate, booking.sessionTime)) {
      return { ok: false, message: 'This time conflicts with another confirmed booking on your account.' }
    }
    if (confirmedCount(booking.programmeId, booking.sessionDate, booking.sessionTime) >= capacity) {
      return { ok: false, message: 'This session has just become full. Please choose another session.' }
    }
    bookings.value.push({ id: Math.max(0, ...bookings.value.map((b) => b.id)) + 1, status: 'confirmed', ...booking })
    return { ok: true }
  }

  function updateStatus(id, status) {
    const booking = bookings.value.find((x) => x.id === id)
    if (booking) booking.status = status
  }

  function bookingsForUser(email) {
    return bookings.value.filter((b) => b.userEmail === email)
  }

  function exportCsv() { downloadCsv('bookings.csv', exportColumns, bookings.value) }
  function exportPdf() { downloadPdf('bookings.pdf', 'Silver Age - Booking Report', exportColumns, bookings.value) }

  return {
    bookings, addBooking, updateStatus, bookingsForUser, confirmedCount, remainingCapacity,
    hasDuplicateBooking, hasScheduleConflict, exportCsv, exportPdf
  }
})
