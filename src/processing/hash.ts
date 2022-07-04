import { Action } from "easy-peasy"
import { Hour } from "../interfaces/hours"
import { OpenDichtDagPersoneleBezetting, PersoneleBezetting } from "../interfaces/personeel"
import { IZiekenhuis } from "../interfaces/ziekenhuis"

export const getHashFromUrl = () => {
  const url = window.location.href
  if (url.split('?').length === 1)
    return ''
  const hash = url.split('?')[1]
  return hash
}

export const loadFromHash = (
  hash: string, 
  ziekenhuizen: IZiekenhuis[],
  setZiekenhuisActiveOpenHour: (obj: {ziekenhuis: IZiekenhuis, open: Hour}) => void,
  setZiekenhuisActiveCloseHour: (obj: {ziekenhuis: IZiekenhuis, close: Hour}) => void,
  setZiekenhuisOpenDichtDagPersoneleBezetting: (obj: {ziekenhuis: IZiekenhuis,
    openDichtDagPersoneleBezetting: OpenDichtDagPersoneleBezetting}) => void,
) => {
  if(hash === '') {
    return 
  }
  
  const ziekenhuisHashes = hash.split('#')
  ziekenhuisHashes.forEach(ziekenhuisHash => {
    
    const [id, open, close, ...openDichtDagPersoneleBezettingArray] = ziekenhuisHash.split('-')

    const penDichtDagPersoneleBezetting: OpenDichtDagPersoneleBezetting = {
      open: {
        dag: {
          SEHartsen: parseInt(openDichtDagPersoneleBezettingArray[0]),
          anios: parseInt(openDichtDagPersoneleBezettingArray[1]),
          verpleegkundigen: parseInt(openDichtDagPersoneleBezettingArray[2]),
        },
        avond: {
          SEHartsen: parseInt(openDichtDagPersoneleBezettingArray[3]),
          anios: parseInt(openDichtDagPersoneleBezettingArray[4]),
          verpleegkundigen: parseInt(openDichtDagPersoneleBezettingArray[5]),
        },
        nacht: {
          SEHartsen: parseInt(openDichtDagPersoneleBezettingArray[6]),
          anios: parseInt(openDichtDagPersoneleBezettingArray[7]),
          verpleegkundigen: parseInt(openDichtDagPersoneleBezettingArray[8]),
        },
      },
      dicht: {
        dag: {
          SEHartsen: parseInt(openDichtDagPersoneleBezettingArray[9]),
          anios: parseInt(openDichtDagPersoneleBezettingArray[10]),
          verpleegkundigen: parseInt(openDichtDagPersoneleBezettingArray[11]),
        },
        avond: {
          SEHartsen: parseInt(openDichtDagPersoneleBezettingArray[12]),
          anios: parseInt(openDichtDagPersoneleBezettingArray[13]),
          verpleegkundigen: parseInt(openDichtDagPersoneleBezettingArray[14]),
        },
        nacht: {
          SEHartsen: parseInt(openDichtDagPersoneleBezettingArray[15]),
          anios: parseInt(openDichtDagPersoneleBezettingArray[16]),
          verpleegkundigen: parseInt(openDichtDagPersoneleBezettingArray[17]),
        },
      },
    }
    
    let ziekenhuisToUpdate = ziekenhuizen.find(ziekenhuis => ziekenhuis.id === Number(id))
    if (ziekenhuisToUpdate) {
      setZiekenhuisActiveOpenHour({ ziekenhuis: ziekenhuisToUpdate, open: Number(open) as Hour })
      setZiekenhuisActiveCloseHour({ ziekenhuis: ziekenhuisToUpdate, close: Number(close) as Hour })
      setZiekenhuisOpenDichtDagPersoneleBezetting({
        ziekenhuis: ziekenhuisToUpdate,
        openDichtDagPersoneleBezetting: penDichtDagPersoneleBezetting,
      })
    }
  })
}

export const setHash = (ziekenhuizen: IZiekenhuis[]) => {
  const sortedZiekenhuizen = ziekenhuizen.sort((a, b) => a.id - b.id);
  const changedZiekenhuizen = sortedZiekenhuizen // sortedZiekenhuizen.filter(ziekenhuis => (ziekenhuis.seh.currentActiveHours.open != ziekenhuis.seh.defaultActiveHours.open) || (ziekenhuis.seh.currentActiveHours.close != ziekenhuis.seh.defaultActiveHours.close))
  const hash = changedZiekenhuizen.map(ziekenhuis => 
    [
      ziekenhuis.id,
      ziekenhuis.seh.currentActiveHours.open,
      ziekenhuis.seh.currentActiveHours.close,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.dag.SEHartsen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.dag.anios,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.dag.verpleegkundigen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.avond.SEHartsen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.avond.anios,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.avond.verpleegkundigen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.nacht.SEHartsen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.nacht.anios,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.open.nacht.verpleegkundigen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.dag.SEHartsen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.dag.anios,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.dag.verpleegkundigen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.avond.SEHartsen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.avond.anios,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.avond.verpleegkundigen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.nacht.SEHartsen,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.nacht.anios,
      ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.nacht.verpleegkundigen,
    ].join('-')
  ).join('#')
  window.history.pushState("", "", "?" + hash)
}