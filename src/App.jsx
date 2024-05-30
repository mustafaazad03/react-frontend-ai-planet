import { Toaster } from "react-hot-toast";
import "./App.css";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";

function App() {
	return (
		<div className="bg-white font-inter">
			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: "#fff",
					},
				}}
			/>
			<Navbar />
			<Chat />
		</div>
	);
}

export default App;
