import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StallListPage } from './pages/StallListPage';
import { StallDetailPage } from './pages/StallDetailPage';
import { StallFormPage } from './pages/StallFormPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './App.css';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="container main-content">
            <Routes>
              <Route path="/" element={<StallListPage />} />
              <Route path="/stalls/:id" element={<StallDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/stalls/new"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <StallFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stalls/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <StallFormPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
