import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './pages.css';
import { Button, Card } from '../components/ui';
import { Logo } from '../components/layout/Logo';
import { useAuth } from '../services/auth';
import { getUserById, DEMO_USER_ID } from '../data/users';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const demoEmail = getUserById(DEMO_USER_ID)?.email ?? '';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    login(email);
    navigate('/home');
  };

  const useDemo = () => {
    login(demoEmail);
    navigate('/home');
  };

  return (
    <div className="tx-auth">
      <aside className="tx-auth__aside">
        <Logo to="/" />
        <div>
          <h2>Welcome back to your opportunity network.</h2>
          <div className="tx-auth__points">
            <Point icon="🏠" text="Catch up on your personalized feed" />
            <Point icon="💼" text="See new opportunities matched to you" />
            <Point icon="🤝" text="Continue building your connections" />
          </div>
        </div>
        <span style={{ opacity: 0.85, fontSize: 13 }}>
          Discover. Connect. Build.
        </span>
      </aside>

      <main className="tx-auth__main">
        <form className="tx-auth__form" onSubmit={onSubmit} noValidate>
          <h1>Log in</h1>
          <p className="text-muted" style={{ marginBottom: 22 }}>
            Welcome back — let's pick up where you left off.
          </p>

          <div className="tx-field">
            <label className="tx-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="tx-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="tx-error">{errors.email}</span>}
          </div>

          <div className="tx-field">
            <label className="tx-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="tx-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <span className="tx-error">{errors.password}</span>
            )}
          </div>

          <Button type="submit" block size="lg">
            Log in
          </Button>

          <Card
            pad
            style={{ marginTop: 18, background: 'var(--color-primary-softer)', border: 'none' }}
          >
            <div style={{ fontSize: 13.5 }}>
              <strong>Just exploring?</strong> Try the demo account to see
              Talorax with sample data.
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              block
              style={{ marginTop: 10 }}
              onClick={useDemo}
            >
              Continue as demo user
            </Button>
          </Card>

          <p className="tx-auth__switch">
            New to Talorax? <Link to="/signup">Join Talorax</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

function Point({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="tx-auth__point">
      <span className="tx-auth__point-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
