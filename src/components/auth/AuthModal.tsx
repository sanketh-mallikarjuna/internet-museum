import { useState, useEffect } from 'react';
import type { CuratorUser } from '../../types/auth';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CuratorUser) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
  };


  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (mode === 'register' && username.trim().length < 2) {
      setError('Please enter a curator call-sign of at least 2 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const response = await authService.login({
          email: trimmedEmail,
          password,
        });
        onLoginSuccess(response.user);
        onClose();
      } else {
        const response = await authService.register({
          email: trimmedEmail,
          password,
          username: username.trim(),
        });
        onLoginSuccess(response.user);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please check connection.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="modal-container glass-panel auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.9), 0 0 35px -10px rgba(56, 189, 248, 0.25)',
          borderTop: '3px solid var(--accent-cyan)',
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.6rem' }} aria-hidden="true">🏛️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3
                  id="auth-modal-title"
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {mode === 'login' ? 'Curator Sign In' : 'Register Curator Pass'}
                </h3>
                <span className="museum-catalog-pill">VERIFIED ACCESS</span>
              </div>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {mode === 'login'
                  ? 'Access your official museum curator credential'
                  : 'Join the curatorial team preserving digital web heritage'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close authentication window"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            margin: '1.25rem 0 1rem',
            border: '1px solid var(--border-subtle)',
          }}
          role="tablist"
        >
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('login')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: mode === 'login' ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
              transition: 'var(--transition-smooth)',
            }}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('register')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: mode === 'register' ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
              transition: 'var(--transition-smooth)',
            }}
            role="tab"
            aria-selected={mode === 'register'}
          >
            New Curator Pass
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="auth-error-banner"
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '0.825rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-username"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.02em',
                }}
              >
                Curator Call-sign / Full Name
              </label>
              <input
                id="auth-username"
                type="text"
                className="nav-search-input"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                }}
                placeholder="e.g. Margaret Hamilton"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.35rem',
                letterSpacing: '0.02em',
              }}
            >
              Curator Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              className="nav-search-input"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
              }}
              placeholder="curator@internetmuseum.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
              <label
                htmlFor="auth-password"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.02em',
                }}
              >
                Security Passphrase
              </label>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                min. 6 characters
              </span>
            </div>
            <input
              id="auth-password"
              type="password"
              className="nav-search-input"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
              }}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '0.5rem',
              padding: '0.7rem',
              fontSize: '0.925rem',
              opacity: isLoading ? 0.75 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <span>Sign In as Curator →</span>
            ) : (
              <span>Mint Curator Pass →</span>
            )}
          </button>
        </form>

        {/* Guest Reassurance Notice */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: 600 }}>
            <span>🔒</span>
            <span>Guest Explorations Always Respected</span>
          </div>
          Your in-browser passport stamps, saved favorites, and custom trails remain fully preserved on this machine.
        </div>
      </div>
    </div>
  );
}
