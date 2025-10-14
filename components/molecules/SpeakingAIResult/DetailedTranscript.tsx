// @mui
import { styled } from '@mui/material/styles';
import { Typography, Popover, Stack } from '@mui/material';
import { useState } from 'react';

const Root = styled('div')(() => ({
  width: '100%',
  paddingBlock: '5px',
}));

const Marking = styled('span')(() => ({
  paddingInline: '3px',
  cursor: 'pointer',
}));

const Connectives = styled(Marking)(() => ({
  backgroundColor: '#D28CF3',
}));

const Filler = styled(Marking)(() => ({
  backgroundColor: '#7FBDEA',
}));

const Pause = styled(Marking)(() => ({
  backgroundColor: '#EEBF65',
}));

const Repetition = styled(Marking)(() => ({
  backgroundColor: '#F67F7F',
}));

const PopoverTitle = styled(Typography)(() => ({
  color: '#252525',
  fontSize: '14px',
}));

type DetailedTranscriptProps = {
  transcript: string;
};

export default function DetailedTranscript(props: DetailedTranscriptProps) {
  const { transcript } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState('');

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    title: string,
    description: string
  ) => {
    setAnchorEl(event.currentTarget);
    setTitle(title);
    setDescription(description);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const parseTranscript = (transcript: string) => {
    const transcriptWithWrapper = '<text>' + transcript + '</text>';
    const parser = new DOMParser();
    const xml = parser.parseFromString(transcriptWithWrapper, 'text/xml');
    if (!xml.getElementsByTagName('text').item(0)?.childNodes) return <></>;

    return (
      <>
        {Array.from(
          xml.getElementsByTagName('text').item(0)
            ?.childNodes as NodeListOf<ChildNode>
        ).map((node, idx) => {
          if (node.nodeName === 'discourse-marker')
            return (
              <Connectives
                key={`transcript-${idx}`}
                onMouseEnter={(event) =>
                  handlePopoverOpen(
                    event,
                    'Connective',
                    `Used for: ${(node as HTMLElement).getAttribute('description')}`
                  )
                }
                onMouseLeave={handlePopoverClose}
              >
                {node.textContent}
              </Connectives>
            );
          if (node.nodeName === 'filler-word')
            return (
              <Filler
                key={`transcript-${idx}`}
                onMouseEnter={(event) =>
                  handlePopoverOpen(event, 'Filler word', '')
                }
                onMouseLeave={handlePopoverClose}
              >
                {node.textContent}
              </Filler>
            );
          if (node.nodeName === 'word-repetition')
            return (
              <Repetition
                key={`transcript-${idx}`}
                onMouseEnter={(event) =>
                  handlePopoverOpen(event, 'Word repetition', '')
                }
                onMouseLeave={handlePopoverClose}
              >
                {node.textContent}
              </Repetition>
            );
          if (node.nodeName === 'speech-pause')
            return (
              <>
                <Pause
                  key={`transcript-${idx}`}
                  onMouseEnter={(event) =>
                    handlePopoverOpen(
                      event,
                      'Pause',
                      `Duration: ${(node as HTMLElement).getAttribute('duration_seconds')} seconds`
                    )
                  }
                  onMouseLeave={handlePopoverClose}
                >
                  {'[ pause ]'}
                </Pause>{' '}
              </>
            );
          return node.textContent;
        })}
      </>
    );
  };
  return (
    <Root>
      <Typography>{parseTranscript(transcript)}</Typography>
      <Popover
        id="detailed-transcript-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: -8,
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack gap={1} padding="1rem">
          <PopoverTitle>{title}</PopoverTitle>
          {description && (
            <Typography fontWeight="500">{description}</Typography>
          )}
        </Stack>
      </Popover>
    </Root>
  );
}

