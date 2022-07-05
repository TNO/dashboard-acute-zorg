import { useStoreActions, useStoreState } from '../states/store';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { IZiekenhuis } from './ziekenhuis';
import { ExtraSEHDrukte } from '../processing/stapeldrukte';
import { sumObjects } from '../processing/calculations';
import { areActiveHoursEqual, isNotActiveAtAll, isNotActiveNacht } from './hours';

export interface OpenDichtDagPersoneleBezetting {
  open: DagPersoneleBezetting
  dicht: DagPersoneleBezetting
}

export interface DagPersoneleBezetting {
  dag: PersoneleBezetting
  avond: PersoneleBezetting
  nacht: PersoneleBezetting
}

export interface PersoneleBezetting {
  SEHartsen: number
  anios: number
  verpleegkundigen: number
}

interface NumberSelectProps {
  value: number
  setValue: (value: number) => void
  selectableValues?: number[]
  disabled?: boolean
}
function NumberSelect(props: NumberSelectProps) {
  return (
    <FormControl
      disabled={props.disabled}
      sx={{ m: 0, minWidth: 0 }}
      size="small"
    >
      <Select
        // labelId="demo-simple-select-label"
        // id="demo-simple-select"
        value={props.value}
        onChange={(e) => props.setValue(e!.target.value as unknown as number)}
      >

        {props.selectableValues
          ? props.selectableValues.map(value => <MenuItem value={value}> {value} </MenuItem>)
          : <MenuItem value={props.value}> {props.value} </MenuItem>
        }
      </Select>
    </FormControl>
  )
}

interface PersoneleBezettingProps {
  includeDag?: boolean
  includeAvond?: boolean
  includeNacht?: boolean
}
export function PersoneleBezetting(
  { includeDag = true, includeAvond = true, includeNacht = true }: PersoneleBezettingProps
) {

  const ziekenhuizen = useStoreState(state => state.ziekenhuizen)
  const selectedZiekenhuis = useStoreState(state => state.selectedZiekenhuis)

  const openDichtDagPersoneleBezetting = selectedZiekenhuis!.seh.openDichtDagPersoneleBezetting
  const setZiekenhuisOpenDichtDagPersoneleBezetting = useStoreActions(action => action.setZiekenhuisOpenDichtDagPersoneleBezetting)
   
  let className = "grid grid-cols-3 items-center gap-2"
  if (includeDag && includeAvond) {
    className = "grid grid-cols-7 items-center gap-2"
  } 
  return (
    <div className={className}>
      <div className="italic"> personeel </div>
      {includeDag && <div className="italic"> dag open </div>}
      {includeDag && <div className="italic"> dag dicht </div>}
      {includeAvond && <div className="italic"> avond open </div>}
      {includeAvond && <div className="italic"> avond dicht </div>}
      {includeNacht && <div className="italic"> nacht open </div>}
      {includeNacht && <div className="italic"> nacht dicht </div>}

      <div> arts-SEH  </div>
      
      {includeDag && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.dag.SEHartsen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.dag.SEHartsen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeDag && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.dag.SEHartsen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.dag.SEHartsen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeAvond && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.avond.SEHartsen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.avond.SEHartsen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeAvond && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.avond.SEHartsen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.avond.SEHartsen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeNacht && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.nacht.SEHartsen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.nacht.SEHartsen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeNacht && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.nacht.SEHartsen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.nacht.SEHartsen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}

      <div> AIO/ANIOS </div>

      {includeDag && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.dag.anios}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.dag.anios = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeDag && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.dag.anios}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.dag.anios = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeAvond && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.avond.anios}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.avond.anios = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeAvond && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.avond.anios}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.avond.anios = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeNacht && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.nacht.anios}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.nacht.anios = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeNacht && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.nacht.anios}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.nacht.anios = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}

      <div> SEH vpk</div>


      {includeDag && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.dag.verpleegkundigen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.dag.verpleegkundigen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeDag && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.dag.verpleegkundigen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.dag.verpleegkundigen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeAvond && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.avond.verpleegkundigen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.avond.verpleegkundigen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeAvond && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.avond.verpleegkundigen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.avond.verpleegkundigen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeNacht && <NumberSelect
        value={openDichtDagPersoneleBezetting.open.nacht.verpleegkundigen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.open.nacht.verpleegkundigen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
      {includeNacht && <NumberSelect
        value={openDichtDagPersoneleBezetting.dicht.nacht.verpleegkundigen}
        setValue={(value: number) => {
          const newOpenDichtDagPersoneleBezetting = { ...openDichtDagPersoneleBezetting }
          newOpenDichtDagPersoneleBezetting.dicht.nacht.verpleegkundigen = value
          setZiekenhuisOpenDichtDagPersoneleBezetting({
            ziekenhuis: selectedZiekenhuis!,
            openDichtDagPersoneleBezetting: openDichtDagPersoneleBezetting
          })
        }
        }
        selectableValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      />}
    </div>
  )
}

