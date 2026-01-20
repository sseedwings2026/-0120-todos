
import React from 'react';
import { Todo } from '../types';
import { CheckCircle, Circle, Trash2, AlertCircle } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`group flex items-center justify-between p-4 mb-3 bg-white border rounded-xl shadow-sm transition-all hover:shadow-md ${todo.is_completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center space-x-4 flex-1">
        <button 
          onClick={() => onToggle(todo.id, !todo.is_completed)}
          className="transition-transform active:scale-90"
        >
          {todo.is_completed ? (
            <CheckCircle className="w-6 h-6 text-green-500 fill-current" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400" />
          )}
        </button>
        <div className="flex flex-col">
          <span className={`text-lg ${todo.is_completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
            {todo.title}
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            {todo.category && (
              <span className="text-[10px] text-slate-400"># {todo.category}</span>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={() => onDelete(todo.id)}
        className="text-slate-300 hover:text-red-500 transition-colors p-2"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TodoItem;
