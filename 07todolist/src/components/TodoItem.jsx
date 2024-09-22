import React, { useState, useRef } from 'react';
import { useTodo } from '../contexts/TodoContext';
import confetti from 'canvas-confetti';

function TodoItem({ todo, todos }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.todo);
  const { updatedTodo, deleteTodo, toggleComplete } = useTodo();
  const inputRef = useRef(null);

  const editTodo = () => {
    if (todoMsg.trim() === '') return;
    updatedTodo(todo.id, { ...todo, todo: todoMsg });
    setIsTodoEditable(false);
  };

  const toggleCompleted = () => {
    toggleComplete(todo.id);
    const allCompleted = todos.every((t) => t.completed || t.id === todo.id);
    if (allCompleted) {
      triggerFireworks();
    }
  };

  const handleEditClick = () => {
    if (todo.completed) return;
    if (isTodoEditable) {
      editTodo();
    } else {
      setIsTodoEditable(true);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id);
    }
  };

  const triggerFireworks = () => {
    confetti({
      particleCount: 150,
      spread: 500,
      startVelocity: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 mb-4 text-lg rounded-lg shadow-lg transition-colors duration-300 ${
        todo.completed
          ? 'bg-green-100 text-gray-600'
          : 'bg-purple-300 text-gray-800'
      }`}
    >
      <input
        type="checkbox"
        className="w-6 h-6 cursor-pointer accent-green-600"
        checked={todo.completed}
        onChange={toggleCompleted}
      />
      <input
        ref={inputRef}
        type="text"
        className={`flex-1 px-3 py-2 bg-transparent border-b-2 outline-none transition-colors duration-300 ${
          isTodoEditable ? 'border-purple-500' : 'border-transparent'
        } ${todo.completed ? 'line-through text-gray-500' : ''}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
      />
      <button
        className={`p-2 text-lg rounded-lg transition-colors duration-300 ${
          isTodoEditable
            ? 'text-purple-700 hover:text-purple-900'
            : 'text-purple-600 hover:text-purple-800'
        } ${todo.completed ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleEditClick}
        disabled={todo.completed}
        aria-label={isTodoEditable ? 'Save Todo' : 'Edit Todo'}
      >
        {isTodoEditable ? '💾' : '✏️'}
      </button>
      <button
        className="p-2 text-lg text-red-600 hover:text-red-800"
        onClick={handleDeleteClick}
        aria-label="Delete Todo"
      >
        ❌
      </button>
    </div>
  );
}

export default TodoItem;
