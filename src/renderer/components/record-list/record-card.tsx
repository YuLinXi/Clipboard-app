import { useMemo } from 'react';
import dayjs from 'dayjs';
import isYesterday from 'dayjs/plugin/isYesterday';
import isToday from 'dayjs/plugin/isToday';
import { DataRecord } from '../../store';
import './index.css';

dayjs.extend(isYesterday);
dayjs.extend(isToday);

interface Props {
  record: DataRecord;
  selected: boolean;
  onSelected: (uid: string) => void;
}

function RecordCard(props: Props) {
  const { record, onSelected = () => {}, selected = true } = props;
  const handleDoubleClick = () => {
    onSelected(record.id);
    window.electron.ipcRenderer.sendMessage('paste-text', record.text);
  };

  const handleClick = () => {
    onSelected(record.id);
  };

  const onContextMenu = () => {
    onSelected(record.id);
    window.electron.ipcRenderer.sendMessage('context-menu', record);
  };

  const timeFormatStr = useMemo(() => {
    const time = dayjs(record.createTime);
    if (time.isToday()) {
      return time.format('HH:mm');
    }
    if (time.isYesterday()) {
      return time.format('昨日');
    }
    return time.format('更早');
  }, [record.createTime]);

  return (
    <div
      className="RecordCard"
      onDoubleClick={() => handleDoubleClick()}
      data-select={selected}
      onContextMenu={() => onContextMenu()}
      onClick={() => handleClick()}
    >
      <div className="RecordCard-text">{record.text}</div>
      <span className="RecordCard-time">{timeFormatStr}</span>
    </div>
  );
}

export default RecordCard;
