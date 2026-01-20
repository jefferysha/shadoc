import { useKanban } from '@/stores/useKanban';
import { Task } from './Task';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { KanbanGroup } from './KanbanGroup';
import { Button } from '../ui/button';

export const Board = () => {
    const { boards, updateBoard, moveTask } = useKanban();
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        // console.log('🚀 ~ Board ~ active, over:', active, over);
        const { id } = active;
        const [gId, tId] =
            typeof id === 'number'
                ? [id.toString(), id.toString()]
                : id.split('-');

        moveTask(tId, gId, over?.id as string);
    };
    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-row">
                {boards.map(board => (
                    <div key={board.groupId} className="flex flex-row">
                        <KanbanGroup
                            groupId={board.groupId}
                            title={board.groupName}
                        >
                            <div className="kanban-group p-2 mr-1 w-[260px] rounded-xl bg-blue-100">
                                <div className="flex flex-col">
                                    <div className="w-fit rounded-full bg-blue-200 px-1 mb-2">
                                        未开始
                                    </div>
                                    <div>
                                        {board.tasks.map(item => (
                                            <Task
                                                key={item.id}
                                                id={`${board.groupId}-${item.id}`}
                                                title={item.title}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    updateBoard({
                                        groupId: board.groupId,
                                        groupName: board.groupName,
                                        tasks: [
                                            ...board.tasks,
                                            {
                                                id: board.tasks.length,
                                                title: '新任务'
                                            }
                                        ]
                                    });
                                }}
                            >
                                创建任务
                            </Button>
                        </KanbanGroup>
                    </div>
                ))}
            </div>
        </DndContext>
    );
};
