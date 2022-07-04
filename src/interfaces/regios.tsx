import { FC } from 'react'

export type RegioIndeling =
  'corop' |
  'energie' |
  'ggd' |
  'jeugd' |
  'provincie' |
  'rav' |
  'roaz' |
  'veiligheid' |
  'zorgkantoor'

type RegioIndelingOption = {
  value: RegioIndeling,
  label: string
}

const regioIndelingen: RegioIndeling[] = ['corop', 'energie', 'ggd', 'jeugd', 'provincie', 'rav', 'roaz', 'veiligheid', 'zorgkantoor']

export const regioIndelingOptions: RegioIndelingOption[] = regioIndelingen.map(regioIndeling => ({ value: regioIndeling, label: regioIndeling }))
