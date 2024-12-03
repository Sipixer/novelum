import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="p-2 border rounded flex items-center" style={style}>
      <div ref={setNodeRef} {...listeners} {...attributes}>
        <GripVertical className="h-6 w-6 mr-2" />
      </div>
      {children}
    </div>
  );
}
