export interface IWithdraw {
    id: string;
    userId: string;
    previousBalance: number;
    amount: number;
    newBalance: number;
    status: string;
    createdAt: string;
}
