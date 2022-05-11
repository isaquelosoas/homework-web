import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { isAuthorized, server } from './api/service';
import { ITokenInfo } from '../interfaces/tokenInfo.interface';
import Dashboard from '../components/Dashboard';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../components/Chart';
import Deposits from '../components/Deposits';
import Tasks from '../components/Tasks';
import { IUserTask } from '../interfaces/userTask.interface';
import { IChartData } from '../interfaces/chart.interface';
import { formatDate } from '../helpers/date.helper';

const Task: NextPage = () => {
    const [userData, setUserData] = useState<ITokenInfo>();
    const [tasks, setTasks] = useState<IUserTask[] | []>([]);

    useEffect(() => {
        const checkAuthorization = async () => {
            const response = await isAuthorized();
            if (response) {
                setUserData(response);
                const { id } = response;
                console.log(id);
                const token = window.localStorage.getItem('token');
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
            }
        };
        checkAuthorization();
    }, []);

    const updateTasks = () => {
        if (userData) {
            const { id } = userData;
            const token = window.localStorage.getItem('token');
            server
                .get(`/user/${id}/task`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res: { data: IUserTask[] | [] }) => {
                    setTasks(res.data);
                })
                .catch((err) => console.log(err));
            server
                .get(`/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res: { data: ITokenInfo }) => {
                    setUserData(res.data);
                })
                .catch((err) => console.log(err));
        }
    };

    const createChartData: IChartData[] = tasks
        .map((task: IUserTask) => {
            return {
                label: formatDate(task.startTime),
                amount: task.timeSpent
            };
        })
        .reduce((acc: IChartData[], curr: IChartData) => {
            const found = acc.find((item: IChartData) => item.label === curr.label);
            if (found) {
                found.amount += curr.amount;
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);

    return (
        <>
            {userData && (
                <Dashboard userData={userData}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240
                                }}
                            >
                                <Chart data={tasks.length > 0 ? createChartData : []} />
                            </Paper>
                        </Grid>
                        {/* Recent Deposits */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240
                                }}
                            >
                                <Deposits tasks={tasks} />
                            </Paper>
                        </Grid>
                        {/* Recent Orders */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Tasks tasks={tasks} user={userData} updateTasks={updateTasks} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Dashboard>
            )}
        </>
    );
};

export default Task;
