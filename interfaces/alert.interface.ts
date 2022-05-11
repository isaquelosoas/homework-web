export interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export interface IAlert extends AlertProps {
    enabled: boolean;
}
