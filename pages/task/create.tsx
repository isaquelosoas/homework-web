import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { isAuthorized, server } from '../../service/service';
import { ITokenInfo } from '../../interfaces/tokenInfo.interface';
import Dashboard from '../../components/Dashboard';
import Grid from '@mui/material/Grid';
import {
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { ICategory } from '../../interfaces/category.interface';
import { Box } from '@mui/system';
import { AlertProps, IAlert } from '../../interfaces/alert.interface';
import AppAlert from '../../components/Alert';
import { disableAlert, enableAlert } from '../../helpers/alert.helper';



const Task: NextPage = () => {
    const [userData, setUserData] = useState<ITokenInfo>();
    const [categories, setCategories] = useState<ICategory[] | []>([]);
    const [category, setCategory] = useState<string | ''>('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<IAlert>();

    useEffect(() => {
        const checkAuthorization = async () => {
            const response = await isAuthorized();
            if (response) {
                setUserData(response);
                const token = window.localStorage.getItem('token');
                await server
                    .get('/category', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(({ data }: { data: ICategory[] }) => {
                        setCategories(data);
                    })
                    .catch((err) => console.log(err));
            }
        };
        checkAuthorization();
    }, []);

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
    };

    const createTask = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        console.log('entreeei');
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const name = data.get('taskName');
        const categoryId = data.get('category');
        const description = data.get('taskDescription');

        const token = window.localStorage.getItem('token');
        server
            .post(
                '/task',
                {
                    name,
                    categoryId,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then(() => {
                enableAlert(setAlert, { type: 'success', message: 'Tarefa criada com sucesso' });
                setTimeout(() => {
                    disableAlert(setAlert);
                }, 3000);
            })
            .catch((err) => {
                enableAlert(setAlert, { type: 'error', message: 'Erro ao criar tarefa' });
                console.log(err);
                setTimeout(() => {
                    disableAlert(setAlert);
                }, 3000);
            });
        setLoading(false);
    };

    return (
        <>
            {userData && (
                <Dashboard userData={userData}>
                    <Typography variant="h6" gutterBottom>
                        Criar Tarefa
                    </Typography>
                    <Box component="form" onSubmit={createTask} noValidate>
                        {alert?.enabled && <AppAlert message={alert.message} type={alert.type} />}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField required id="taskName" name="taskName" label="Nome da tarefa" fullWidth autoComplete="cc-name" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">Categoria</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        name="category"
                                        value={category}
                                        label="Categoria"
                                        onChange={handleCategoryChange}
                                    >
                                        {categories.map((category: ICategory) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    required
                                    id="taskDescription"
                                    label="Descrição da tarefa"
                                    name="taskDescription"
                                    fullWidth
                                    autoComplete="cc-number"
                                />
                            </Grid>
                            <Grid item xs={3} md={12}>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? <CircularProgress /> : 'Criar'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Dashboard>
            )}
        </>
    );
};

export default Task;
