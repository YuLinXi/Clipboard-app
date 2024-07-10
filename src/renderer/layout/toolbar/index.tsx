import './index.css';

function Toolbar() {
  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('window-visible');
  };
  const handleMini = () => {
    window.electron.ipcRenderer.sendMessage('window-resizable', 'mini');
  };

  return (
    <div className="Toolbar">
      <div className="Toolbar-icon-group">
        <div onClick={handleClose} className="Toolbar-close">
          <span className="Toolbar-close-icon">x</span>
        </div>
        <div onClick={handleMini} className="Toolbar-mini">
          <span className="Toolbar-mini-icon">-</span>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
