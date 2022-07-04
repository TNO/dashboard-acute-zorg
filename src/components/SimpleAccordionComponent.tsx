import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type AccordionRow = {
  header: string | JSX.Element
  content?: JSX.Element
  disabled?: boolean
}

interface Props {
  rows: AccordionRow[]
}
export const SimpleAccordionComponent = (props: Props) => {

  return (
    <>
      {
        props.rows.map((row, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography> {row.header} </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {row.content}
            </AccordionDetails>
          </Accordion>
        )
        )
      }
    </>
  )
}