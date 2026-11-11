import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, differenceInHours, differenceInMinutes, format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDaysSince(date: string | null): number {
  if (!date) return 0
  return differenceInDays(new Date(), new Date(date))
}

export function getCountdownTo(date: string | null): { days: number; hours: number; minutes: number } | null {
  if (!date) return null
  const target = new Date(date)
  const now = new Date()
  if (target <= now) return null
  const days = differenceInDays(target, now)
  const hours = differenceInHours(target, now) % 24
  const minutes = differenceInMinutes(target, now) % 60
  return { days, hours, minutes }
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatTime(date: string): string {
  return format(new Date(date), 'h:mm a')
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getCurrentTime(): string {
  return format(new Date(), 'h:mm')
}

export function getCurrentAmPm(): string {
  return format(new Date(), 'a')
}

export function getCurrentDate(): string {
  return format(new Date(), 'EEEE, MMMM d')
}
