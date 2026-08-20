import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { usuario, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md">
        <h1 className="text-xl font-bold text-slate-800">¡Bienvenido, {usuario?.nombre}!</h1>
        <p className="text-slate-500 mt-1">Rol: {usuario?.rol}</p>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}