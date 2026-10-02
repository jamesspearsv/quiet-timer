export type Phase = 'focus' | 'break';

export type TimerStatus = 'running' | 'stopped' | 'paused' | 'finished';

export interface Context {
    action: string;
    completed: boolean;
    duration_worked: number;
}
