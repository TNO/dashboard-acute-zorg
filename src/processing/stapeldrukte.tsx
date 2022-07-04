import { ISEH } from "../interfaces/seh"
import { IZiekenhuis } from "../interfaces/ziekenhuis"
import { Stapeldrukte } from "../interfaces/sehform"
import { hours, ActiveHours, isWithinActiveHours, isActive247, isNotActiveAtAll } from "../interfaces/hours"
import { sumObjects } from "./calculations"

type Year = 2018 | 2019
type AggType = 'gem' | 'max'
type StapeldrukteModificationFunction = (
  stapeldrukte: Stapeldrukte, 
  activeHours: ActiveHours,
  closingWindow: number) => Stapeldrukte

const mod = (n: number, m: number) => (n % m + m) % m
const sum = (values: number[]) => values.reduce( (a, b) => a + b)

export const modifyStapelDrukte: StapeldrukteModificationFunction = (
  stapeldrukte: Stapeldrukte,
  activeHours: ActiveHours,
  closingWindow: number, 
) => {

  if (isActive247(activeHours)) {
    return stapeldrukte
  }
  if (isNotActiveAtAll(activeHours)) {
    return stapeldrukte.map(({ hour, value }) => ({hour: hour, value: 0}))
  }

  const closingHour = activeHours.close 
  const patientStopHour = mod(closingHour - closingWindow, 24)
  const valueAtPatientStopHour = stapeldrukte.find(({hour, value}) => hour === patientStopHour)!.value

  return stapeldrukte.map(({ hour, value }) => {
    
    let newValue = value

    let hoursFromClosing = activeHours.close - hour 
    if (hour > activeHours.close) {
      hoursFromClosing = (24 - hour) + activeHours.close 
    }

    if(!isWithinActiveHours(hour, activeHours)) {
      newValue = 0
    }
    else if (hoursFromClosing < closingWindow) {
      newValue = valueAtPatientStopHour * (hoursFromClosing) / closingWindow
    }
    
    return {
      hour: hour,
      value: newValue 
    }
  })
}

export const subtractStapelDruktes = (stapeldrukteA: Stapeldrukte, stapeldrukteB: Stapeldrukte) => (
  stapeldrukteA.map( (_, index) => (
    {
      hour: stapeldrukteA[index].hour,
      value: stapeldrukteA[index].value - stapeldrukteB[index].value
    }
  ))
)

export const calculateFractionBetweenStapelDruktes = (stapeldrukteA: Stapeldrukte, stapeldrukteB: Stapeldrukte) => (
  sum( stapeldrukteA.map( s => s.value ) ) / sum( stapeldrukteB.map( s => s.value ) )
) 

const sumStapeldruktes = (stapeldruktes: Stapeldrukte[]): Stapeldrukte => {
  return stapeldruktes.reduce((stapeldrukte1, stapeldrukte2) => {
    return stapeldrukte1.map(({ hour, value }, index) => {
      const sum = stapeldrukte2[index].value + value
      return { hour: hour, value: sum }
    })
  })
}

export const calculateWeeklyStapeldrukteSum = (
  ziekenhuizen: IZiekenhuis[],
  year: Year,
  aggType: AggType,
  modificationFunction?: StapeldrukteModificationFunction,
  closingWindow?: number 
) => {

  const stapeldruktes = ziekenhuizen.map(zkh => {
    const stapelDrukte = zkh.seh.sehForm[year].stapeldruktePerDag.week[aggType]
    const activeHours = zkh.seh.currentActiveHours
    if(modificationFunction && closingWindow) {
      return modificationFunction(stapelDrukte, activeHours, closingWindow)
    }
    return stapelDrukte // do nothing
  })
  
  const stapeldrukteSum = sumStapeldruktes(stapeldruktes)
  return stapeldrukteSum
}

const calculateExtraFraction = (ziekenhuis: IZiekenhuis, year: 2018 | 2019, closingWindow: number): number => {
  const gemStapelDrukteSum = calculateWeeklyStapeldrukteSum([ziekenhuis], year, 'gem')
  const modifiedGemStapelDrukteSum = calculateWeeklyStapeldrukteSum([ziekenhuis], year, 'gem', modifyStapelDrukte, closingWindow)
  const extraFraction = 1 - calculateFractionBetweenStapelDruktes(modifiedGemStapelDrukteSum, gemStapelDrukteSum)
  return extraFraction
}

export type ExtraSEHDrukte = {
  extraSEHBezoeken: number 
  extraPoliklinisch: number
  extraKlinisch: number 
}

export const calculateExtraSEHDrukte = (ziekenhuis: IZiekenhuis, year: 2018 | 2019, closingWindow: number, klinischOpvangPercentage: number): ExtraSEHDrukte => {

  const extraFraction = calculateExtraFraction(ziekenhuis, year, closingWindow)

  const extraSEHBezoeken = Math.round(extraFraction * ziekenhuis.seh.sehForm[year].aantalSEHBezoeken)
  const extraKlinisch = Math.round(
    extraFraction 
    * ziekenhuis.seh.sehForm[year].aantalRegistratiesPerBestemmingNaAfloopSEHBezoek.vervolgKlinischEigenZiekenhuis
    * klinischOpvangPercentage/100
  )
  const extraPoliklinisch = Math.round(extraFraction * ziekenhuis.seh.sehForm[year].aantalRegistratiesPerBestemmingNaAfloopSEHBezoek.naarHuisVervolgPoliklinischEigenZiekenhuis)

  return {
    extraSEHBezoeken: extraSEHBezoeken || 0,
    extraKlinisch: extraKlinisch || 0,
    extraPoliklinisch: extraPoliklinisch || 0, 
  }
}

export const sumExtraSEHDruktes = (extraSEHDruktes: ExtraSEHDrukte[]) => (
  sumObjects(extraSEHDruktes) as ExtraSEHDrukte
)