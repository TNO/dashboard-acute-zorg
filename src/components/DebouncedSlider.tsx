import { Slider, SliderProps } from "@mui/material"
import { useState } from "react"

interface DebouncedSliderProps extends SliderProps {
  debouncedValue: number
  setDebouncedValue: (value: number) => void
}
export const DebouncedSlider = (props: DebouncedSliderProps) => {

  const { debouncedValue, setDebouncedValue,  ...restProps} = props

  const [value, setValue] = useState(debouncedValue)

  const [timerId, setTimerId] = useState<any>(null)

  const handleChange = (event: Event, value: number) => {
    timerId && clearTimeout(timerId);
    setTimerId(setTimeout(() => {
      console.log('change');
      setDebouncedValue(value);
    }, 500)
    )
  };

  return <Slider
    {...restProps}
    value={value}
    onChange={(event, value) => {
      if (typeof value === "number") {
        setValue(value)
        handleChange(event, value)
      }
    }
    }
  />
}