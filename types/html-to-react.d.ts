declare module 'html-to-react' {
  export interface ProcessNodeDefinition {
    shouldProcessNode: (node: any) => boolean;
    processNode: (node: any, children: any, index: number) => any;
  }

  export class ProcessNodeDefinitions {
    processDefaultNode(node: any, children: any, index: number): any;
  }

  export class Parser {
    parse(html: string): any;
    parseWithInstructions(
      html: string,
      isValidNode: (node: any) => boolean,
      processingInstructions: ProcessNodeDefinition[]
    ): any;
  }
}

declare module 'react-html-parser' {
  function ReactHtmlParser(html: string, options?: any): JSX.Element | JSX.Element[];
  export default ReactHtmlParser;
}

