import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
  const { modoOscuro, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition"
      title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {modoOscuro ? '☀️' : '🌙'}
    </button>
  );
}