import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import './toast.css';

interface CustomToastProps {
  message: string[];
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomToast: React.FC<CustomToastProps> = ({
  message,
  title,
  open,
  setOpen,
}) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">{title}</Toast.Title>
        <Toast.Description>
          <ul>
            {message.map((msg, index) => (
              <li key={index} className="ToastDescription">
                {msg}
              </li>
            ))}
          </ul>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default CustomToast;
