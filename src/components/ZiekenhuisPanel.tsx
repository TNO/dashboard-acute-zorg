import React, { FC } from 'react'
import { Hour, hourOptions, hours, ActiveHours, isWithinActiveHours, isNotActiveNacht, isActive247, isNotActiveAtAll } from './../interfaces/hours'
import { IZiekenhuis } from './../interfaces/ziekenhuis'
import { calculateExtraSEHDrukte, calculateFractionBetweenStapelDruktes, calculateWeeklyStapeldrukteSum, modifyStapelDrukte } from './../processing/stapeldrukte'
import { useStoreActions, useStoreState } from './../states/store'
import { StapeldrukteChart } from './ZiekenhuisCharts'
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DataTable from './DataTable'
import { calculateSavedSalarisCosts, calculateSavedFte, PersoneleBezetting, calculateExtraSEHCosts } from '../interfaces/personeel'
import { formatWithCommas } from '../processing/utils'
import { InformationIcon } from './InformationIcon'
import { NACHTSLUITING_CHECKBOX_INFO, OPENINGSTIJDEN_INFO, PERSONELE_BEZETTING_INFO, SLUITING_CHECKBOX_INFO } from '../texts'

export const HourDot: FC<{ hour: number, filled: boolean }> = ({ hour, filled }) => {
  const bgColor = filled ? "bg-green-400" : "bg-white"
  return (
    <div className={`w-3 h-3 rounded-full ${bgColor} border-2 border-gray-200`} />
  )
}

export const HourDots: FC<ActiveHours> = (activeHours) => {
  return (
    <>
      {hours.map((hour, key) => {
        if (hour === 24) return
        return <React.Fragment key={key}>
          {/* <div></div> */}
          <HourDot hour={hour} filled={!isNotActiveAtAll(activeHours) && isWithinActiveHours(hour, activeHours)} />
        </React.Fragment>
      })}
    </>
  )
}

