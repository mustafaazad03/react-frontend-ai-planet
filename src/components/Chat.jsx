import { useEffect, useRef } from "react";
import { useAppContext } from "../context";
import aiLogo from "../assets/ai.svg";
import { useState } from "react";
import Loading from "./Loading";
import OnlineStatus from "../utils/OnlineStatus";
import PromptBar from "./PromptBar";

/**
 * React component managing and displaying a chat interface.
 * Handles chat history, user input, AI responses, loading states, and online status.
 */
const Chat = () => {
	const {
		input,
		history,
		loading,
		pdfMetaData,
		response,
		showResult,
		newPrompt,
	} = useAppContext();

	const chatEndRef = useRef(null);
	const [load, setLoad] = useState(false);

	/**
	 * Scrolls to the bottom of the chat.
	 */
	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (history?.length === 0 && pdfMetaData.pdf_id) {
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

	useEffect(() => {
		scrollToBottom();
	}, [history, showResult]);

	return (
		<div className="flex flex-col h-[90vh] pt-11 overflow-hidden w-5/6 mx-auto">
			<div className="flex flex-1 overflow-y-scroll w-full mx-auto text-wrap break-words overflow-x-hidden">
				{pdfMetaData.pdf_id && (
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
									<div className="rounded-lg flex flex-wrap max-w-full text-wrap w-11/12 text-sm sm:text-base relative left-6">
										{item?.question}
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
									<div className="rounded-lg flex flex-wrap max-w-full w-11/12 text-sm sm:text-base">
										<p
											dangerouslySetInnerHTML={{ __html: item?.response }}
											className="flex flex-wrap text-wrap w-11/12 relative left-6"
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
									<div className="p-2 rounded-lg max-w-full text-wrap w-11/12 text-sm sm:text-base">
										{input || newPrompt}
									</div>
								</div>
								{loading && (!response || response === "") ? (
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
										<div className="p-2 rounded-lg text-wrap max-w-full w-11/12 text-sm sm:text-base">
											{response && (
												<p
													dangerouslySetInnerHTML={{ __html: response }}
													className="flex flex-wrap text-wrap w-11/12 relative left-6"
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
			<PromptBar />
		</div>
	);
};

export default Chat;
