import { useState, useEffect } from 'react';
import { CheckIcon, XIcon } from './Icons';

let toastListeners = [];
let toastId = 0;

export const toast = {
  success: (msg) => emit({ type: 'success', msg }),
  error: (msg) => emit({ type: 'error', msg }),
  info: (msg) => emit({ type: 'info', msg }),
};

function emit(data) {
  const id = toastId++;
  toastListeners.forEach(fn => fn({ ...data, id }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3000);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter(fn => fn !== handler); };
  }, []);

  const colors = {
    success: 'bg-leaf-600 border-leaf-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500',
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white border shadow-2xl animate-fade-up ${colors[t.type]}`}>
          <CheckIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">{t.msg}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="opacity-70 hover:opacity-100">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
