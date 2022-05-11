import Alert from '@mui/material/Alert';
import { AlertProps } from '../interfaces/alert.interface';

export default function AppAlert({ message, type }: AlertProps) {
    return <Alert severity={type}>{message}</Alert>;
}
