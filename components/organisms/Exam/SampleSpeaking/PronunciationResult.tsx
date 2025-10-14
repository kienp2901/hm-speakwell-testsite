//mui
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { IeltsWord } from "types/ielts";
import type { LcatWord } from "types/lcat";
import { Group } from "@mantine/core";
import { setColor } from "utils";

const WordContainerStyle = styled(Box)(() => ({
  borderRadius: "4px",
  border: "1px solid rgba(145, 158, 171, 0.1)",
  margin: "0px 20px 20px 0px",
  textAlign: "center",
  backgroundColor: "rgba(108, 198, 196, 0.05)",
  padding: "14px 10px 10px 10px",
}));

const WordStyle = styled(Typography)(() => ({
  color: "#0056A4",
  fontWeight: 700,
  marginBottom: "20px",
}));

const PhoneContainerStyle = styled(Box)(() => ({
  display: "flex",
}));

const PhoneStyle = styled(Box)(() => ({
  padding: "5px",
  textAlign: "center",
}));

const PhoneLabelStyle = styled(Typography)(() => ({
  padding: "5px 10px",
  textAlign: "center",
  color: "#FFF",
  fontWeight: 700,
}));

const PhoneScoreStyle = styled(Typography)(() => ({
  textAlign: "center",
  fontWeight: 700,
  fontSize: "12px",
  lineHeight: "22px",
  paddingTop: "5px",
}));

type ResultSectionProps = {
  words: LcatWord[] | IeltsWord[];
};

function PronunciationResult(props: ResultSectionProps) {
  const { words } = props;

  return (
    <Group
      bg="var(--mantine-color-body)"
      // gap="md"
    >
      {words?.map((word) => (
        <WordContainerStyle key={word.word_text}>
          <WordStyle>{word.word_text.toLowerCase()}</WordStyle>
          <PhoneContainerStyle className=" flex-wrap">
            {word.phonemes.map((phone: any) => (
              <PhoneStyle key={`${word.word_text}-${phone.ipa_label}`}>
                <PhoneLabelStyle
                  sx={{ backgroundColor: setColor(phone.phoneme_score) }}
                >
                  {phone.ipa_label}
                </PhoneLabelStyle>
                <PhoneScoreStyle>{phone.phoneme_score}%</PhoneScoreStyle>
              </PhoneStyle>
            ))}
          </PhoneContainerStyle>
        </WordContainerStyle>
      ))}
    </Group>
  );
}

export default PronunciationResult;