interface Props {
  ziekenhuis: IZiekenhuis
}
export const ZiekenhuisPanel: FC<Props> = ({ ziekenhuis }) => {

  const setZiekenhuisActiveOpenHour = useStoreActions(actions => actions.setZiekenhuisActiveOpenHour)
  const setZiekenhuisActiveCloseHour = useStoreActions(actions => actions.setZiekenhuisActiveCloseHour)
  const closingWindow = useStoreState(state => state.closingWindow)
  const currentYear = useStoreState(state => state.currentYear)
  const beladenKilometers = useStoreState(state => state.beladenKilometers)

  const klinischOpvangPercentage = useStoreState(state => state.klinischOpvangPercentage)

  const open = ziekenhuis.seh.currentActiveHours.open
  const close = ziekenhuis.seh.currentActiveHours.close

  const gemStapeldrukteSum = calculateWeeklyStapeldrukteSum([ziekenhuis], currentYear, 'gem')
  const modifiedGemStapeldrukteSum = calculateWeeklyStapeldrukteSum([ziekenhuis], currentYear, 'gem', modifyStapelDrukte, closingWindow)
  const fractionGem = calculateFractionBetweenStapelDruktes(modifiedGemStapeldrukteSum, gemStapeldrukteSum)

  const aantalSEHBezoeken = ziekenhuis.seh.sehForm[currentYear].aantalSEHBezoeken
  const minusSEHBezoeken = Math.floor(aantalSEHBezoeken * (1 - fractionGem))
  const minusVervolgKlinisch = Math.floor(ziekenhuis.seh.sehForm[currentYear].aantalRegistratiesPerBestemmingNaAfloopSEHBezoek.vervolgKlinischEigenZiekenhuis * (1 - fractionGem))
  const minusVervolgPoliklinisch = Math.floor(ziekenhuis.seh.sehForm[currentYear].aantalRegistratiesPerBestemmingNaAfloopSEHBezoek.naarHuisVervolgPoliklinischEigenZiekenhuis * (1 - fractionGem))

  const maxStapeldrukteSum = calculateWeeklyStapeldrukteSum([ziekenhuis], currentYear, 'max')
  const modifiedMaxStapeldrukteSum = calculateWeeklyStapeldrukteSum([ziekenhuis], currentYear, 'max', modifyStapelDrukte, closingWindow)
  const fractionMax = calculateFractionBetweenStapelDruktes(modifiedMaxStapeldrukteSum, maxStapeldrukteSum)

  const stapeldrukteDatas = [
    { label: `aangepast gem ${(fractionGem * 100).toFixed()}%`, stapeldrukte: modifiedGemStapeldrukteSum, color: '#f97316' },
    { label: `aangepast max ${(fractionMax * 100).toFixed()}%`, stapeldrukte: modifiedMaxStapeldrukteSum, color: 'red' },
    { label: 'normaal gem', stapeldrukte: gemStapeldrukteSum, color: 'blue' },
    { label: 'normaal max', stapeldrukte: maxStapeldrukteSum, color: 'green' },
  ]

  const transportCostPerPerson = useStoreState(state => state.transportCostPerPerson)
  const extraSEHDrukte = calculateExtraSEHDrukte(ziekenhuis, currentYear, closingWindow, klinischOpvangPercentage)
  console.log(extraSEHDrukte)
  const extraSEHCosts = calculateExtraSEHCosts(ziekenhuis, extraSEHDrukte, transportCostPerPerson, beladenKilometers)
  console.log(extraSEHCosts)

  const notActiveNacht = isNotActiveNacht({ open, close })
  const active247 = isActive247({ open, close })
  const notActiveAtAll = isNotActiveAtAll({ open, close })

  const includeDag = notActiveAtAll
  const includeAvond = notActiveAtAll
  const includeNacht = notActiveAtAll || notActiveNacht

  return (
    <div className="flex flex-col items-center gap-2 text-sm">
      {/* <div className="text-md font-bold text-white lowercase bg-blue-500 rounded-full px-3 py-1 capitalize">
        {ziekenhuis.locatie}
      </div> */}

      {/* <div className="w-full font-bold text-center"> {ziekenhuis.locatie} </div> */}
      <div className="flex flex-row gap-2">

        <div className="w-full font-bold text-center"> Openingstijden </div>
        <InformationIcon informationText={OPENINGSTIJDEN_INFO} />
      </div>
      <div>
        <FormControlLabel control={
          <Checkbox
            checked={notActiveAtAll}
            onClick={(e) => {
              setZiekenhuisActiveOpenHour({ ziekenhuis: ziekenhuis, open: 0 })
              setZiekenhuisActiveCloseHour({ ziekenhuis: ziekenhuis, close: 0 })
            }}
          />}
          label="Sluiting"
        />
        <InformationIcon informationText={SLUITING_CHECKBOX_INFO} />
        <FormControlLabel control={
          <Checkbox
            checked={notActiveNacht}
            onClick={(e) => {
              setZiekenhuisActiveOpenHour({ ziekenhuis: ziekenhuis, open: 7 })
              setZiekenhuisActiveCloseHour({ ziekenhuis: ziekenhuis, close: 23 })
            }}
          />}
          label="Nachtsluiting"
        />
        <InformationIcon informationText={NACHTSLUITING_CHECKBOX_INFO} />
        <FormControlLabel control={
          <Checkbox
            checked={active247}
            onClick={(e) => {
              setZiekenhuisActiveOpenHour({ ziekenhuis: ziekenhuis, open: 0 })
              setZiekenhuisActiveCloseHour({ ziekenhuis: ziekenhuis, close: 24 })
            }}
          />}
          label="24/7"
        />
      </div>
      <div className="flex flex-row justify-center w-4/6">
        <HourDots open={open} close={close} />
      </div>
      <div className="flex w-4/6 justify-center">
        <Select
          value={open}
          label="Open"
          onChange={(e) => (setZiekenhuisActiveOpenHour({ ziekenhuis: ziekenhuis, open: e!.target.value as Hour }))}
        >
          {hourOptions.map((hourOption, index) =>
            <MenuItem value={hourOption.value} key={index}>{hourOption.label}</MenuItem>)
          }
        </Select>

        <Select
          value={close}
          label="Close"
          onChange={(e) => (setZiekenhuisActiveCloseHour({ ziekenhuis: ziekenhuis, close: e!.target.value as Hour }))}
        >
          {hourOptions.map((hourOption, index) =>
            <MenuItem value={hourOption.value} key={index}> {hourOption.label} </MenuItem>)
          }
        </Select>
      </div>

      {(includeDag || includeAvond || includeNacht) &&
        <>
          <div className="flex flex-row gap-2">
            <div className="w-full font-bold text-center"> Personele bezetting </div>
            <InformationIcon informationText={PERSONELE_BEZETTING_INFO} />
          </div>
          <PersoneleBezetting
            includeDag={includeDag}
            includeAvond={includeAvond}
            includeNacht={includeNacht}
          />
        </>
      }

      <div className="w-full font-bold text-center"> Stapeldrukte </div>

      <StapeldrukteChart stapeldrukteDatas={stapeldrukteDatas} />

      <div className="w-full font-bold text-center"> SEH details </div>

      <DataTable data={[
        { name: "SEH Bezoeken", value: `${formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalSEHBezoeken)} (${-minusSEHBezoeken}, ${(-(1 - fractionGem) * 100).toFixed()}% )` },
        { name: "aantal klinisch", value: formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalKlinischeOpnamen) },
        { name: "vervolg klinisch", value: `${formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalRegistratiesPerBestemmingNaAfloopSEHBezoek.vervolgKlinischEigenZiekenhuis)} (${-minusVervolgKlinisch}, ${(-(1 - fractionGem) * 100).toFixed()}% )` },
        { name: "vervolg poliklinisch", value: `${formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalRegistratiesPerBestemmingNaAfloopSEHBezoek.naarHuisVervolgPoliklinischEigenZiekenhuis)} (${-minusVervolgPoliklinisch}, ${(-(1 - fractionGem) * 100).toFixed()}% )` },

      ]} />

      <DataTable data={[
        { name: "CT verrichtingen", value: formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalCTVerrichtingen) },
        { name: "echo verrichtingen", value: formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalEchoVerrichtingen) },
        { name: "röntgen verrichtingen", value: formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalRöntgenVerrichtingen) },
        { name: "trombolysemeldingen", value: formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalTrombolyseMeldingen) },
        { name: "labafnames", value: formatWithCommas(ziekenhuis.seh.sehForm[currentYear].aantalLabAfnames) },
      ]} />

      {/* <div className="w-full font-bold text-center"> Infrastructuur </div>

      <DataTable data={[
        { name: "investeringen", value: "0	mln. €" },
        { name: "OK-gebruik", value: "0" },
        { name: "oppervlakte", value: "0	m² BVO" },
        { name: "investeringen", value: "0	mln. €" },
      ]} /> */}

      <div className="w-full font-bold text-center"> Personeel </div>

      <DataTable data={[
        { name: "bespaarde salariskosten", value: <div className="text-green-500">+{formatWithCommas(Math.round(extraSEHCosts.savedSalarisCosts))} €</div> },
        { name: "transportkosten", value: <div className="text-red-500">-{formatWithCommas(Math.round(extraSEHCosts.extraKlinischTransportCosts))} €</div> },
        { name: "totaal bespaard", value: <div className={extraSEHCosts.savedTotal > 0 ? "text-green-500" : "text-red-500"}>{formatWithCommas(Math.round(extraSEHCosts.savedTotal))} €</div> },
      ]} />
    </div>
  )
}