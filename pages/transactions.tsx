import { useEffect, useState } from 'react';
import { IWithdraw } from '../interfaces/withdraw.interface';
import Dashboard from '../components/Dashboard';
import { IUserTask } from '../interfaces/userTask.interface';
import { getTokenInfo } from '../helpers/token.helper';
import { Grid, Paper } from '@mui/material';
import { server } from './api/service';
import { getHistoryData } from '../helpers/history.helper';
import TransactionItems from '../components/TransactionItems';

const Transactions = () => {
    const [tasks, setTasks] = useState<IUserTask[] | []>([]);
    const [withdrawals, setWithdrawals] = useState<IWithdraw[]>([]);

    useEffect(() => {
        const getInitialData = async () => {
            const { id, token } = await getTokenInfo();
            if (id && token) {
                await server
                    .get(`/user/${id}/task`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((res: { data: IUserTask[] | [] }) => {
                        setTasks(res.data);
                    })
                    .catch((err) => console.log(err));
                await server
                    .get(`/withdraw`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            AND: [
                                {
                                    status: 'success'
                                },
                                {
                                    userId: id
                                }
                            ]
                        }
                    })
                    .then((res: { data: IWithdraw[] }) => {
                        setWithdrawals(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        };
        getInitialData();
    }, []);

    const transactionsData = getHistoryData(tasks, withdrawals);
    return (
        <Dashboard>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <TransactionItems transactions={transactionsData} />
                    </Paper>
                </Grid>
            </Grid>
        </Dashboard>
    );
};

export default Transactions;
