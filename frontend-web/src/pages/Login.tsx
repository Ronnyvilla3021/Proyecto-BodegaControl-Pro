import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const setSesion = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await login({ email, password });
      setSesion(respuesta.usuario, respuesta.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      boxSizing: 'border-box',
      backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,58,95,0.85) 50%, rgba(15,23,42,0.92) 100%), url('/fondo.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(255,255,255,0.98)',
          padding: '48px 40px',
          borderRadius: '20px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          width: '100%',
          maxWidth: '420px',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)'
          }}>
            <img
              src="/logo.png"
              alt="Bodega Control Pro"
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>
            Bodega Control Pro
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '0', fontWeight: '500' }}>
            Inicia sesión para continuar
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#991b1b',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            fontSize: '14px',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '500'
          }}>
            <span style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#dc2626',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              flexShrink: 0
            }}>!</span>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '8px',
            letterSpacing: '0.01em'
          }}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@correo.com"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500'
            }}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '8px',
            letterSpacing: '0.01em'
          }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: '100%',
            padding: '15px',
            background: cargando
              ? 'linear-gradient(135deg, #94a3b8, #64748b)'
              : 'linear-gradient(135deg, #2563eb, #1e40af)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: cargando ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: cargando
              ? '0 4px 12px rgba(100,116,139,0.3)'
              : '0 8px 20px rgba(37,99,235,0.35)',
            opacity: cargando ? 0.8 : 1,
            letterSpacing: '0.02em'
          }}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#94a3b8',
          fontWeight: '500'
        }}>
          © 2025 Bodega Control Pro
        </p>
      </form>
    </div>
  );
}