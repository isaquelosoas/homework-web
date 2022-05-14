import * as React from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { IUserTask } from '../interfaces/userTask.interface';

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

interface DepositsProps {
    tasks: IUserTask[];
}
export default function Deposits({ tasks }: DepositsProps) {
    const getTotalIncome = tasks
        .filter((task) => task.pending === false && task.approved === true)
        .map((task) => task.taskValue)
        .reduce((acc, curr) => acc + curr, 0);

    const getDatesFromTasks = tasks.map((task) => new Date(task.startTime).getTime()) || [new Date().getTime()];
    //getMaxDate
    const getMaxDate = Math.max(...getDatesFromTasks);
    //getMinDate
    const getMinDate = Math.min(...getDatesFromTasks);
    return (
        <React.Fragment>
            <Title>Entrada Total</Title>
            <Typography component="p" variant="h4">
                {`R$ ${tasks.length > 0 ? getTotalIncome.toFixed(2) : 0.0}`}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {`de ${tasks.length > 0 ? new Date(getMinDate).toLocaleDateString('pt-BR') : 'now'}`}
                <br />
                {`até ${tasks.length > 0 ? new Date(getMaxDate).toLocaleDateString('pt-BR') : 'now'}`}
            </Typography>
            <div>
                <Link href="/history">View balance</Link>
            </div>
        </React.Fragment>
    );
}
