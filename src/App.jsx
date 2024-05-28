import "./App.css";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";

function App() {
	return (
		<div className="bg-white font-inter">
			<Navbar />
			<Chat />
		</div>
	);
}

export default App;
