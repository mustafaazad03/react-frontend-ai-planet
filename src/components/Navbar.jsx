import aiplanetLogo from "../assets/logo.svg";
import fileIcon from "../assets/file.svg";
import { useAppContext } from "../context";
import addIcon from "../assets/add.svg";
import { useRef } from "react";
import toast from "react-hot-toast";
const Navbar = () => {
	const { pdfMetaData, uploadPdf } = useAppContext();
	const fileInputRef = useRef(null);

	const handleUploadClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			await uploadPdf(file);
			toast.dismiss();
		}
	};

	return (
		<div className="shadow-nav py-[18px] flex justify-between items-center md:px-14 px-8">
			<a href="/">
				<img src={aiplanetLogo} alt="Aiplanet Logo" className="" />
			</a>
			<div className="flex items-center md:space-x-9 space-x-5">
				{pdfMetaData?.pdf_id !== null && (
					<div className="flex items-center justify-center">
						<img
							src={fileIcon}
							alt="File Icon"
							className="mr-2 p-2 border rounded-sm border-primary/45"
						/>
						<p className="text-sm text-primary font-medium">
							{pdfMetaData?.name?.length > 12
								? pdfMetaData.name.slice(0, 8) +
								  "..." +
								  pdfMetaData.name.slice(-4)
								: pdfMetaData.name}
						</p>
					</div>
				)}
				<button
					className="flex items-center space-x-3 sm:px-9 sm:py-[10px] p-[10px] border rounded-lg border-black"
					onClick={handleUploadClick}
				>
					<img src={addIcon} alt="Add Icon" />
					<span className="font-semibold hidden sm:flex">Upload PDF</span>
				</button>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="application/pdf"
					onChange={handleFileChange}
				/>
			</div>
		</div>
	);
};

export default Navbar;
