import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { ResumenDashboard } from '../types/dashboard';

export function useDashboardStream() {
  const [datos, setDatos] = useState<ResumenDashboard | null>(null);
  const [conectado, setConectado] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    const url = `${import.meta.env.VITE_API_URL}/dashboard/stream?token=${token}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => setConectado(true);

    eventSource.onmessage = (evento) => {
      const data: ResumenDashboard = JSON.parse(evento.data);
      setDatos(data);
    };

    eventSource.onerror = () => {
      setConectado(false);
      // EventSource reintenta la conexión solo por defecto, no hace falta manejarlo manualmente
    };

    // Limpieza: cierra la conexión cuando el componente se desmonta (ej. el usuario navega a otra página)
    return () => {
      eventSource.close();
    };
  }, [token]);

  return { datos, conectado };
}