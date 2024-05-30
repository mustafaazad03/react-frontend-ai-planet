import useOnlineStatus from "../hooks/useOnlineStatus";

const OnlineStatus = () => {
	const { isOnline, showStatus } = useOnlineStatus();
	if (!showStatus) return null;
	return (
		<div
			className={`relative transition-all duration-300 ease-in-out ${
				!isOnline ? "bg-red-500" : "bg-green-500"
			} lg:w-1/5 sm:w-2/6 w-2/4 text-center rounded-xl p-1 mt-8 mx-auto text-sm`}
		>
			You are now {isOnline ? "Online" : "Offline"}
		</div>
	);
};

export default OnlineStatus;
