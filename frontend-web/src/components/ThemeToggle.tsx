import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
  const { modoOscuro, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'all 0.2s ease',
        color: 'white',
        flexShrink: 0,
        padding: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {modoOscuro ? '☀️' : '🌙'}
    </button>
  );
}