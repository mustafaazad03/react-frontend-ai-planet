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

	const [history, setHistory] = useState([]);

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
					`${import.meta.env.VITE_BACKEND_URI}/delete-pdf/${pdfMetaData.pdf_id}`
				);
			}

			const res = await axios.post(
				`${import.meta.env.VITE_BACKEND_URI}/upload-pdf/`,
				formData
			);
			if (res.data.error) {
				throw new Error(res.data.error);
			}
			const { filename, pdf_id } = res.data;
			setPdfMetaData({ name: filename, pdf_id });
			localStorage.setItem(
				"pdfMetaData",
				JSON.stringify({ name: filename, pdf_id })
			);
			setHistory([]);
			localStorage.removeItem("chatHistory");
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
			const res = await axios.post(
				`${import.meta.env.VITE_BACKEND_URI}/ask-question/`,
				{
					pdf_id: pdfMetaData.pdf_id,
					question,
					history: historySubset,
				}
			);

			const newEntry = {
				question,
				pdfName: pdfMetaData.name,
				response: res.data.answer,
			};
			const newHistory = [...history, newEntry];
			setHistory(newHistory);
			localStorage.setItem("chatHistory", JSON.stringify(newHistory));

			const words = res.data.answer.split(" ");
			words.forEach((word, index) => delayyPara(index, word + " "));
		} catch (error) {
			console.error("Error asking question:", error);
		} finally {
			setLoading(false);
			setNewPrompt("");
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
