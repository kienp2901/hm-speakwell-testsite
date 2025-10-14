export const config = {
  'fast-preview': {
    disabled: true,
  },
  asciimath: {
    displaystyle: true,
    delimiters: [
      ["$", "$"],
      ["`", "`"],
      ["$$", "$$"]
    ]
  },
  tex: {
    loader: { load: ["[tex]/html"] },
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  },
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  chtml: {
    displayAlign: 'start', // default for indentalign when set to 'auto'
  },
  messageStyle: 'none',
};

export const validateData = (data?: string): string | undefined => {
  if (data?.includes('$')) {
    if (data?.includes('$$')) {
      return data;
    } else {
      return data?.replace(/\$/g, '$$$$');
    }
  } else if (data?.includes('\\[')) {
    return data?.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$');
  } else return data;
};

