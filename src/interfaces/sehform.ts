import { Hour } from "./hours"

export interface ISEHForm {
  '2018': ISEHFormData
  '2019': ISEHFormData
}

export type Stapeldrukte = { hour: Hour, value: number }[]

interface ISEHFormData {
  aantalKlinischeOpnamen: number
  aantalPolikliniekBezoeken: number
  aantalSEHBezoeken: number

  stapeldruktePerDag: {
    mon: { gem: Stapeldrukte, max: Stapeldrukte },
    tue: { gem: Stapeldrukte, max: Stapeldrukte },
    wed: { gem: Stapeldrukte, max: Stapeldrukte },
    thu: { gem: Stapeldrukte, max: Stapeldrukte },
    fri: { gem: Stapeldrukte, max: Stapeldrukte },
    sat: { gem: Stapeldrukte, max: Stapeldrukte },
    sun: { gem: Stapeldrukte, max: Stapeldrukte },
    week: { gem: Stapeldrukte, max: Stapeldrukte },
  }

  specialismeVerdeling: {
    // todo: make into { specialisme: string, value: number }[]
    chi: number,
    car: number,
    int: number,
    long: number,
    neu: number,
    ort: number,
    kin: number,
    mdl: number,
    uro: number,
    overig: number,
  }

  aantalCTVerrichtingen: number,
  aantalEchoVerrichtingen: number,
  aantalRöntgenVerrichtingen: number,
  aantalTrombolyseMeldingen: number,
  aantalLabAfnames: number,

  aantalBezoekenPerLeeftijdsgroepOpSEH: {
    "0Jarigen": number,
    "1TM10": number,
    "11TM17": number,
    "18TM74": number,
    "75EnOuder": number,
    "onbekend": number,
  }

  aantalRegistratiesPerBestemmingNaAfloopSEHBezoek: {
    vervolgKlinischEigenZiekenhuis: number,
    naarHuisVervolgPoliklinischEigenZiekenhuis: number,
  }

  doorlooptijdSEH: {
    gemiddeldeInMinuten: 0,
    mediaanInMinuten: 0,
  }
}
