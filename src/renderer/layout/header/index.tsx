import { Input } from '@arco-design/web-react';
import {
  IconSearch,
  IconPushpin,
  // IconSettings,
} from '@arco-design/web-react/icon';
import './index.css';
import { useDatasource, useUserActions } from '../../store';

import { ReactComponent as IconPinFill } from '../../icons/pin-fill.svg';
import debounce from '../../utils/debounce';

function HeaderBar() {
  const setFixed = useUserActions((state) => state.setWindowFixed);
  const isFixed = useUserActions((state) => state.windowFixed);
  const setSearchValue = useDatasource((state) => state.setSearchValue);

  const handleFixed = (fixed: boolean) => {
    window.electron.ipcRenderer.sendMessage('window-fixed', fixed);
    setFixed(fixed);
  };

  const handleChange = debounce((e) => {
    setSearchValue(e);
  }, 500);

  return (
    <div className="HeaderBar">
      <div className="HeaderBar-left">
        {isFixed ? (
          <IconPinFill
            className="arco-icon"
            style={{ fontSize: '15px' }}
            onClick={() => handleFixed(false)}
          />
        ) : (
          <IconPushpin
            style={{ fontSize: '15px' }}
            onClick={() => handleFixed(true)}
          />
        )}
      </div>
      <div className="HeaderBar-search">
        <Input
          className="HeaderBar-input"
          prefix={<IconSearch />}
          size="mini"
          placeholder="请输入开始搜索..."
          onChange={handleChange}
        />
      </div>
      <div className="HeaderBar-right">
        {/* <IconSettings style={{ fontSize: '15px' }} /> */}
      </div>
    </div>
  );
}

export default HeaderBar;
