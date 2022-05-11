import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { isAuthorized, server } from '../api/service';
import { ITokenInfo } from '../../interfaces/tokenInfo.interface';
import Dashboard from '../../components/Dashboard';
import Grid from '@mui/material/Grid';
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { AlertProps, IAlert } from '../../interfaces/alert.interface';
import AppAlert from '../../components/Alert';
import { disableAlert, enableAlert } from '../../helpers/alert.helper';



const CreateCategory: NextPage = () => {
    const [userData, setUserData] = useState<ITokenInfo>();
    const [needsApproval, setNeedsApproval] = useState<boolean>(true);
    const [color, setColor] = useState<string | ''>('#4169E1');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<IAlert>();

    useEffect(() => {
        const checkAuthorization = async () => {
            const response = await isAuthorized();
            if (response) {
                setUserData(response);
            }
        };
        checkAuthorization();
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value==="false"?false:true;
        setNeedsApproval(value);
    };

    const createTask = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        console.log('entreeei');
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const name = data.get('name');

        const token = window.localStorage.getItem('token');
        server
            .post(
                '/category',
                {
                    name,
                    needsApproval,
                    color
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then(() => {
                enableAlert(setAlert, { type: 'success', message: 'Categoria criada com sucesso' });
                setTimeout(() => {
                    disableAlert(setAlert);
                }, 3000);
            })
            .catch((err) => {
                enableAlert(setAlert, { type: 'error', message: 'Erro ao criar categoria' });
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
                        Criar Categoria
                    </Typography>
                    <Box component="form" onSubmit={createTask} noValidate>
                        {alert?.enabled && <AppAlert message={alert.message} type={alert.type} />}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField required id="name" name="name" label="Nome da categoria" fullWidth autoComplete="cc-name" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="needsApproval-label">Precisa de Aprovação</InputLabel>
                                    <Select
                                        labelId="needsApproval-label"
                                        id="needsApproval"
                                        name="needsApproval"
                                        value={`${needsApproval}`}
                                        label="Precisa de aprovação"
                                        defaultValue='true'
                                        onChange={handleChange}
                                    >
                                            <MenuItem value="true">
                                                Sim
                                            </MenuItem>                                        
                                            <MenuItem value="false">
                                                Não
                                            </MenuItem>                                        
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel id="needsApproval-label">Cor</InputLabel>
                                <input
                                    value={color}
                                    type="color"
                                    required
                                    id="color"
                                    name="color"
                                    onChange={(e) => setColor(e.target.value)}
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

export default CreateCategory;
