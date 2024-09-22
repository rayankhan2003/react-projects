import React, { useState, useRef } from 'react';
import { useTodo } from '../contexts/TodoContext';

function TodoForm() {
  const [todo, setTodo] = useState('');
  const { addTodo } = useTodo();
  const inputRef = useRef(null);

  const add = (e) => {
    e.preventDefault();

    const trimmedTodo = todo.trim();
    if (!trimmedTodo) return;

    addTodo({ todo: trimmedTodo, completed: false });
    setTodo('');
    inputRef.current.focus(); // Focus the input field after submission
  };

  return (
    <form
      onSubmit={add}
      className="flex gap-2 p-2 bg-gray-100 rounded-lg shadow-md"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Write a new todo..."
        className="w-full px-4 py-2 text-lg border-none rounded-lg outline-none text-gray-900 bg-gray-300 focus:ring-2 focus:ring-green-400"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Add Todo"
      >
        Add
      </button>
    </form>
  );
}

export default TodoForm;
