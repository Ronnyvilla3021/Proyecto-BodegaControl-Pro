import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { usuario } = useAuthStore();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="text-slate-500 mt-1">
        Bienvenido de nuevo, {usuario?.nombre}. Aquí verás el resumen en tiempo real.
      </p>
    </div>
  );
}