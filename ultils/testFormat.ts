// Test format types (matching backend enum)
export const TestType = {
  Listening: 1,
  Reading: 2,
  Writing: 3,
  Speaking: 4,
} as const;

export type TestTypeValue = typeof TestType[keyof typeof TestType];

// Convert test format number to URL path string
export const getTestFormat = (test_format: number): string => {
  let type = 'listening';
  switch (test_format) {
    case TestType.Listening:
    case 1:
      type = 'listening';
      break;
    case TestType.Reading:
    case 2:
      type = 'reading';
      break;
    case TestType.Writing:
    case 3:
      type = 'writing';
      break;
    case TestType.Speaking:
    case 4:
      type = 'speaking';
      break;
    default:
      type = 'listening';
      break;
  }
  return type;
};

// Get test format display name
export const getTestFormatName = (test_format: number): string => {
  const names: Record<number, string> = {
    1: 'Listening',
    2: 'Reading',
    3: 'Writing',
    4: 'Speaking',
  };
  return names[test_format] || 'Unknown';
};

