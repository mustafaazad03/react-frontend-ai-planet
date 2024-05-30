import aiLogo from "../assets/ai.svg";

const Loading = () => {
	return (
		<div className="flex items-start mt-16 w-full">
			<div className="flex justify-center items-center rounded-full w-10 h-10">
				<img src={aiLogo} alt="AI Logo" />
			</div>
			<div className="flex flex-col space-y-5 max-w-full  w-11/12 relative left-6">
				<div className="w-full h-8 bg-gray-200 rounded-lg animate-pulse"></div>
				<div className="w-full h-8 bg-gray-200 rounded-lg animate-pulse"></div>
				<div className="w-9/12 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
			</div>
		</div>
	);
};

export default Loading;
