import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 1)',
      boxShadow: theme.shadows[1],
      fontSize: 16,
    },
  }));
  
  export const InformationIcon = ({ informationText }: { informationText: string }) => {
    return (
      <LightTooltip title={informationText}>
        <InfoOutlinedIcon />
      </LightTooltip>
    )
  }