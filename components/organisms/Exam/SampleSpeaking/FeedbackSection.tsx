//mui
import type { Feedbacks } from "types/feedback";
import { Stack } from "@mantine/core";
import FeedbackCard from "@/components/molecules/SpeakingAIResult/FeedbackCard";

export type FeedbackProps = {
  data: Feedbacks[] | undefined;
};

function FeedbackSection(props: FeedbackProps) {
  const { data } = props;

  return (
    <Stack
      bg="var(--mantine-color-body)"
      align="stretch"
      justify="center"
    >
      {data?.map((feedback) => (
        <FeedbackCard
          title={feedback.title}
          content={feedback.content}
          value={feedback.value}
          key={feedback.title}
        >
          {feedback.children}
        </FeedbackCard>
      ))}
    </Stack>
  );
}

export default FeedbackSection;
