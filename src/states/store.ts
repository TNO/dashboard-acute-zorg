import { createStore, action, Action, createTypedHooks } from 'easy-peasy'

import hospitals from '../assets/ziekenhuizen.json';
import sehFormEmpty from '../assets/seh_form_empty.json';
import roazregios from '../assets/roazregios.json';
import ziekenhuisCategories from '../assets/ziekenhuiscategories.json';
import { Hour, ActiveHours } from '../interfaces/hours';
import { RegioIndeling } from '../interfaces/regios';
import { ISEHForm } from '../interfaces/sehform';
import { IZiekenhuis, IBranchMembership } from '../interfaces/ziekenhuis';
import { OpenDichtDagPersoneleBezetting, PersoneleBezetting } from '../interfaces/personeel';
import { KeyboardCommandKeyRounded } from '@mui/icons-material';

const typedHooks = createTypedHooks<Model>()

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;


const initializeZiekenhuizen = (): IZiekenhuis[] => {

  const ziekenhuizen: IZiekenhuis[] = hospitals.features.map((z: any) => {

    const id = z.properties.id

    // load SEH data based on ziekenhuis id 
    const isSehFormEmpty = true
    const sehForm = (sehFormEmpty as any)["form"] as ISEHForm

    // load roazRegio based on ziekenhuis id
    const hasMatchingRoazRegio = (id in roazregios)
    let roazRegio = ['not found']
    if (hasMatchingRoazRegio) {
      roazRegio = (roazregios as any)[id] as string[]
    }
    else {
      console.error(`ziekenhuis ${id} has no matching roazregio from json file`)
    }

    // load ziekenhuis categories based on ziekenhuis id 
    let fulltimeSEH = false
    let dagofavondSEH = false
    let branchmembership: IBranchMembership = { saz: false, stz: false, nfu: false }
    let hasSazSEH = false

    if (!(id in ziekenhuisCategories)) {
      console.error(`${id} not in ziekenhuisCategories`)
    }
    else {
      fulltimeSEH = (ziekenhuisCategories as any)[id].fulltimeSEH
      dagofavondSEH = (ziekenhuisCategories as any)[id].dagofavondSEH

      branchmembership = {
        saz: (ziekenhuisCategories as any)[id].saz,
        stz: (ziekenhuisCategories as any)[id].stz,
        nfu: (ziekenhuisCategories as any)[id].nfu,
      }

      hasSazSEH = (ziekenhuisCategories as any)[id].saz && (
        (ziekenhuisCategories as any)[id].fulltimeSEH ||
        (ziekenhuisCategories as any)[id].dagofavondSEH
      )
    }

    const defaultOpenDichtDagPersoneleBezetting: OpenDichtDagPersoneleBezetting = {
      open: {
        dag: {
          SEHartsen: 0,
          anios: 0,
          verpleegkundigen: 0,
        },
        avond: {
          SEHartsen: 0,
          anios: 0,
          verpleegkundigen: 0,
        },
        nacht: {
          SEHartsen: 1,
          anios: 0,
          verpleegkundigen: 2,
        },
      },
      dicht: {
        dag: {
          SEHartsen: 0,
          anios: 0,
          verpleegkundigen: 0,
        },
        avond: {
          SEHartsen: 0,
          anios: 0,
          verpleegkundigen: 0,
        },
        nacht: {
          SEHartsen: 1,
          anios: 0,
          verpleegkundigen: 1,
        },
      },
    }

    let openDefault: Hour = 0
    let closeDefault: Hour = 24

    return {
      id: z.properties.id,
      latlon: [z.geometry.coordinates[1], z.geometry.coordinates[0]],
      locatie: z.properties.locatie,
      organisatie: z.properties.organisatie,
      plaats: z.properties.plaats,
      adres: z.properties.adres,
      postcode: z.properties.pc,

      roazRegio: roazRegio,
      hasSazSEH: hasSazSEH,
      seh: {
        sehForm: sehForm,
        isSehFormEmpty: isSehFormEmpty,
        fulltimeSEH: fulltimeSEH,
        dagofavondSEH: dagofavondSEH,
        defaultActiveHours: { open: openDefault, close: closeDefault },
        currentActiveHours: { open: openDefault, close: closeDefault },
        openDichtDagPersoneleBezetting: defaultOpenDichtDagPersoneleBezetting,
      },

      branchmembership: branchmembership,
    }
  })

  return ziekenhuizen
}

