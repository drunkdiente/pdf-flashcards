import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Upload from './pages/Upload';
import DeckEdit from './pages/DeckEdit';
import MyDecks from './pages/MyDecks';
import StudyMode from './pages/StudyMode';
// ВОТ ЭТА СТРОКА БЫЛА ПРОПУЩЕНА:
import Header from './components/Header'; 
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Теперь React знает, что такое Header */}
        <Header />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Upload />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/my-decks" element={<MyDecks />} />
            <Route path="/deck/edit" element={<DeckEdit />} />
            <Route path="/deck/:id/study" element={<StudyMode />} />
          </Route>

          {/* Обработка несуществующих страниц */}
          <Route path="*" element={<div className="text-center mt-20">Страница не найдена. <a href="/" className="text-blue-500">На главную</a></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;