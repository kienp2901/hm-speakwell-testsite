import { useMemo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, useTheme } from '@mui/material';

const Root = styled(Stack)(() => ({
  flexDirection: 'row',
  gap: '2rem',
  rowGap: '1rem',
  flexWrap: 'wrap',
}));

const LegendItemContainer = styled(Stack)(() => ({
  flexDirection: 'row',
  gap: '0.75rem',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Count = styled('span')(() => ({
  fontSize: '14px',
  fontWeight: '500',
  width: '24px',
  height: '24px',
  borderRadius: '100px',
  display: 'grid',
  placeItems: 'center',
}));

const LegendText = styled(Typography)(() => ({
  fontSize: '13px',
  lineHeight: '16px',
  fontWeight: '500',
  color: '#252525',
}));

type DetailedTranscriptLegendProps = {
  transcript: string;
};

export default function DetailedTranscriptLegend(
  props: DetailedTranscriptLegendProps
) {
  const { transcript } = props;
  const theme = useTheme();
  const legends = useMemo(() => {
    const legends = [
      {
        name: 'Connectives',
        color: '#D28CF3',
        key: 'discourse-marker',
        count: 0,
      },
      {
        name: 'Word repetitions',
        color: '#F67F7F',
        key: 'word-repetition',
        count: 0,
      },
      {
        name: 'Filler word',
        color: '#7FBDEA',
        key: 'filler-word',
        count: 0,
      },
      {
        name: 'Pauses',
        color: '#EEBF65',
        key: 'speech-pause',
        count: 0,
      },
    ];
    let _transcript = transcript;
    _transcript = '<text>' + _transcript + '</text>';
    const parser = new DOMParser();
    const xml = parser.parseFromString(_transcript, 'text/xml');
    if (!xml.getElementsByTagName('text').item(0)?.childNodes) return legends;

    Array.from(
      xml.getElementsByTagName('text').item(0)
        ?.childNodes as NodeListOf<ChildNode>
    ).forEach((node) => {
      legends.forEach((legend) => {
        if (node.nodeName === legend.key) {
          legend.count++;
        }
      });
    });
    return legends;
  }, [theme, transcript]);

  return (
    <Root>
      {legends.map((legend) => (
        <LegendItemContainer key={`legend-${legend.key}`}>
          <Count style={{ backgroundColor: legend.color }}>
            {legend.count}
          </Count>
          <LegendText>{legend.name}</LegendText>
        </LegendItemContainer>
      ))}
    </Root>
  );
}

