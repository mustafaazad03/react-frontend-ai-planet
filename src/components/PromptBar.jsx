import { useAppContext } from "../context";
import useOnlineStatus from "../hooks/useOnlineStatus";
import sendIcon from "../assets/send.png";

const PromptBar = () => {
	const { input, setInput, pdfMetaData, loading, askQuestion } =
		useAppContext();
	const { isOnline } = useOnlineStatus();

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

	return (
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
				autoFocus
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
	);
};

export default PromptBar;
