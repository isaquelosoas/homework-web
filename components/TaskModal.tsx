import { Autocomplete, Button, CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import 'moment/locale/pt-br';
import { FormEvent, useState } from 'react';
import { ITask } from '../interfaces/task.interface';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Moment } from 'moment';
import { getFullTimeFromMoment } from '../helpers/date.helper';
import { ITokenInfo } from '../interfaces/tokenInfo.interface';
import { server } from '../pages/api/service';
import AppAlert from './Alert';
import { AlertProps, IAlert } from '../interfaces/alert.interface';
import { enableAlert } from '../helpers/alert.helper';
import { ModeCommentRounded } from '@material-ui/icons';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4
};

interface ITaskModalProps {
    tasks: ITask[];
    id:string;
    setTaskModal: (value: boolean) => void;
    updateTasks: () => void;
}

interface ICreateTask {
    taskId?: string;
    startTime?: string;
    endTime?: string;
    sharerId?: string;
    shareAmount?: number;
}
export default function TaskModal({ tasks , id, setTaskModal, updateTasks}: ITaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [taskId, setTaskId] = useState<string>('');
    const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [startTime, setStartTime] = useState<Moment>(moment());
    const [endTime, setEndTime] = useState<Moment>(moment());
    const [alert, setAlert] = useState<IAlert>()

    const handleTaskChange = (_: any, newInput: ITask | null) => {
        if (newInput) {
            setTaskId(newInput.id);
        }
    };

    const handleChangeDate = (newValue: Moment | null) => {
        if (newValue) {
            setDate(moment(newValue).format('YYYY-MM-DD'));
        }
    };

    const makeCreateTaskData = () => {
        let data:ICreateTask = {};
        data['taskId'] = taskId;
        data['startTime'] = getFullTimeFromMoment(date,startTime);
        data['endTime'] = getFullTimeFromMoment(date,endTime);
        data['shareAmount'] = 0;
        if(taskId === "627b0233b401d5a9e0a3fc2a" && id === "626b221d2d3e83de13103c60"){
            data['sharerId'] = "626b31cad1a1fb4bb49d38a3";
            data['shareAmount'] = 0.5;
        }
        return data;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const inputData = makeCreateTaskData()
        if(moment(inputData.endTime)<moment(inputData.startTime)){
            enableAlert(setAlert, {message:"Data final menor que data inicial", type:"error"})
            setLoading(false)
        }
        else {
            server
                .post(
                    `/user/${id}/task`,
                    inputData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then(() => {
                    enableAlert(setAlert,{message:"Tarefa criada com sucesso!", type:"success"} );
                    setTaskModal(false);
                    setLoading(false)
                    updateTasks()
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                    enableAlert(setAlert,{message:"Erro ao criar tarefa!", type:"error"} );
                });
        }

        console.log(getFullTimeFromMoment(date, startTime));
    };

    return (
        <Box component="form" sx={style} onSubmit={handleSubmit}>
            {alert?.enabled&&<AppAlert message={alert.message} type={alert.type} />}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <Autocomplete
                            disablePortal
                            id="taskId"
                            options={tasks}
                            getOptionLabel={(option) => option.name}
                            sx={{ width: 300 }}
                            renderInput={(params) => {
                                return <TextField {...params} label="Tarefa" />;
                            }}
                            onChange={handleTaskChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker
                            label="Data da tarefa"
                            inputFormat="DD/MM/yyyy"
                            value={date}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment} locale={moment.locale()}>
                        <TimePicker
                            label="Hora de início"
                            inputFormat="HH:mm"
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue ? newValue : moment())}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment} locale={moment.locale()}>
                        <TimePicker
                            label="Hora de término"
                            inputFormat="HH:mm"
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue ? newValue : moment())}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={3} md={12}>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress /> : 'Criar'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
