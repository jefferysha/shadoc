import { useDraggable } from '@dnd-kit/core';

interface TaskProps {
    id: number | string;
    title: string;
}

export const Task = (props: TaskProps) => {
    const { id, title } = props;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            type: 'task'
        }
    });
    const style: React.CSSProperties | undefined = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="p-2 mb-1 bg-white border-gray-100 rounded-md"
        >
            {title}
        </div>
    );
};
