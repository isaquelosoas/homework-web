import { Box, Button, CircularProgress, FormControl, Grid, TextField } from '@mui/material';
import { FormEvent, forwardRef, useState } from 'react';
import AppAlert from './Alert';
import { AlertProps, IAlert } from '../interfaces/alert.interface';
import NumberFormat from 'react-number-format';
import { server } from '../pages/api/service';
import { getTokenInfo } from '../helpers/token.helper';
import { enableAlert } from '../helpers/alert.helper';

interface IWithdrawModalProps {
    id: string;
    closeModal: () => void;
    updateUser: () => void;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumberFormatCustom = forwardRef<NumberFormat<CustomProps>, CustomProps>(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            decimalSeparator=","
            isNumericString
            decimalScale={2}
            fixedDecimalScale={true}
            defaultValue={0.0}
            prefix="R$"
        />
    );
});

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

export default function WithdrawModal({ id, closeModal, updateUser }: IWithdrawModalProps) {
    const [alert, setAlert] = useState<IAlert>();
    const [loading, setLoading] = useState(false);
    const [numberFormat, setNumberFormat] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberFormat(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        console.log(numberFormat);
        const { token } = await getTokenInfo();
        await server
            .post(
                `withdraw`,
                {
                    userId: id,
                    amount: parseFloat(numberFormat)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(() => {
                updateUser();
                enableAlert(setAlert, { type: 'success', message: 'Saque realizado com sucesso!' });
                setLoading(false);
                closeModal();
            })
            .catch((err) => {
                const {
                    response: {
                        data: { message }
                    }
                } = err;
                enableAlert(setAlert, { type: 'error', message: `Erro ao realizar o saque! ${message}` });
                setLoading(false);
            });
    };
    return (
        <Box component="form" sx={style} onSubmit={handleSubmit}>
             {alert?.enabled&&<AppAlert message={alert.message} type={alert.type} />} 
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <TextField
                            label="Qtd."
                            value={numberFormat}
                            onChange={handleChange}
                            name="numberformat"
                            id="formatted-numberformat-input"
                            InputProps={{
                                inputComponent: NumberFormatCustom as any
                            }}
                            variant="standard"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={3} md={12}>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress /> : 'Sacar'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
