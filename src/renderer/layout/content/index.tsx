import { useEffect, useMemo } from 'react';
import { useDatasource } from '../../store';

import './index.css';
import RecordList from '../../components/record-list/record-list';

function Content() {
  const records = useDatasource((state) => state.records);
  const search = useDatasource((state) => state.search);
  const addRecord = useDatasource((state) => state.addRecord);

  const filterDataSource = useMemo(
    () =>
      search
        ? records.filter((record) => record.text.includes(search))
        : records,
    [search, records],
  );
  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on(
      'clipboard-changed',
      (text) => {
        if (records.find((record) => record.text === text)) {
          return;
        }
        if (text && !/^\s*$/.test(text)) {
          addRecord(text);
        }
      },
    );

    return () => {
      removeListener();
    };
  }, [records, addRecord]);

  return (
    <div className="Content">
      <div>
        <RecordList listData={filterDataSource} />
      </div>
    </div>
  );
}

export default Content;
