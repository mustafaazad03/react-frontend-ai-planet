import { useEffect, useState } from "react";

const useOnlineStatus = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [showStatus, setShowStatus] = useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			setShowStatus(true);
			setTimeout(() => {
				setShowStatus(false);
			}, 2000);
		};
		const handleOffline = () => {
			setIsOnline(false);
			setShowStatus(true);
			setTimeout(() => {
				setShowStatus(false);
			}, 2000);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return { isOnline, showStatus };
};

export default useOnlineStatus;
