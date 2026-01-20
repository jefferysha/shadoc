import { create } from 'zustand';

type Task = {
    id: number | string;
    title: string;
};

interface Board {
    groupId: string;
    groupName: string;
    tasks: Task[];
}

export const useKanban = create<{
    boards: Board[];
    createBoard: (board: Board) => void;
    updateBoard: (board: Board) => void;
    moveTask: (
        taskId: string,
        sourceGroupId: string,
        targetGroupId: string
    ) => void;
}>(set => ({
    boards: [],
    createBoard: board => set(state => ({ boards: [...state.boards, board] })),
    updateBoard: board =>
        set(state => ({
            boards: state.boards.map(b =>
                b.groupId === board.groupId ? board : b
            )
        })),
    moveTask: (taskId, sourceGroupId, targetGroupId) =>
        set(state => ({
            boards: state.boards.map(board => {
                if (board.groupId === sourceGroupId) {
                    board.tasks = board.tasks.filter(
                        task => task.id !== taskId
                    );
                }
                if (board.groupId === targetGroupId) {
                    board.tasks.push({ id: taskId, title: 'new task' });
                }
                return board;
            })
        }))
}));
