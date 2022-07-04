import Button from "@mui/material/Button"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { useEffect, useState } from "react"
import { getHashFromUrl, loadFromHash } from "../processing/hash"
import { useStoreActions, useStoreState } from "../states/store"


export default function ScenarioButtons() {

  const ziekenhuizen = useStoreState(state => state.ziekenhuizen)
  const setZiekenhuisActiveOpenHour = useStoreActions(actions => actions.setZiekenhuisActiveOpenHour)
  const setZiekenhuisActiveCloseHour = useStoreActions(actions => actions.setZiekenhuisActiveCloseHour)
  const setZiekenhuisOpenDichtDagPersoneleBezetting = useStoreActions(actions => actions.setZiekenhuisOpenDichtDagPersoneleBezetting)

  type Scenario = 1 | 2 | 3
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(1)


  useEffect(() => {
    window.localStorage.setItem('ziekenhuizen.activeScenario', selectedScenario && selectedScenario.toString())
    const hash = window.localStorage.getItem(`ziekenhuizen.scenarioHash${selectedScenario}`)
    if (hash) {
      loadFromHash(
        hash,
        ziekenhuizen,
        setZiekenhuisActiveOpenHour,
        setZiekenhuisActiveCloseHour,
        setZiekenhuisOpenDichtDagPersoneleBezetting,
      )
    }
  }, [selectedScenario])

  const saveScenario = () => {
    const hash = getHashFromUrl()
    window.localStorage.setItem(`ziekenhuizen.scenarioHash${selectedScenario}`, hash)
  }

  return (

    <div>
      <ToggleButtonGroup
        color="primary"
        value={selectedScenario}
        exclusive

        onChange={
          (event, selectedScenario) => { setSelectedScenario(selectedScenario) }
        }
      >
        <ToggleButton value={1}>1</ToggleButton>
        <ToggleButton value={2}>2</ToggleButton>
        <ToggleButton value={3}>3</ToggleButton>
      </ToggleButtonGroup>

      <Button
        onClick={() => {
          saveScenario()
        }}
      >
        Opslaan
      </Button>
    </div>
  )
}


// activate
// const href = window.localStorage.getItem(`ziekenhuizen.scenario${scenarioIndex}`);
// if (href && href !== window.location.href) {
//   window.location.href = href;
//   window.location.reload();
// }

// save
// window.localStorage.setItem(`ziekenhuizen.scenario${scenarioIndex}`, window.location.href);