export interface Model {
  ziekenhuizen: IZiekenhuis[]
  resetZiekenhuizen: Action<Model>
  selectedZiekenhuisId: number | undefined 
  setSelectedZiekenhuisId: Action<Model, number | undefined>
  setZiekenhuisActiveOpenHour: Action<Model, { ziekenhuis: IZiekenhuis, open: Hour }>
  setZiekenhuisActiveCloseHour: Action<Model, { ziekenhuis: IZiekenhuis, close: Hour }>
  closingWindow: number
  setClosingWindow: Action<Model, number>
  currentYear: 2018 | 2019
  setCurrentYear: Action<Model, 2018 | 2019>
  transportCostPerPerson: number
  setTransportCostPerPerson: Action<Model, number>
  beladenKilometers: number
  setBeladenKilometers: Action<Model, number>
  klinischOpvangPercentage: number
  setKlinischOpvangPercentage: Action<Model, number>
  regioIndeling: RegioIndeling
  setRegioIndeling: Action<Model, RegioIndeling>
  setZiekenhuisOpenDichtDagPersoneleBezetting: Action<Model, { ziekenhuis: IZiekenhuis, openDichtDagPersoneleBezetting: OpenDichtDagPersoneleBezetting }>
  loadSEHForm: Action<Model, { ziekenhuisId: number, sehForm: ISEHForm }>
}

export default createStore<Model>({
  ziekenhuizen: initializeZiekenhuizen(),
  resetZiekenhuizen: action( (state) => {state.ziekenhuizen = initializeZiekenhuizen() }),
  selectedZiekenhuisId: undefined,
  setSelectedZiekenhuisId: action((state, ziekenhuisId) => { state.selectedZiekenhuisId = ziekenhuisId }),
  setZiekenhuisActiveCloseHour: action((state, { ziekenhuis, close }) => {
    ziekenhuis.seh.currentActiveHours.close = close
    state.ziekenhuizen = [...state.ziekenhuizen.filter(zkh => zkh.id !== ziekenhuis.id), ziekenhuis]
  }),
  setZiekenhuisActiveOpenHour: action((state, { ziekenhuis, open }) => {
    ziekenhuis.seh.currentActiveHours.open = open
    state.ziekenhuizen = [...state.ziekenhuizen.filter(zkh => zkh.id !== ziekenhuis.id), ziekenhuis]
  }),

  closingWindow: 3,
  setClosingWindow: action((state, closingWindow) => { state.closingWindow = closingWindow }),
  
  currentYear: 2018,
  setCurrentYear: action((state, year) => { state.currentYear = year }),
  
  transportCostPerPerson: 348,
  setTransportCostPerPerson: action((state, cost) => { state.transportCostPerPerson = cost }),
  
  beladenKilometers: 25,
  setBeladenKilometers: action((state, value) => { state.beladenKilometers = value }),
  klinischOpvangPercentage: 100,
  setKlinischOpvangPercentage: action((state, value) => { state.klinischOpvangPercentage = value }),
  regioIndeling: 'roaz',
  setRegioIndeling: action((state, regioIndeling) => { state.regioIndeling = regioIndeling }),
  setZiekenhuisOpenDichtDagPersoneleBezetting: action((state, { ziekenhuis, openDichtDagPersoneleBezetting }) => {
    ziekenhuis.seh.openDichtDagPersoneleBezetting = openDichtDagPersoneleBezetting
    state.ziekenhuizen = [...state.ziekenhuizen.filter(zkh => zkh.id !== ziekenhuis.id), ziekenhuis]
  }),
  loadSEHForm: action((state, { ziekenhuisId, sehForm }) => {
    const ziekenhuis = state.ziekenhuizen.find(ziekenhuis => ziekenhuis.id === ziekenhuisId)
    if (!ziekenhuis) {
      return
    }
    ziekenhuis.seh.sehForm = sehForm
    ziekenhuis.seh.isSehFormEmpty = false
    state.ziekenhuizen = [...state.ziekenhuizen.filter(zkh => zkh.id !== ziekenhuis.id), ziekenhuis]
  })
})