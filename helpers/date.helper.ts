import { Moment } from 'moment';
import moment from 'moment';

export function formatDate(date: string) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit'
    });
}

export function getTimeSpent(timeSpent: number) {
    timeSpent = timeSpent * 3600;
    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent - hours * 3600) / 60);
    const seconds = timeSpent - hours * 3600 - minutes * 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

export function getFullTimeFromMoment(date: string, time: Moment) {
    const hour = time.format('HH:mm');
    return `${date}T${hour}:00`;
}
