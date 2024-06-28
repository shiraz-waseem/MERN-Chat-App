import { Route, Routes } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Homepage from "./Pages/Homepage";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
