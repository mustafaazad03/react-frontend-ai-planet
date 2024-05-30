import { useEffect, useRef } from "react";
import { useAppContext } from "../context";
import sendIcon from "../assets/send.png";
import aiLogo from "../assets/ai.svg";
import { useState } from "react";
import Loading from "./Loading";
import OnlineStatus from "../utils/OnlineStatus";
import useOnlineStatus from "../hooks/useOnlineStatus";

const Chat = () => {
	const {
		input,
		setInput,
		history,
		askQuestion,
		loading,
		pdfMetaData,
		response,
		showResult,
		newPrompt,
	} = useAppContext();
	const { isOnline } = useOnlineStatus();

	const chatEndRef = useRef(null);
	const [load, setLoad] = useState(false);

	useEffect(() => {
		// this effect is for showing initial loading for 2 seconds if the history is empty
		if (history?.length === 0 && pdfMetaData.pdf_id !== null) {
			setLoad(true);
			setTimeout(() => {
				setLoad(false);
			}, 2000);
		}

		scrollToBottom();

		return () => {
			setLoad(false);
		};
	}, [history, pdfMetaData.pdf_id]);

	const handleAsk = () => {
		if (input.trim()) {
			askQuestion(input);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAsk();
		}
	};

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [history, loading, response]);

	return (
		<div className="flex flex-col h-[90vh] pt-11 overflow-hidden w-5/6 mx-auto">
			<div className="flex flex-1 overflow-y-scroll w-full mx-auto text-wrap break-words overflow-x-hidden">
				{pdfMetaData.pdf_id !== null && pdfMetaData.pdf_id !== undefined && (
					<div className="flex-col space-y-8 flex max-w-full w-full">
						{history?.map((item, index) => (
							<div
								key={index}
								className="flex flex-col my-2 justify-start border-b border-chatBorder pb-10 rounded-lg"
							>
								<div className="flex items-center w-full">
									<div className="bg-chatBg text-white font-medium uppercase text-2xl flex justify-center items-center rounded-full w-10 h-10">
										{pdfMetaData?.name[0]}
									</div>
									<div className=" rounded-lg flex flex-wrap max-w-full text-wrap w-11/12 text-sm sm:text-base relative left-6">
										{item.question || newPrompt}
									</div>
								</div>
								<div
									className={`flex ${
										item?.response?.length > 300
											? "items-start"
											: "items-center"
									} mt-16 w-full`}
								>
									<div className="flex justify-center items-center rounded-full w-10 h-10">
										<img src={aiLogo} alt="AI Logo" />
									</div>
									<div className=" rounded-lg flex flex-wrap max-w-full  w-11/12 text-sm sm:text-base">
										<p
											dangerouslySetInnerHTML={{ __html: item.response }}
											className="flex flex-wrap text-wrap  w-11/12 relative left-6"
										></p>
									</div>
								</div>
							</div>
						))}
						{showResult && (
							<div className="flex flex-col my-2 justify-start border-b border-chatBorder pb-8 rounded-lg w-full">
								<div className="flex items-start w-full">
									<div className="bg-chatBg text-white uppercase font-medium text-2xl flex justify-center items-center rounded-full w-10 h-10 mr-6">
										{pdfMetaData?.name[0]}
									</div>
									<div className="p-2 rounded-lg max-w-full text-wrap  w-11/12 text-sm sm:text-base">
										{input || newPrompt}
									</div>
								</div>
								{loading && (response === "" || response === null) ? (
									<Loading />
								) : (
									<div
										className={`flex ${
											response?.length > 300 ? "items-start" : "items-center"
										} mt-16 w-full`}
									>
										<div className="flex justify-center items-center rounded-full w-10 h-10">
											<img src={aiLogo} alt="AI Logo" />
										</div>
										<div className="p-2 rounded-lg text-wrap max-w-full  w-11/12 text-sm sm:text-base">
											{response !== null && (
												<p
													dangerouslySetInnerHTML={{ __html: response }}
													className="flex flex-wrap text-wrap  w-11/12 relative left-6"
												></p>
											)}
										</div>
									</div>
								)}
							</div>
						)}
						<div ref={chatEndRef}></div>
					</div>
				)}
			</div>
			{load && (
				<div className="flex flex-col items-center justify-start w-11/12 h-full space-y-4">
					<div className="w-full h-1/5 bg-gray-200 rounded-lg animate-pulse"></div>
					<div className="w-full h-2/4 bg-gray-200 rounded-lg animate-pulse"></div>
				</div>
			)}
			<OnlineStatus />
			<div className="flex mb-14 mt-4 flex-shrink-0 items-center shadow-input rounded-lg border border-chatBorder">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyPress}
					disabled={
						pdfMetaData.pdf_id === null || pdfMetaData.pdf_id === undefined
					}
					placeholder="Send a message..."
					className="max-w-full placeholder:text-placeholder disabled:opacity-35 w-full p-2 bg-white px-[2.7%] h-14 outline-none disabled:bg-chatBorder disabled:cursor-auto cursor-text"
					autoFocus={!loading || input.trim()}
				/>
				<button
					onClick={handleAsk}
					disabled={
						loading ||
						!input.trim() ||
						pdfMetaData.pdf_id === null ||
						pdfMetaData.pdf_id === undefined ||
						!isOnline
					}
					className="relative right-[2%] disabled:cursor-not-allowed cursor-pointer disabled:opacity-35"
				>
					<img src={sendIcon} alt="Send Icon" />
				</button>
			</div>
		</div>
	);
};

export default Chat;
