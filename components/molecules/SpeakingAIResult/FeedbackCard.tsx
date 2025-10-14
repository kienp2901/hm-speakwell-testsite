import { isValidElement, lazy } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
const ScoreProgressIndicator = lazy(() => import('./ScoreProgressIndicator'));

const CardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const TitleStyle = styled(Typography)(() => ({
  fontWeight: '700',
  fontSize: '16px',
  marginBlock: '8px',
  color: '#FF3BAF',
}));

const ValueStyle = styled(Typography)(() => ({
  fontWeight: '700',
  fontSize: '16px',
  color: '#3BA09E',
}));

const ContentStyle = styled(Typography)(() => ({
  fontSize: '16px',
  color: '#252525',
  padding: '5px 0px',
}));

const BoldText = styled(Typography)(() => ({
  color: '#252525',
  fontWeight: '700',
  fontSize: '16px',
}));

const TextScoreContainer = styled(Box)(() => ({
  borderRadius: '100px',
  color: 'white',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '20px',
  padding: '2px 8px',
}));

const ContentContainer = styled('div')(() => ({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
}));

const Divider = styled('hr')(() => ({
  borderBlockColor: '#D8E1EA',
  borderWidth: '0.5px',
}));

type FeatureCardProps = {
  title: string;
  content?: string;
  value?: number | string | React.ReactNode;
  children?: React.ReactNode;
};

export default function FeedbackCard(props: FeatureCardProps) {
  const { title, content, value, children } = props;
  const stringScoreColor =
    title === 'Grammar complexity' || title === 'Vocabulary complexity'
      ? value === 'SIMPLE'
        ? '#3DB81E'
        : value === 'AVERAGE'
          ? '#FFAC0B'
          : '#FF2323'
      : title === 'Unscripted content relevance score'
        ? value === 'RELEVANT'
          ? '#3DB81E'
          : value === 'PARTIALLY RELEVANT'
            ? '#FFAC0B'
            : '#FF2323'
        : '#3DB81E';

  return (
    <div className="border border-neutral-300 rounded-xl p-2">
      <Box>
        <CardHeader>
          <TitleStyle>{title}</TitleStyle>
          {title === 'Speech rate' ? (
            <ScoreProgressIndicator
              score={(value as number) || 0}
              min={0}
              max={280}
              firstMark={80}
              secondMark={200}
              captions={['Slow', 'Fast']}
            />
          ) : isValidElement(value) ? (
            value
          ) : typeof value === 'string' ? (
            <TextScoreContainer
              sx={{
                backgroundColor: stringScoreColor,
              }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
            </TextScoreContainer>
          ) : (
            <ValueStyle>{value}</ValueStyle>
          )}
        </CardHeader>
        {(content || children) && (
          <>
            <Divider />
            <BoldText>Feedback</BoldText>
            <ContentContainer>
              {content && <ContentStyle>{content}</ContentStyle>}
              {children}
            </ContentContainer>
          </>
        )}
      </Box>
    </div>
  );
}

