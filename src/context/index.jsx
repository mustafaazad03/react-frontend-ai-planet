import axios from "axios";
import { useContext, useEffect, useState, createContext } from "react";
import toast from "react-hot-toast";

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
			toast.loading("Fetching history...");
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URI}/get-history/${pdf_id}`
				);
				toast.dismiss();
				toast.success("History fetched successfully");
				setHistory(response.data.history);
			} catch (error) {
				toast.error("Error fetching history");
				console.error("Error fetching history:", error);
			}
		};

		if (pdfMetaData.pdf_id) {
			fetchHistory(pdfMetaData.pdf_id);
		}
	}, [pdfMetaData.pdf_id]);

	const uploadPdf = async (file) => {
		if (file.type !== "application/pdf") {
			toast.error("Unsupported file type. Please upload a PDF file.");
			throw new Error("Unsupported file type. Please upload a PDF file.");
		}
		toast.loading("Uploading PDF...");
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			if (file.size > 5 * 1024 * 1024) {
				toast.error("File size should be less than 5MB");
				throw new Error("File size should be less than 5MB");
			}

			if (pdfMetaData.pdf_id && pdfMetaData.name !== file.name) {
				try {
					await axios.delete(
						`${import.meta.env.VITE_BACKEND_URI}/delete-pdf/${
							pdfMetaData.pdf_id
						}`
					);
					toast.success("Previous PDF deleted successfully");
					console.log("Previous PDF deleted");
					setPdfMetaData({ name: null, pdf_id: null });
					localStorage.removeItem("pdfMetaData");
					setHistory([]);
					setInput("");
					setResponse(null);
				} catch (error) {
					toast.error("Error deleting previous PDF");
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
			toast.error("Error uploading PDF");
			console.error("Error uploading PDF:", error);
		} finally {
			setLoading(false);
		}
	};

	const askQuestion = async (question) => {
		if (loading) return;
		setInput("");
		setNewPrompt(question);
		setResponse(null);
		setLoading(true);
		toast.loading("Asking question...");
		setShowResult(true);

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
			toast.dismiss();

			toast.success("Your Response is ready!");
			displayResponseWithAnimation(res.data.answer);

			const newEntry = {
				question: newPrompt,
				pdfName: pdfMetaData.name,
				response: res.data.answer,
			};

			const newHistory = [...history, newEntry];
			setShowResult(false);
			setHistory(newHistory);
			setResponse(null);
		} catch (error) {
			toast.error("Error asking question");
			console.error("Error asking question:", error);
		}
	};

	const delayPara = (index, nextWord) => {
		setTimeout(() => {
			setResponse((prev) => prev + nextWord);
		}, 60 * index);
	};

	const displayResponseWithAnimation = (formattedResponse) => {
		setLoading(false);
		setResponse("");
		const newResponseArray = formattedResponse.split(" ");
		newResponseArray.forEach((word, index) => {
			delayPara(index, word + " ");
		});
		setResponse(null);
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
