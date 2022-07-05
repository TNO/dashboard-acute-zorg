import { useEffect } from "react";
import { Map } from "./components/Map";
import { HeaderPanel } from "./components/HeaderPanel";
import { LandelijkPanel } from "./components/LandelijkPanel";
import { ZiekenhuisPanel } from "./components/ZiekenhuisPanel";
import { useStoreState, useStoreActions } from "./states/store";
import { getHashFromUrl, loadFromHash, setHash } from "./processing/hash";
import Typography from '@mui/material/Typography';
import { AccordionRow, SimpleAccordionComponent } from "./components/SimpleAccordionComponent";
import { loadAllSehFormsFromIndexDatabase } from "./states/sehdatabase";
import { InformationIcon } from "./components/InformationIcon";
import { EXTRA_DRUK_INFO } from "./texts";

const App = () => {

  const ziekenhuizen = useStoreState(state => state.ziekenhuizen)
  const selectedZiekenhuis = useStoreState(state => state.selectedZiekenhuis)
  const setZiekenhuisActiveOpenHour = useStoreActions(actions => actions.setZiekenhuisActiveOpenHour)
  const setZiekenhuisActiveCloseHour = useStoreActions(actions => actions.setZiekenhuisActiveCloseHour)
  const setZiekenhuisOpenDichtDagPersoneleBezetting = useStoreActions(actions => actions.setZiekenhuisOpenDichtDagPersoneleBezetting)
  const loadSEHForm = useStoreActions(actions => actions.loadSEHForm)

  useEffect(() => {
    // load from hash
    const hash = getHashFromUrl()
    loadFromHash(
      hash,
      ziekenhuizen,
      setZiekenhuisActiveOpenHour,
      setZiekenhuisActiveCloseHour,
      setZiekenhuisOpenDichtDagPersoneleBezetting
    )
    // load saved SEH forms
    loadAllSehFormsFromIndexDatabase(loadSEHForm)
  }, [])

  // set hash
  useEffect(() => {
    setHash(ziekenhuizen)
  }, [ziekenhuizen])

  const accordionRows = [
    {
      header: (
        <div className="flex flex-row gap-2">
          <div className="font-bold italic">Extra druk op SEH locaties</div>,
          <InformationIcon informationText={EXTRA_DRUK_INFO} />
        </div>
      ),
      content: <LandelijkPanel />,
      disabled: false
    },
    {
      header: (selectedZiekenhuis === undefined) ?
        <div className="">(selecteer een ziekenhuis op de kaart)</div> :
        <div className="font-bold italic">{`${selectedZiekenhuis.locatie}`}</div>, // (${selectedZiekenhuis?.id})
      content: selectedZiekenhuis && <ZiekenhuisPanel ziekenhuis={selectedZiekenhuis} />,
      disabled: selectedZiekenhuis === undefined
    }
  ]

  return (
    <div className="App text-xs">

      <Map />
      <div className="p-2 sidepanel-container shadow-inner bg-neutral-100 flex flex-col gap-2">

        <HeaderPanel />

        <div className="mt-3">
          <SimpleAccordionComponent rows={accordionRows} />
        </div>
      </div>
    </div>
  );
}

export default App;
