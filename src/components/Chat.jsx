import { useEffect } from "react";
import { useAppContext } from "../context";
import { useRef } from "react";
import sendIcon from "../assets/send.png";
import aiLogo from "../assets/ai.svg";

const Chat = () => {
	const {
		input,
		setInput,
		history,
		askQuestion,
		loading,
		pdfMetaData,
		response,
	} = useAppContext();

	const chatEndRef = useRef(null);

	const handleAsk = () => {
		if (input.trim()) {
			askQuestion(input);
			setInput("");
		}
	};

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [history, loading]);

	return (
		<div className="flex flex-col h-[90vh] pt-11 overflow-y-auto w-5/6 mx-auto">
			<div className=" flex flex-1 flex-col space-y-8 overflow-y-scroll">
				{history.map((item, index) => (
					<div
						key={index}
						className={`flex flex-col my-2 justify-start border-b border-[#E4E8EE] pb-8 rounded-lg`}
					>
						<div className="flex items-center">
							<div className="bg-[#B0ACE9] text-white font-medium text-2xl flex justify-center items-center rounded-full w-10 h-10 mr-6">
								{item.pdfName[0]}
							</div>
							<div className="p-2 rounded-lg max-w-max text-wrap sm:w-[95%] w-5/6 text-sm sm:text-base">
								{item.question}
							</div>
						</div>
						<div className="flex items-center mt-16">
							<div className="flex justify-center items-center rounded-full w-10 h-10 mr-6">
								<img src={aiLogo} alt="AI Logo" />
							</div>
							<div className="p-2 rounded-lg text-wrap max-w-max sm:w-[95%] w-5/6 text-sm sm:text-base">
								<p>{item.response}</p>
							</div>
						</div>
					</div>
				))}
				{loading && response === "" ? (
					<div className="flex items-center my-2">
						<div className="w-10 h-10 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
						<div className="w-3/4 h-4 bg-gray-200 rounded-lg animate-pulse"></div>
						<div className="w-3/4 h-4 bg-gray-200 rounded-lg animate-pulse"></div>
						<div className="w-3/5 h-4 bg-gray-200 rounded-lg animate-pulse"></div>
					</div>
				) : (
					<p dangerouslySetInnerHTML={{ __html: response }} className=""></p>
				)}
				<div ref={chatEndRef}></div>
			</div>
			<div
				className={`flex mb-14 mt-10 flex-shrink-0 items-center shadow-input rounded-lg border border-[#E4E8EE]`}
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={
						pdfMetaData.pdf_id === null || pdfMetaData.pdf_id === undefined
					}
					placeholder="Send a message..."
					className="max-w-full placeholder:text-[#6E7583] disabled:opacity-35 w-full p-2 bg-white px-[2.7%] h-14 outline-none disabled:bg-[#E4E8EE] disabled:cursor-auto cursor-text"
					autoFocus={!loading || input.trim()}
				/>
				<button
					onClick={handleAsk}
					disabled={
						loading ||
						!input.trim() ||
						pdfMetaData.pdf_id === null ||
						pdfMetaData.pdf_id === undefined
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
