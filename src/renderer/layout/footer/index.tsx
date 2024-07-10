import { IconEraser } from '@arco-design/web-react/icon';
import { useDatasource } from '../../store';
import './index.css';

function Footer() {
  const records = useDatasource((state) => state.records);
  const deleteRecord = useDatasource((state) => state.deleteRecord);

  const handleClearAll = () => {
    deleteRecord();
  };

  return (
    <div className="Footer">
      {/* <IconUnorderedList className="Footer-icon" /> */}
      <IconEraser
        className="Footer-icon Footer-icon-clear"
        fontSize={10}
        onClick={() => handleClearAll()}
      />
      <div className="Footer-summary">{records.length}个项目</div>
    </div>
  );
}

export default Footer;
