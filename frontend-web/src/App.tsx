import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos';
import Clientes from './pages/Clientes';

const queryClient = new QueryClient();

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/inventario" element={<Inventario />} />

          <Route path="/clientes" element={<Clientes />} />

          <Route path="/pedidos" element={<Pedidos />} />
          
          <Route
            element={
              <RutaProtegida>
                <Layout />
              </RutaProtegida>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Aquí vamos a ir agregando: /inventario, /pedidos, /clientes, etc. */}
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;