import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import SignUp from './components/Authentication/SignUp';
import Login from './components/Authentication/Login';


function App() {
  return (
    <BrowserRouter>
      <div className='h-screen'>
        <Routes>
          <Route path="/" element={<ChatPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;