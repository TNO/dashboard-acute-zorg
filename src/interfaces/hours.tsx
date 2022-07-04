export type Hour =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  | 20 | 21 | 22 | 23 | 24

export const hours: Hour[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 
13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

export type ActiveHours = {
  open: Hour
  close: Hour
}

export const isActive247 = ({open, close}: ActiveHours) => (open === 0 && close === 24)
export const isNotActiveNacht = ({open, close}: ActiveHours) => (open === 7 && close === 23)
export const isNotActiveAtAll = ({open, close}: ActiveHours) => (open === close)
export const areActiveHoursEqual = (activeHours1: ActiveHours, activeHours2: ActiveHours) => (
  (activeHours1.open === activeHours2.open) && (activeHours1.close === activeHours2.close)
)

export const isWithinActiveHours = (hour: Hour, {open, close}: ActiveHours) => {
  const betweenOpenClose = ((hour >= open) && (hour < close))
  const betweenCloseOpen = ((hour >= open) || (hour < close))
  return (open < close) ? betweenOpenClose : betweenCloseOpen
}

type HourOption = {
  value: Hour, 
  label: string
}

export const formatHour = (hour: Hour) => `${hour.toString().padStart(2, '0')}:00h`
export const formatActiveHours = ({open, close}: ActiveHours) => {
  return formatHour(open) + '-' + formatHour(close)
}
export const hourOptions: HourOption[] = hours.map( hour => ({value: hour, label: formatHour(hour)}) )