const getFteSum = (personeleBezetting: PersoneleBezetting) => {
  return personeleBezetting.SEHartsen + personeleBezetting.anios + personeleBezetting.verpleegkundigen
}

export const calculateSavedFte = (ziekenhuis: IZiekenhuis) => {
  const changedActiveHours = ziekenhuis.seh.currentActiveHours.open !== ziekenhuis.seh.currentActiveHours.close
  if (!changedActiveHours) {
    return 0
  }

  const fteOpen = getFteSum(ziekenhuis.seh.openDichtDagPersoneleBezetting.open.nacht)
  const fteClosed = getFteSum(ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.nacht)
  const savedFte = fteOpen - fteClosed
  return 0 // savedFte
}

export const calculateSavedSalarisCosts = (ziekenhuis: IZiekenhuis) => {

  const notChangedActiveHours = areActiveHoursEqual(ziekenhuis.seh.currentActiveHours, ziekenhuis.seh.defaultActiveHours)
  if (notChangedActiveHours) {
    return 0
  }

  const notActiveNacht = isNotActiveNacht(ziekenhuis.seh.currentActiveHours)
  const notActiveAtAll = isNotActiveAtAll(ziekenhuis.seh.currentActiveHours)

  if (notActiveNacht) {
    const savedSalarisCosts = (
      + calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.open.nacht)
      - calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.nacht)
    )
    return savedSalarisCosts
  }
  if (notActiveAtAll) {
    const savedSalarisCosts = (
      + calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.open.dag)
      - calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.dag)
      + calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.open.avond)
      - calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.avond)
      + calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.open.nacht)
      - calculateSalarisCosts(ziekenhuis.seh.openDichtDagPersoneleBezetting.dicht.nacht)
    )
    return savedSalarisCosts
  }
  return 0
}

const calculateSalarisCosts = (personeleBezetting: PersoneleBezetting) => {
  const fteToNettoConversion = 1.96
  const cost = (
    personeleBezetting.SEHartsen * 172500 +
    personeleBezetting.anios * 94000 +
    personeleBezetting.verpleegkundigen * 81000
  ) * fteToNettoConversion
  return cost
}

type ExtraSEHCosts = {
  savedSalarisCosts: number
  extraKlinischTransportCosts: number
  savedTotal: number
}

export const calculateExtraSEHCosts = (
  ziekenhuis: IZiekenhuis,
  extraSEHDrukte: ExtraSEHDrukte,
  transportCostsPerPerson: number,
  beladenKilometers: number
): ExtraSEHCosts => {

  const savedSalarisCosts = calculateSavedSalarisCosts(ziekenhuis)
  const extraKlinischTransporCosts = extraSEHDrukte.extraKlinisch * (
    transportCostsPerPerson + beladenKilometers * 4.48
  )
  const savedTotal = savedSalarisCosts - extraKlinischTransporCosts
  return {
    savedSalarisCosts: savedSalarisCosts,
    extraKlinischTransportCosts: extraKlinischTransporCosts,
    savedTotal: savedTotal
  }
}

export const sumExtraSEHCosts = (extraSEHCosts: ExtraSEHCosts[]) => (
  sumObjects(extraSEHCosts) as ExtraSEHCosts
)