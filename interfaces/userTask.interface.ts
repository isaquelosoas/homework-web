export interface IUserTask {
    id: string;
    userId: string;
    taskId: string;
    startTime: string;
    endTime: string;
    timeSpent: number;
    sharerId: string;
    shareAmount: number;
    taskValue: number;
    pending: boolean;
    approved: boolean;
    comment: null;
    approverId: string;
    task: {
        id: string;
        name: string;
        description: string;
        meanTime: number;
        categoryId: string;
        Category: {
            id: string;
            needsApproval: boolean;
            name: string;
            color: string;
        };
    };
}
