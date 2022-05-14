export interface IHistoryData {
    id: string;
    type: 'withdraw' | 'deposit';
    amount: number;
    date: string;
}
