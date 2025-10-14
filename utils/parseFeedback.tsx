import type { IeltsResult } from '@/types/ielts';
import type { LcatResult } from '@/types/lcat';
import type { Feedbacks } from '@/types/feedback';
import DetailedTranscript from '@/components/molecules/SpeakingAIResult/DetailedTranscript';
import DetailedTranscriptLegend from '@/components/molecules/SpeakingAIResult/DetailedTranscriptLegend';
import SpeechRateChart from '@/components/molecules/SpeakingAIResult/SpeechRateChart';
import DetailedGrammar from '@/components/molecules/SpeakingAIResult/DetailedGrammar';

export default function parseFeedback(result: LcatResult | IeltsResult) {
  const metaData: Feedbacks[] = !('metadata' in result)
    ? []
    : [
        {
          title: 'The predicted text',
          content: result.metadata.predicted_text,
        },
        {
          title: 'Unscripted content relevance score',
          content: result.metadata.content_relevance_feedback,
          value: result.metadata?.content_relevance
            ? typeof result.metadata.content_relevance === 'string'
              ? result.metadata?.content_relevance.replace('_', ' ')
              : result.metadata?.content_relevance
            : '',
        },
      ];
  const fluencyFeedback: Feedbacks[] = !('fluency' in result)
    ? []
    : [
        {
          title: 'Detailed transcript',
          ...(result.fluency.feedback?.tagged_transcript?.length && {
            children: (
              <DetailedTranscript
                transcript={result.fluency.feedback?.tagged_transcript}
              />
            ),
            value: (
              <DetailedTranscriptLegend
                transcript={result.fluency.feedback?.tagged_transcript}
              />
            ),
          }),
        },
        {
          title: 'Speech rate',
          content: result.fluency.feedback?.speech_rate?.feedback_text,
          value: result.fluency.metrics?.speech_rate,
          children: result.fluency.metrics?.speech_rate_over_time &&
            result.fluency.metrics.speech_rate_over_time.length && (
              <SpeechRateChart
                speechRateSerie={
                  result.fluency.metrics.speech_rate_over_time.length == 1
                    ? [
                        result.fluency.metrics.speech_rate_over_time[0],
                        result.fluency.metrics.speech_rate_over_time[0],
                      ]
                    : result.fluency.metrics.speech_rate_over_time
                }
              />
            ),
        },
        {
          title: 'Number of pauses',
          content: result.fluency.feedback?.pauses?.feedback_text,
          value: result.fluency.metrics?.pauses,
        },
        {
          title: 'Number of filler words',
          content: result.fluency.feedback?.filler_words?.feedback_text,
          value: result.fluency.metrics?.filler_words,
        },
        {
          title: 'Filler words per minute',
          content: result.fluency.feedback?.filler_words_per_min?.feedback_text,
          value: result.fluency.metrics?.filler_words_per_min,
        },
      ];
  const grammarFeedback: Feedbacks[] = !('grammar' in result)
    ? []
    : [
        {
          title: 'Number of grammar mistakes',
          ...(result.grammar.feedback?.grammar_errors?.length && {
            children: (
              <DetailedGrammar
                transcript={result.metadata.predicted_text}
                feedback={result.grammar.feedback}
              />
            ),
          }),
          value: result.grammar.metrics?.mistake_count,
        },
        {
          title: 'Grammar complexity',
          value: result.grammar.metrics?.grammatical_complexity.replace('_', ' '),
        },
      ];
  const vocabularyFeedback: Feedbacks[] = !('vocabulary' in result)
    ? []
    : [
        {
          title: 'Vocabulary complexity',
          value: result.vocabulary.metrics?.vocabulary_complexity.replace(
            '_',
            ' '
          ),
        },
      ];

  return {
    metaData,
    fluencyFeedback,
    grammarFeedback,
    vocabularyFeedback,
  };
}

export const parseFeedbackWriting = (result: any) => {
  return result;
};
