import './HistoryItem.css';

interface Props {
  text: string;
}

function HistoryItem(props: Props) {
  const { text } = props;
  const handleSelect = () => {
    window.electron.ipcRenderer.sendMessage('paste-text', text);
  };
  return (
    <div onClick={() => handleSelect()} className="HistoryItem">
      {text}
    </div>
  );
}

export default HistoryItem;
