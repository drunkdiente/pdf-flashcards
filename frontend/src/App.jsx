import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import PrivateRoute from './components/PrivateRoute';
import { Loader2 } from 'lucide-react';

// Ленивая загрузка страниц
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register')); 
const Upload = lazy(() => import('./pages/Upload'));
const DeckEdit = lazy(() => import('./pages/DeckEdit'));
const MyDecks = lazy(() => import('./pages/MyDecks'));
const StudyMode = lazy(() => import('./pages/StudyMode'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));

// Компонент загрузки (отображается пока грузится страница)
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <Loader2 className="animate-spin text-brand-DEFAULT" size={48} />
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Suspense показывает лоадер, пока подгружается необходимый компонент */}
        <Suspense fallback={<PageLoader />}>
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

            <Route path="*" element={
              <div className="text-center mt-20 text-gray-600">
                Страница не найдена. <a href="/" className="text-brand-DEFAULT font-medium hover:underline">На главную</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;