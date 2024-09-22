import { useState } from 'react';
import './App.css';
import { TodoProvider } from './contexts';
import { useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };
  const updatedTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo))
    );
  };
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('todos'));
    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  return (
    <TodoProvider
      value={{ todos, addTodo, updatedTodo, deleteTodo, toggleComplete }}
    >
      <div className="bg-[#172842] min-h-screen flex flex-col py-8">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col shadow-lg rounded-lg px-6 py-4 text-white">
          <h1 className="text-3xl font-bold text-center mb-8 mt-2">
            Manage Your Todos
          </h1>
          <div className="mb-6">
            {/* Todo form goes here */}
            <TodoForm />
          </div>
          <div className="flex flex-col gap-y-4 overflow-y-auto">
            {/* Loop and Add TodoItem here */}
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} todos={todos} />
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
