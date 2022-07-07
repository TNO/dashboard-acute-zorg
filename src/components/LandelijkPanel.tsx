import { FC, useEffect, useState } from "react"
import { calculateExtraSEHDrukte, calculateWeeklyStapeldrukteSum, modifyStapelDrukte, subtractStapelDruktes, sumExtraSEHDruktes } from "./../processing/stapeldrukte";
import { useStoreActions, useStoreState } from "./../states/store";
import { StapeldrukteChart } from "./ZiekenhuisCharts"
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { getRegionaleRoazZiekenhuizen } from "../processing/regios";

import DataTable from "./DataTable";
import { formatWithCommas } from "../processing/utils";
import { calculateExtraSEHCosts, sumExtraSEHCosts } from "../interfaces/personeel";
import Slider from "@mui/material/Slider";
import { InformationIcon } from "./InformationIcon";
import { DebouncedSlider } from "./DebouncedSlider";
import { LANDELIJK_REGIONAAL_SELECT_INFO, SALARISKOSTEN_BESPARING_INFO, VERVOERSKOSTEN_BESPARING_INFO } from "../texts";

export const LandelijkPanel: FC = () => {

  let ziekenhuizen = useStoreState(state => state.ziekenhuizen)
  const selectedZiekenhuisId = useStoreState(state => state.selectedZiekenhuisId)
  // const regioIndeling = useStoreState(state => state.regioIndeling)
  const closingWindow = useStoreState(state => state.closingWindow)
  const currentYear = useStoreState(state => state.currentYear)
  const transportCostPerPerson = useStoreState(state => state.transportCostPerPerson)
  const beladenKilometers = useStoreState(state => state.beladenKilometers)
  const klinischOpvangPercentage = useStoreState(state => state.klinischOpvangPercentage)
  const setKlinischOpvangPercentage = useStoreActions(actions => actions.setKlinischOpvangPercentage)

  const selectedZiekenhuis = ziekenhuizen.find(zkh => zkh.id === selectedZiekenhuisId) 
  const [selectedPanel, setSelectedPanel] = useState<"Landelijk" | "Regionaal">("Landelijk")
  
  if (selectedPanel === "Regionaal") {
    ziekenhuizen = getRegionaleRoazZiekenhuizen(selectedZiekenhuis!, ziekenhuizen)
    console.log('regionale ziekenhuizen', ziekenhuizen)
  }


  // general 
  const aantalAangepasteSEHs = ziekenhuizen.filter(zkh => (zkh.seh.currentActiveHours.open != zkh.seh.defaultActiveHours.open) ||
    (zkh.seh.currentActiveHours.close != zkh.seh.defaultActiveHours.close)).length

  const aantalSazSEHsInRegio = ziekenhuizen.filter(zkh => zkh.hasSazSEH).length

  // plot
  const gemStapelDrukteSum = calculateWeeklyStapeldrukteSum(ziekenhuizen, currentYear, 'gem')
  const modifiedGemStapelDrukteSum = calculateWeeklyStapeldrukteSum(ziekenhuizen, currentYear, 'gem', modifyStapelDrukte, closingWindow)
  const extraGemStapelDrukte = subtractStapelDruktes(gemStapelDrukteSum, modifiedGemStapelDrukteSum)

  const maxStapelDrukteSum = calculateWeeklyStapeldrukteSum(ziekenhuizen, currentYear, 'max')
  const modifiedMaxStapelDrukteSum = calculateWeeklyStapeldrukteSum(ziekenhuizen, currentYear, 'max', modifyStapelDrukte, closingWindow)
  const extraMaxStapelDrukte = subtractStapelDruktes(maxStapelDrukteSum, modifiedMaxStapelDrukteSum)

  const stapeldrukteDatas = [
    { label: 'extra gem', stapeldrukte: extraGemStapelDrukte, color: 'green' },
    { label: 'extra max', stapeldrukte: extraMaxStapelDrukte, color: 'purple' },
  ]

  // extra drukte and costs 
  const extraSEHDruktes = ziekenhuizen.map(ziekenhuis => calculateExtraSEHDrukte(ziekenhuis, currentYear, closingWindow, klinischOpvangPercentage))

  const extraSEHDrukte = sumExtraSEHDruktes(extraSEHDruktes)
  const extraSEHCosts = sumExtraSEHCosts(
    ziekenhuizen.map(
      (_, index) => calculateExtraSEHCosts(ziekenhuizen[index], extraSEHDruktes[index], transportCostPerPerson, beladenKilometers)
    )
  )

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-sm">

      <div className="flex flex-row gap-2">

        <ToggleButtonGroup
          color="primary"
          value={selectedPanel}
          exclusive
          onChange={
            (event: React.MouseEvent<HTMLElement>, selectedPanel: "Landelijk" | "Regionaal") => {
              if (selectedZiekenhuis) {
                setSelectedPanel(selectedPanel)
              }
            }
          }
        >
          <ToggleButton value="Landelijk">Landelijk</ToggleButton>
          <ToggleButton value="Regionaal">Regionaal: {selectedZiekenhuis?.roazRegio[0]}</ToggleButton>
        </ToggleButtonGroup>
        <InformationIcon informationText={LANDELIJK_REGIONAAL_SELECT_INFO} />
      </div>

      {selectedPanel === "Landelijk" && <div>{aantalAangepasteSEHs} van de {aantalSazSEHsInRegio} SEH locaties aangepast (2,25 mln. totaal SEH bezoeken, bron: NZa​)</div>}

      <div className="w-full">
        <DataTable data={[
          { name: "extra SEH bezoeken", value: <div className="">+{formatWithCommas(extraSEHDrukte.extraSEHBezoeken)}</div> },
          {
            name: "extra vervolg klinisch", value: (
              <div className="flex flex-row gap-5 justify-between">
                <DebouncedSlider
                  size="small"
                  valueLabelDisplay="on"
                  valueLabelFormat={(label) => `${label}%`}
                  min={0}
                  max={100}
                  sx={{ width: 150 }}
                  debouncedValue={klinischOpvangPercentage}
                  setDebouncedValue={setKlinischOpvangPercentage}
                />
                <InformationIcon informationText="Het percentage op de slider geeft aan hoeveel procent van de extra klinische opnames terug wordt gebracht naar de SEH locatie die aanvankelijk gedeeltelijk gesloten was." />
                {/* <div className="whitespace-nowrap"> {`${"60%"} opvang eigen ziekenhuis`} </div> */}
                <div className="">+{formatWithCommas(extraSEHDrukte.extraKlinisch)}</div>
              </div>
            )
          },
          { name: "extra vervolg poliklinisch", value: <div className="">+{formatWithCommas(extraSEHDrukte.extraPoliklinisch)}</div> },

          {
            name: (
              <div className="flex flex-row gap-2">
                <div>salariskosten</div>
                <InformationIcon informationText={SALARISKOSTEN_BESPARING_INFO} />
              </div>
            ),
            value: <div className="text-green-500">+{formatWithCommas(Math.round(extraSEHCosts.savedSalarisCosts))} €</div>
          },
          {
            name: (
              <div className="flex flex-row gap-2">
                <div>vervoerskosten</div>
                <InformationIcon informationText={VERVOERSKOSTEN_BESPARING_INFO} />
              </div>
            ),
            value: <div className="text-red-500">-{formatWithCommas(Math.round(extraSEHCosts.extraKlinischTransportCosts))} €</div>
          },
          { name: "totaal bespaard", value: <div className={extraSEHCosts.savedTotal > 0 ? "text-green-500" : "text-red-500"}>{formatWithCommas(Math.round(extraSEHCosts.savedTotal))} €</div> },

        ]} />
      </div>

      <div className="w-full font-bold text-center"> Stapeldrukte </div>

      <StapeldrukteChart stapeldrukteDatas={stapeldrukteDatas} />

    </div>
  )
}