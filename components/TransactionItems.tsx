import { Grid, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Fragment } from 'react';
import { formatDate } from '../helpers/date.helper';
import { IHistoryData } from '../interfaces/history.interface';
import Title from './Title';

interface ITransactionItemsProps {
    transactions: IHistoryData[];
}

export default function TransactionItems({ transactions }: ITransactionItemsProps) {
    return (
        <Fragment>
            <Grid container spacing={3}>
                <Grid item xs={10} md={10} lg={10}>
                    <Title>Recent Transactions</Title>
                </Grid>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Valor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow
                            key={transaction.id}
                            sx={{
                                backgroundColor: transaction.type === 'deposit' ? '#cfffba' : '#f5b3a9'
                            }}
                        >
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{formatDate(transaction.date)}</TableCell>
                            <TableCell>{`${transaction.type === 'deposit' ? 'Depósito' : 'Saque'}`}</TableCell>
                            <TableCell>{`${
                                transaction.type === 'deposit' ? transaction.amount.toFixed(2) : (transaction.amount * -1).toFixed(2)
                            }`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" sx={{ mt: 3 }}>
                See more transactions
            </Link>
        </Fragment>
    );
}
