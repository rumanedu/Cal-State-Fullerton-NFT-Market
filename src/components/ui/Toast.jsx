import { useStore } from '../../store';
import './Toast.css';

const ICONS = {
  success: '✅',
  error: '❌',
  warn: '⚠️',
  info: 'ℹ️',
};

export default function ToastContainer() {
  const { notifications } = useStore();

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className={`toast toast-${n.type}`}>
          <span className="toast-icon">{ICONS[n.type] || ICONS.info}</span>
          <span className="toast-msg">{n.msg}</span>
        </div>
      ))}
    </div>
  );
}
