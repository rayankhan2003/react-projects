import { useState } from 'react';

function App() {
  const [color, setColor] = useState('olive');
  return (
    <div
      className="w-full h-screen duration-200"
      style={{ backgroundColor: color }}
    >
      <div className="fixed flex flex-wrap bottom-12  justify-center inset-x-0 px-2">
        <div
          className="flex flex-wrap justify-center gap-3 shadow-lg bg-white
        px-2 py-2 rounded-3xl"
        >
          <button
            className="outline-none rounded-full px-4 py-1 text-white shadow-sm"
            style={{ backgroundColor: 'red' }}
            onClick={() => {
              setColor('red');
            }}
          >
            {' '}
            Red
          </button>
          <button
            className="outline-none rounded-full px-4 py-1 text-white shadow-sm"
            style={{ backgroundColor: 'blue' }}
            onClick={() => {
              setColor('blue');
            }}
          >
            {' '}
            blue
          </button>
          <button
            className="outline-none rounded-full px-4 py-1 text-white shadow-sm"
            style={{ backgroundColor: 'green' }}
            onClick={() => {
              setColor('green');
            }}
          >
            {' '}
            green
          </button>
          <button
            className="outline-none rounded-full px-4 py-1 text-white shadow-sm"
            style={{ backgroundColor: 'yellow' }}
          >
            {' '}
            yellow
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
