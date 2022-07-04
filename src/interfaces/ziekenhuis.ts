import { ISEH } from "./seh"


export interface IZiekenhuis {
  id: number
  latlon: [number, number]
  locatie: string
  organisatie: string
  plaats: string
  adres: string
  postcode: string
  seh: ISEH
  hasSazSEH: boolean
  roazRegio: string[]
  branchmembership: IBranchMembership
}

export interface IBranchMembership {
  saz: boolean
  stz: boolean
  nfu: boolean
}