import { useApp } from '../context/AppContext';

export default function Toast() {
  const { state } = useApp();
  const { showSyncToast, syncToastMessage } = state;

  if (!showSyncToast) return null;

  return (
    <div className="toast-container" id="toast-container">
      <div className="toast" role="alert" aria-live="assertive">
        {syncToastMessage}
      </div>
    </div>
  );
}
