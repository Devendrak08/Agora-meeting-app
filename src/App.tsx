
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import AgoraVideoMeet from './components/AgoraVideoMeet';

function App() {
  return ( 
     <Router>
      <Routes>
        <Route path="/user" element={<AgoraVideoMeet />} />
      </Routes>
    </Router>

  );
}

export default App;
