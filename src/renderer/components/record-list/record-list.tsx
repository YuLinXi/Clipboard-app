import { useEffect } from 'react';
import { DataRecord, useDatasource } from '../../store';
import RecordCard from './record-card';

interface Props {
  listData: DataRecord[];
}

function RecordList(props: Props) {
  const { listData } = props;
  const selectedRecordId = useDatasource((state) => state.selectedRecordId);
  const deleteRecord = useDatasource((state) => state.deleteRecord);
  const setSelectedRecordId = useDatasource(
    (state) => state.setSelectedRecordId,
  );

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on(
      'record-delete',
      (record: any) => {
        deleteRecord(record.id);
      },
    );

    return () => {
      removeListener();
    };
  }, [deleteRecord]);
  return (
    <div className="RecordList">
      {listData.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          selected={record.id === selectedRecordId}
          onSelected={(id) => {
            setSelectedRecordId(id);
          }}
        />
      ))}
    </div>
  );
}

export default RecordList;
