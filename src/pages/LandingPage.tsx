import { Link, useNavigate } from 'react-router-dom';
import './pages.css';
import { Button, Card } from '../components/ui';
import { Logo } from '../components/layout/Logo';

const FEATURES = [
  {
    icon: '🧭',
    title: 'Discover',
    text: 'Find people, companies, projects, communities, and opportunities relevant to you.',
  },
  {
    icon: '🚀',
    title: 'Build',
    text: "Showcase what you're creating, learning, and accomplishing.",
  },
  {
    icon: '🤝',
    title: 'Connect',
    text: 'Meet people who can help you grow and people you can help.',
  },
  {
    icon: '💼',
    title: 'Opportunities',
    text: 'Discover jobs, internships, collaborations, mentorships, freelance work, and more.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="tx-public-header">
        <div className="container tx-public-header__inner">
          <Logo to="/" />
          <div className="row" style={{ gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate('/signup')}>
              Join Talorax
            </Button>
          </div>
        </div>
      </header>

      <section className="tx-hero">
        <div className="container">
          <span className="tx-hero__eyebrow">✦ A social opportunity network</span>
          <h1>Talorax</h1>
          <div className="tx-hero__tag">Discover. Connect. Build.</div>
          <p className="tx-hero__sub">
            A new kind of professional network where people discover careers,
            build relationships, showcase their work, and find opportunities.
          </p>
          <div className="tx-hero__cta">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Join Talorax
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Explore opportunities
            </Button>
          </div>
        </div>
      </section>

      <section className="tx-features">
        <div className="container">
          <div className="tx-feature-grid">
            {FEATURES.map((f) => (
              <Card key={f.title} className="tx-feature" hover>
                <div className="tx-feature__icon" aria-hidden="true">
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="tx-landing-strip">
          <h2>Built for people at the start of their journey</h2>
          <p>
            You don't need a long résumé to belong here. Show your projects,
            skills, and curiosity — and let the right opportunities find you.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Create your profile
          </Button>
        </div>
      </section>

      <footer className="tx-footer">
        <div className="container spread wrap" style={{ gap: 12 }}>
          <Logo to="/" />
          <span>
            © {new Date().getFullYear()} Talorax · Discover. Connect. Build.
          </span>
          <span>
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Log in
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
