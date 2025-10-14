// Global type declarations

interface Window {
  MathJax?: {
    typesetPromise?: (elements: Element[]) => Promise<void>;
    [key: string]: any;
  };
}

