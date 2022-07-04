import { FC } from "react"
import React, { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"

interface Props {
  value: number
  setValue: (value: number) => void
  adornment?: string 
}
export const NumberTextInput: FC<Props> = (props) => {


  const { value, setValue } = props

  const [currentInput, setCurrentInput] = useState<string>(value.toString())

  const isValidNumber = (s: string) => new RegExp("^[0-9]+([.][0-9]+)?$").test(s)

  return (<TextField
    InputProps={{
      startAdornment: <InputAdornment position="start"> {props.adornment}</InputAdornment>
    }}
    error={!isValidNumber(currentInput)}
    helperText={!isValidNumber(currentInput) && "must be a valid number"}
    size="small"
    value={currentInput}
    onChange={(event) => {
      const newInput = event.target.value
      setCurrentInput(newInput)

      if (isValidNumber(newInput)) {
        setValue(Number(newInput))
      }
    }}
  />
  )
}
