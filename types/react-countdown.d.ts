declare module 'react-countdown' {
  import { Component } from 'react';

  export interface CountdownRenderProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    completed: boolean;
    formatted: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    api: {
      start: () => void;
      pause: () => void;
      stop: () => void;
    };
  }

  export interface CountdownProps {
    date?: Date | number | string;
    daysInHours?: boolean;
    zeroPadTime?: number;
    zeroPadDays?: number;
    controlled?: boolean;
    intervalDelay?: number;
    precision?: number;
    autoStart?: boolean;
    overtime?: boolean;
    className?: string;
    children?: React.ReactNode;
    renderer?: (props: CountdownRenderProps) => React.ReactNode;
    now?: () => number;
    onMount?: (delta: CountdownRenderProps) => void;
    onStart?: (delta: CountdownRenderProps) => void;
    onPause?: (delta: CountdownRenderProps) => void;
    onStop?: (delta: CountdownRenderProps) => void;
    onTick?: (delta: CountdownRenderProps) => void;
    onComplete?: (delta: CountdownRenderProps) => void;
  }

  export default class Countdown extends Component<CountdownProps> {}
}

