export type Notify = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  delay?: number;
};
