import { FC } from "react"
import ScenarioButtons from "./ScenarioButtons"
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useStoreActions, useStoreState } from "./../states/store";
import { NumberTextInput } from "./NumerTextField";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import logo from '../assets/tno_logo.jpg';
import { InformationIcon } from "./InformationIcon";
import { BELADEN_KILOMETERS_INFO, JAAR_SELECT_INFO, SLUITINGS_WINDOW_INFO, VERVOERSKOSTEN_INFO } from "../texts";

export const HeaderPanel: FC = () => {

  const closingWindow = useStoreState(state => state.closingWindow)
  const setClosingWindow = useStoreActions(actions => actions.setClosingWindow)
  const currentYear = useStoreState(state => state.currentYear)
  const setCurrentYear = useStoreActions(actions => actions.setCurrentYear)
  const transportCostPerPerson = useStoreState(state => state.transportCostPerPerson)
  const setTransportCostPerPerson = useStoreActions(action => action.setTransportCostPerPerson)
  const beladenKilometers = useStoreState(state => state.beladenKilometers)
  const setBeladenKilometers = useStoreActions(action => action.setBeladenKilometers)

  return (
    <div className="flex flex-col gap-6 items-center">

      <div className="mt-5">
        <div className="text-center text-xl font-bold bg-white py-2 px-6 shadow-md">
          Dashboard Acute Zorg
        </div>
        {/* <img className="rounded-xl" src={logo}></img> */}
      </div>

      <div className="bg-white p-4 shadow-md">

        <div className="flex flex-row justify-center items-center gap-2 mt-5">
          <div className="">scenario</div>
          <ScenarioButtons />
          <InformationIcon informationText="
        Sla een scenario op. Openingstijden en personeelsbezetting worden hiermee opgeslagen.
        In totaal kun je drie scenarios opslaan, waardoor je makkelijk verschillende scenarios kunt vergelijken.  
        " />
        </div>

        <div className="grid grid-cols-4 items-center gap-2 text-center mt-5">
          <div> sluitingswindow <InformationIcon informationText={SLUITINGS_WINDOW_INFO} /> </div>
          <div > jaar <InformationIcon informationText={JAAR_SELECT_INFO} /> </div>
          <div> vervoerskosten <InformationIcon informationText={VERVOERSKOSTEN_INFO} /> </div>
          <div> beladen kilometers <InformationIcon informationText={BELADEN_KILOMETERS_INFO} /> </div>


          <Select
            value={closingWindow}
            label="Open"
            onChange={e => setClosingWindow(e.target.value as number)}
            size="small"
          >
            <MenuItem value={1}> 1 uur </MenuItem>
            <MenuItem value={2}> 2 uur </MenuItem>
            <MenuItem value={3}> 3 uur </MenuItem>
            <MenuItem value={4}> 4 uur </MenuItem>
          </Select>


          <Select
            value={currentYear}
            label="Jaar"
            onChange={e => setCurrentYear(e.target.value as (2018 | 2019))}
            size="small"
          >
            <MenuItem value={2018}> 2018 </MenuItem>
            <MenuItem value={2019}> 2019 </MenuItem>
          </Select>


          <NumberTextInput
            value={transportCostPerPerson}
            setValue={setTransportCostPerPerson}
            adornment="€"
          />


          <NumberTextInput
            value={beladenKilometers}
            setValue={setBeladenKilometers}
            adornment="km"
          />
        </div>
      </div>
    </div>
  )
}