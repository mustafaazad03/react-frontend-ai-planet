import axios from "axios";
import { useContext, useEffect, useState, createContext } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
	const [input, setInput] = useState("");

	const [loading, setLoading] = useState(false);

	const [response, setResponse] = useState("");

	const [newPrompt, setNewPrompt] = useState("");

	const [pdfMetaData, setPdfMetaData] = useState({
		name: null,
		pdf_id: null,
	});

	const [history, setHistory] = useState([
		// sample data
		{
			question:
				"Our own Large Language Model (LLM) is a type of Al that can learn from data. We have trained it on 7 billion parameters which makes it better than other LLMs. We are featured on aiplanet.com and work with leading enterprises to help them use Al securely and privately. We have a Generative Al Stack which helps reduce the hallucinations in LLMs and allows enterprises to use Al in their applications.",
			pdfName: "sample.pdf",
			response:
				"Our own Large Language Model (LLM) is a type of Al that can learn from data. We have trained it on 7 billion parameters which makes it better than other LLMs. We are featured on aiplanet.com and work with leading enterprises to help them use Al securely and privately. We have a Generative Al Stack which helps reduce the hallucinations in LLMs and allows enterprises to use Al in their applications.",
		},
		{
			question: "What is the capital of USA?",
			pdfName: "sample.pdf",
			response: "Washington D.C.",
		},
	]);

	useEffect(() => {
		const pdfMetadata = localStorage.getItem("pdfMetaData");
		if (pdfMetadata) {
			setPdfMetaData(JSON.parse(pdfMetadata));
		}

		const chatHistory = localStorage.getItem("chatHistory");
		if (chatHistory) {
			setHistory(JSON.parse(chatHistory));
		}
	}, []);

	const uploadPdf = async (file) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			if (pdfMetaData.pdf_id !== null && pdfMetaData.pdf_id !== undefined) {
				await axios.delete(
					`${process.env.BACKEND_URI}/delete-pdf/${pdfMetaData.pdf_id}`
				);
			}

			const res = await axios.post("/upload-pdf/", formData);
			setPdfMetaData(res.data);
			setHistory([]);
		} catch (error) {
			console.error("Error uploading PDF:", error);
		} finally {
			setLoading(false);
		}
	};

	const askQuestion = async (question) => {
		if (loading) return;

		setLoading(true);
		setResponse("");

		const historySubset = history.slice(-2);

		try {
			const res = await axios.post(`${process.env.BACKEND_URI}/ask-question/`, {
				pdf_id: pdfMetaData.pdf_id,
				question,
				history: historySubset,
			});

			setHistory((prev) => [
				...prev,
				{ question, pdfName: pdfMetaData.name, response: res.data.answer },
			]);

			const words = res.data.answer.split(" ");
			words.forEach((word, index) => delayyPara(index, word + " "));
		} catch (error) {
			console.error("Error asking question:", error);
		} finally {
			setLoading(false);
			newPrompt("");
			setResponse("");
		}
	};

	//Logic for typing effect : Hoisting
	const delayyPara = (index, nextWord) => {
		setTimeout(function () {
			setResponse((prev) => prev + nextWord);
		}, 70 * index);
	};

	const contextValues = {
		loading,
		setLoading,
		input,
		setInput,
		pdfMetaData,
		setPdfMetaData,
		response,
		setResponse,
		history,
		setHistory,
		newPrompt,
		setNewPrompt,
		uploadPdf,
		askQuestion,
	};

	return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useAppContext = () => {
	return useContext(Context);
};

export default ContextProvider;
