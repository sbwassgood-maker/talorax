import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './pages.css';
import { Button } from '../components/ui';
import { Logo } from '../components/layout/Logo';
import { useAuth } from '../services/auth';

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6)
      next.password = 'Use at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    signup(form);
    navigate('/onboarding');
  };

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="tx-auth">
      <aside className="tx-auth__aside">
        <Logo to="/" />
        <div>
          <h2>Start building your professional world.</h2>
          <div className="tx-auth__points">
            <Point icon="🧭" text="Discover people, projects, and opportunities" />
            <Point icon="🚀" text="Showcase your work — no long résumé needed" />
            <Point icon="📡" text="Let the right opportunities find you" />
          </div>
        </div>
        <span style={{ opacity: 0.85, fontSize: 13 }}>
          Discover. Connect. Build.
        </span>
      </aside>

      <main className="tx-auth__main">
        <form className="tx-auth__form" onSubmit={onSubmit} noValidate>
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'none' }}>
              <Logo to="/" />
            </div>
            <h1>Join Talorax</h1>
            <p className="text-muted">Create your account in seconds.</p>
          </div>

          <div className="tx-name-row">
            <Field
              label="First name"
              value={form.firstName}
              onChange={update('firstName')}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <Field
              label="Last name"
              value={form.lastName}
              onChange={update('lastName')}
              error={errors.lastName}
              autoComplete="family-name"
            />
          </div>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            autoComplete="email"
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" block size="lg">
            Create account
          </Button>

          <p className="tx-auth__switch">
            Already have an account? <Link to="/login">Log in</Link>
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

interface FieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}

function Field({ label, value, onChange, error, type = 'text', autoComplete }: FieldProps) {
  const id = `f-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="tx-field">
      <label className="tx-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="tx-input"
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="tx-error">{error}</span>}
    </div>
  );
}
