import { AlertProps } from '../interfaces/alert.interface';

export function disableAlert(callback: (data: any) => void, data: AlertProps = { type: 'info', message: '' }) {
    callback({
        enabled: false,
        ...data
    });
}

export function enableAlert(callback: (data: any) => void, data: AlertProps) {
    callback({
        enabled: true,
        ...data
    });
}
