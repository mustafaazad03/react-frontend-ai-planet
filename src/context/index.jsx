import axios from "axios";
import { useContext, useEffect, useState, createContext } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [pdfMetaData, setPdfMetaData] = useState({
		name: null,
		pdf_id: null,
	});
	const [history, setHistory] = useState([]);
	const [newPrompt, setNewPrompt] = useState("");
	const [showResult, setShowResult] = useState(false);
	useEffect(() => {
		const pdfMetadata = localStorage.getItem("pdfMetaData");
		if (pdfMetadata) {
			setPdfMetaData(JSON.parse(pdfMetadata));
		}
	}, []);

	useEffect(() => {
		const fetchHistory = async (pdf_id) => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URI}/get-history/${pdf_id}`
				);
				setHistory(response.data.history);
			} catch (error) {
				console.error("Error fetching history:", error);
			}
		};

		if (pdfMetaData.pdf_id) {
			fetchHistory(pdfMetaData.pdf_id);
		}
	}, [pdfMetaData.pdf_id]);

	const uploadPdf = async (file) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			// if pdf file is more than 5MB then return
			if (file.size > 5 * 1024 * 1024) {
				throw new Error("File size should be less than 5MB");
			}
			if (
				pdfMetaData.pdf_id !== null &&
				pdfMetaData.pdf_id !== undefined &&
				pdfMetaData.name !== file.name
			) {
				try {
					await axios.delete(
						`${import.meta.env.VITE_BACKEND_URI}/delete-pdf/${
							pdfMetaData.pdf_id
						}`
					);
					console.log("Previous PDF deleted");
					setPdfMetaData({ name: null, pdf_id: null });
					localStorage.removeItem("pdfMetaData");
					setHistory([]);
					setInput("");
					setResponse(null);
				} catch (error) {
					throw new Error("Error deleting previous PDF");
				}
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
		} catch (error) {
			console.error("Error uploading PDF:", error);
		} finally {
			setLoading(false);
		}
	};

	const askQuestion = async (question) => {
		if (loading) return;
		setNewPrompt(question);
		setResponse(null);
		setLoading(true);
		setShowResult(true);
		setInput("");

		const historySubset = history.slice(-3);

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_BACKEND_URI}/ask-question/`,
				{
					pdf_id: pdfMetaData.pdf_id,
					question,
					history: historySubset,
				}
			);
			displayResponseWithAnimation(res.data.answer);
			const newEntry = {
				question: newPrompt,
				pdfName: pdfMetaData.name,
				response: res.data.answer,
			};
			const newHistory = [...history, newEntry];
			setShowResult(false);
			setResponse(null);
			setHistory(newHistory);
		} catch (error) {
			console.error("Error asking question:", error);
		}
	};

	const delayPara = (index, nextWord) => {
		setTimeout(() => {
			setResponse((prev) => prev + nextWord);
		}, 100 * index);
	};

	const displayResponseWithAnimation = (formattedResponse) => {
		setLoading(false);
		setResponse("");
		const newResponseArray = formattedResponse.split(" ");
		newResponseArray.forEach((word, index) => {
			delayPara(index, word + " ");
		});
		setResponse(null);
		setInput("");
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
		uploadPdf,
		askQuestion,
		setNewPrompt,
		newPrompt,
		showResult,
	};

	return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useAppContext = () => {
	return useContext(Context);
};

export default ContextProvider;
