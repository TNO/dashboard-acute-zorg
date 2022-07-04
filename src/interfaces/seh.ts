import { ActiveHours } from "./hours"
import { OpenDichtDagPersoneleBezetting, PersoneleBezetting } from "./personeel"
import { ISEHForm } from "./sehform"

export interface ISEH {
  fulltimeSEH: boolean
  dagofavondSEH: boolean
  defaultActiveHours: ActiveHours
  currentActiveHours: ActiveHours
  openDichtDagPersoneleBezetting: OpenDichtDagPersoneleBezetting
  sehForm: ISEHForm
  isSehFormEmpty: boolean
}



