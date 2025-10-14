import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Popover, Stack, Typography } from '@mui/material';
import { ArrowCircleRight2 } from 'iconsax-react';
import { GrammarFeedback } from '@/types/ielts';

const Root = styled('div')(() => ({
  width: '100%',
  paddingBlock: '5px',
}));

const Marking = styled('span')(() => ({
  cursor: 'pointer',
  paddingInline: '3px',
  backgroundColor: '#FEECEB',
  borderBottom: '1.5px solid #F04438',
}));

const PopoverTitle = styled(Typography)(() => ({
  color: '#252525',
  fontSize: '14px',
}));

const Mistake = styled(Typography)(() => ({
  fontWeight: '500',
  lineHeight: '20px',
  textDecoration: 'line-through',
  textDecorationColor: '#F04438',
}));

const Correction = styled(Typography)(() => ({
  fontWeight: '500',
  lineHeight: '20px',
  color: 'white',
  backgroundColor: '#fff',
  borderRadius: '4px',
  padding: '0.4rem 0.8rem',
}));

const Arrow = styled(ArrowCircleRight2)(() => ({
  color: '#252525',
}));

type DetailedGrammarProps = {
  transcript: string;
  feedback: GrammarFeedback;
};

export default function DetailedGrammar(props: DetailedGrammarProps) {
  const { transcript } = props;
  const errors = props.feedback.grammar_errors;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [errorIdx, setErrorIdx] = useState<number>(0);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    idx: number
  ) => {
    setAnchorEl(event.currentTarget);
    setErrorIdx(idx);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const composeTranscript = () => {
    const transcriptArr = [];
    let start = 0;
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      const end = error.start_index;
      transcriptArr.push(transcript.substring(start, end));
      transcriptArr.push(
        <Marking
          key={`transcript-${i}`}
          onMouseEnter={(event) => handlePopoverOpen(event, i)}
          onMouseLeave={handlePopoverClose}
        >
          {transcript.substring(end, error.end_index)}
        </Marking>
      );
      start = error.end_index;
    }
    if (start < transcript.length)
      transcriptArr.push(transcript.substring(start));

    return transcriptArr;
  };

  return (
    <Root>
      <Typography>{composeTranscript()}</Typography>
      <Popover
        id="grammar-correction-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: -16,
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack gap={1.5} padding="1rem">
          <PopoverTitle>Correction</PopoverTitle>
          <Stack flexDirection="row" gap={2} alignItems="center">
            <Mistake>{errors[errorIdx].mistake}</Mistake>
            <Arrow />
            <Correction>{errors[errorIdx].correction}</Correction>
          </Stack>
        </Stack>
      </Popover>
    </Root>
  );
}

