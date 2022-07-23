import { useState, useEffect, Fragment } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { IUserTask } from '../interfaces/userTask.interface';
import { formatDate, getTimeSpent } from '../helpers/date.helper';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { Button, Grid, Modal } from '@mui/material';
import TaskModal from './TaskModal';
import { ITask } from '../interfaces/task.interface';
import { server } from '../pages/api/service';
import { ITokenInfo } from '../interfaces/tokenInfo.interface';

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

const getStatus = (pending: boolean, approved: boolean) => {
    if (pending && !approved) {
        return 'Pendente';
    }
    if (approved && !pending) {
        return 'Aprovado';
    }
    return 'Não aprovado';
};

interface ITasksProps {
    tasks: IUserTask[];
    id: string;
    updateTasks: (limit?: number) => void;
}

export default function Tasks({ tasks, id, updateTasks }: ITasksProps) {
    const [taskModal, setTaskModal] = useState<boolean>(false);
    const [taskList, setTaskList] = useState<ITask[]>([]);
    const [pagination, setPagination] = useState<number>(1);

    const getMoreTasks = () => {
        const newPagination = pagination + 1;
        const taskQuantity = newPagination * 30;
        setPagination(newPagination);
        updateTasks(taskQuantity);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        server
            .get('/task', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res: { data: ITask[] }) => {
                setTaskList(res.data);
            })
            .catch((err) => console.log(err));
    }, []);
    tasks.sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
    return (
        <Fragment>
            <Modal
                open={taskModal}
                onClose={() => {
                    setTaskModal(false);
                }}
            >
                {<TaskModal tasks={taskList} id={id} setTaskModal={setTaskModal} updateTasks={updateTasks} />}
            </Modal>
            <Grid container spacing={3}>
                <Grid item xs={10} md={10} lg={10}>
                    <Title>Tarefas Recentes</Title>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setTaskModal(true);
                        }}
                    >
                        Nova Tarefa
                    </Button>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Data de Início</TableCell>
                        <TableCell>Tempo Dispendido</TableCell>
                        <TableCell>Tarefa</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Valor da Tarefa</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>
                                <SquareRoundedIcon htmlColor={task.task.Category.color} />
                            </TableCell>
                            <TableCell>{formatDate(task.startTime)}</TableCell>
                            <TableCell>{getTimeSpent(task.timeSpent)}</TableCell>
                            <TableCell>{task.task.name}</TableCell>
                            <TableCell>{task.task.Category.name}</TableCell>
                            <TableCell>{task.taskValue.toFixed(2)}</TableCell>
                            <TableCell align="right">{getStatus(task.pending, task.approved)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link
                color="primary"
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    getMoreTasks();
                }}
                sx={{ mt: 3 }}
            >
                See more orders
            </Link>
        </Fragment>
    );
}
