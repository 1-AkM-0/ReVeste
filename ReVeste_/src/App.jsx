import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NegociacaoProvider } from './context/NegociacaoContext'
import Navbar from './components/Navbar'
import Explorar from './pages/Explorar'
import Garagem from './pages/Garagem'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Perfil from './pages/Perfil'
import { ROUTES } from './routes'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NegociacaoProvider>
          <div className="app-shell">
            <Navbar />
            <main>
              <Routes>
                <Route path={ROUTES.home} element={<Home />} />
                <Route path={ROUTES.explorar} element={<Explorar />} />
                <Route path={ROUTES.garagem} element={<Garagem />} />
                <Route path={ROUTES.login} element={<Login />} />
                <Route path={ROUTES.cadastro} element={<Cadastro />} />
                <Route path={ROUTES.perfil} element={<Perfil />} />
                <Route path="*" element={<Navigate replace to={ROUTES.home} />} />
              </Routes>
            </main>
          </div>
        </NegociacaoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
