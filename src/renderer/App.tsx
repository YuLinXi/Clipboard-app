import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HistoryItem from './components/HistoryItem';
import './App.css';

function Hello() {
  const [historyList, setHistoryList] = useState<string[]>([]);
  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on(
      'clipboard-changed',
      (text) => {
        if (historyList.includes(text as string)) {
          return;
        }
        setHistoryList((pre) => [...pre, text as string]);
      },
    );

    return () => {
      removeListener();
    };
  }, [historyList]);
  return (
    <div className="main">
      <h1>剪切板历史记录</h1>
      <div className="historyList">
        {historyList.map((text, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <HistoryItem key={index} text={text} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
