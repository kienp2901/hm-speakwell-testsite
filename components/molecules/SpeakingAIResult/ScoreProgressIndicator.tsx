import {
  Stack,
  StackProps,
  Box,
  styled,
  Typography,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';

const Root = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '10% 75% 10%',
  paddingTop: '30px',
  paddingRight: '1rem',
  marginRight: '-1rem',
  position: 'relative',
  gap: '0.75rem',
  width: '70%',
  maxWidth: '450px',
  alignItems: 'center',
}));

interface BarContainerProps extends StackProps {
  firstSection: number;
  secondSection: number;
}
const BarContainer = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== 'firstSection' && prop !== 'secondSection',
})<BarContainerProps>(({ firstSection, secondSection }) => ({
  width: '100%',
  flexDirection: 'row',
  height: '8px',
  borderRadius: '100px',
  overflow: 'hidden',
  '& > *:first-of-type': {
    flex: `1 1 ${firstSection}%`,
  },
  '& > *:nth-of-type(2)': {
    flex: `1 1 ${secondSection}%`,
  },
  '& > *:last-of-type': {
    flex: `1 1 ${100 - firstSection - secondSection}%`,
  },
}));

const Caption = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.grey[600],
  textAlign: 'center',
}));

interface TooltipStyleProps extends TooltipProps {
  position: number;
}
const TooltipStyle = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
  {
    shouldForwardProp: (prop) => prop !== 'position',
  }
)<TooltipStyleProps>(({ position, theme }) => ({
  inset: `0px auto auto calc(10% + 0.75rem + ((100% - 1.2rem) * 0.75 * ${position} / 100)) !important`,
  transform: 'translate3d(-50%, 0, 0) !important',
  [`& .${tooltipClasses.tooltipArrow}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
}));

type ScoreProgressIndicatorProps = {
  score: number;
  max: number;
  min: number;
  firstMark: number;
  secondMark: number;
  captions: string[];
};

function ScoreProgressIndicator(props: ScoreProgressIndicatorProps) {
  const { score: ogScore, max, min, firstMark, secondMark, captions } = props;
  const score = Math.min(Math.max(ogScore, min), max);
  const tooltipText =
    (score < firstMark
      ? captions[0]
      : score < secondMark
        ? 'Normal'
        : captions[1]) + ` ${score}`;

  return (
    <Root>
      <Caption>{captions[0]}</Caption>
      <TooltipStyle
        position={(score / (max - min)) * 100}
        title={tooltipText}
        arrow
        open
        placement="top"
        PopperProps={{
          disablePortal: true,
        }}
      >
        <BarContainer
          firstSection={(firstMark / (max - min)) * 100}
          secondSection={((secondMark - firstMark) / (max - min)) * 100}
        >
          <Box sx={{ backgroundColor: 'red' }} />
          <Box sx={{ backgroundColor: 'green' }} />
          <Box sx={{ backgroundColor: 'yellow' }} />
        </BarContainer>
      </TooltipStyle>
      <Caption>{captions[1]}</Caption>
    </Root>
  );
}

export default ScoreProgressIndicator;

