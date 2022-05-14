import { IHistoryData } from '../interfaces/history.interface';
import { IUserTask } from '../interfaces/userTask.interface';
import { IWithdraw } from '../interfaces/withdraw.interface';

export function getHistoryData(tasks: IUserTask[], withdrawals: IWithdraw[]): IHistoryData[] {
    const approvedTasks = formatTask(tasks.filter((task) => task.approved && !task.pending));
    const approvedWithdrawals = formatWithdraw(withdrawals.filter((withdrawal) => withdrawal.status === 'success'));

    return [...approvedTasks, ...approvedWithdrawals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function formatTask(tasks: IUserTask[]): IHistoryData[] {
    return tasks.map((task) => {
        return {
            amount: task.taskValue,
            date: task.startTime,
            type: 'deposit',
            id: task.id
        };
    });
}

function formatWithdraw(withdrawals: IWithdraw[]): IHistoryData[] {
    return withdrawals.map((withdrawal) => {
        return {
            amount: withdrawal.amount,
            date: withdrawal.createdAt,
            type: 'withdraw',
            id: withdrawal.id
        };
    });
}
