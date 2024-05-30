export const fetchHistory = async (pdf_id) => {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URI}/get-history/${pdf_id}`
		);
		return response.data.history;
	} catch (error) {
		console.error("Error fetching history:", error);
	}
};

export const deletePdf = async (pdf_id) => {
	try {
		const response = await axios.delete(
			`${import.meta.env.VITE_BACKEND_URI}/delete-pdf/${pdf_id}`
		);
		return response.data;
	} catch (error) {
		console.error("Error deleting PDF:", error);
	}
};
