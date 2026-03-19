import { useApp } from '../context/AppContext';

export default function UpdateBanner() {
  const { state, dispatch } = useApp();
  const { showUpdateBanner, swRegistration } = state;

  if (!showUpdateBanner) return null;

  const handleUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
    dispatch({ type: 'SET_SHOW_UPDATE_BANNER', payload: false });
  };

  return (
    <div className="update-banner" id="update-banner" role="alert">
      <span>🔄 A new version is available!</span>
      <button onClick={handleUpdate} id="update-now-btn">Update Now</button>
    </div>
  );
}
