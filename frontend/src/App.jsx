import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Upload from './pages/Upload';
import DeckEdit from './pages/DeckEdit';
import MyDecks from './pages/MyDecks';
import StudyMode from './pages/StudyMode';
import Header from './components/Header'; 
import PrivateRoute from './components/PrivateRoute';
import AdminUsers from './pages/AdminUsers'; // Импорт новой страницы

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Upload />} />
          <Route path="/study/preview" element={<StudyMode />} />
          
          {/* Общие приватные маршруты (User + Admin) */}
          <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
            <Route path="/my-decks" element={<MyDecks />} />
            <Route path="/deck/edit" element={<DeckEdit />} />
            <Route path="/deck/:id/study" element={<StudyMode />} />
          </Route>

          {/* ТОЛЬКО ДЛЯ АДМИНОВ */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
             <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<div className="text-center mt-20">Страница не найдена. <a href="/" className="text-blue-500">На главную</a></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;