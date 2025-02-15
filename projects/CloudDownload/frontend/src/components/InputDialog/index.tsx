import { Input, Modal } from 'antd';
import type React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

let inputDialog: ReactDOM.Root | null = null;

interface IProps {
  visible: boolean;
  title: string;
  onOk: (val: string) => Promise<unknown>;
  onClose?: (isInitiative?: boolean) => Promise<void>;
}

export const InputDialog: React.FC<IProps> & {
  open: (props: Omit<IProps, 'visible'>) => void;
  close: () => void;
} = ({ title, onOk, onClose, visible }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(visible);
  const [inputValue, setInputValue] = useState('');

  const handleOk = useCallback(() => {
    setConfirmLoading(true);
    onOk(inputValue)
      .then(() => {
        setConfirmLoading(false);
        handleCancel(false);
      })
      .catch(() => {
        setConfirmLoading(false);
      });
  }, [inputValue, onOk]);

  const handleCancel = useCallback(
    (isInitiative = true) => {
      setOpen(false);
      onClose?.(isInitiative);
    },
    [onClose],
  );

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => handleCancel()}
        cancelText={'取消'}
        okText={'确认'}
        okButtonProps={{
          disabled: !inputValue,
        }}
      >
        <Input
          defaultValue={inputValue}
          onChange={(val) => setInputValue(val.target.value)}
        />
      </Modal>
    </>
  );
};

InputDialog.open = (props: Omit<IProps, 'visible'>) => {
  if (!inputDialog) {
    const mount = document.createElement('div');
    document.body.appendChild(mount);
    inputDialog = ReactDOM.createRoot(mount);
    const onClose = (isInitiative = true) => {
      return isInitiative && props.onClose
        ? props.onClose().then(() => {
            setTimeout(() => {
              InputDialog.close?.();
            }, 1000);
          })
        : Promise.resolve().then(() => {
            setTimeout(() => {
              InputDialog.close?.();
            }, 1000);
          });
    };

    inputDialog.render(<InputDialog {...props} visible onClose={onClose} />);
  }
};

InputDialog.close = () => {
  if (inputDialog) {
    inputDialog.unmount();
    inputDialog = null;
  }
};
