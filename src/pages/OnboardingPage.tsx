import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './pages.css';
import { Button, Card, Tag } from '../components/ui';
import { Logo } from '../components/layout/Logo';
import { useAuth } from '../services/auth';
import type { PersonaType, LookingFor } from '../models';
import { interestNames } from '../data/interests';
import { skillNames } from '../data/skills';

const PERSONAS: { value: PersonaType; emoji: string }[] = [
  { value: 'Student', emoji: '🎓' },
  { value: 'Recent graduate', emoji: '🌱' },
  { value: 'Professional', emoji: '💼' },
  { value: 'Career changer', emoji: '🔄' },
  { value: 'Freelancer', emoji: '🧑‍💻' },
  { value: 'Entrepreneur', emoji: '🚀' },
];

const LOOKING_FOR: LookingFor[] = [
  'Internship',
  'Full-time job',
  'Part-time job',
  'Freelance work',
  'Projects',
  'Collaboration',
  'Mentorship',
  'Cofounder',
  'Learning opportunities',
];

const TOTAL_STEPS = 4;

export function OnboardingPage() {
  const { isAuthenticated, needsOnboarding, completeOnboarding, user } =
    useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaType | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<LookingFor[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Route protection: must be signed in; if already onboarded go home.
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!needsOnboarding) return <Navigate to="/home" replace />;

  const toggle = <T,>(list: T[], value: T, setter: (v: T[]) => void) => {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    );
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !selectedSkills.includes(v)) {
      setSelectedSkills([...selectedSkills, v]);
    }
    setSkillInput('');
  };

  const canContinue =
    (step === 1 && persona !== null) ||
    (step === 2 && selectedInterests.length > 0) ||
    (step === 3 && selectedLookingFor.length > 0) ||
    (step === 4 && selectedSkills.length > 0);

  const finish = () => {
    if (!persona) return;
    completeOnboarding({
      persona,
      interests: selectedInterests,
      lookingFor: selectedLookingFor,
      skills: selectedSkills,
    });
    navigate('/home');
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else finish();
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="tx-onboard">
      <Logo to="/" />

      <div className="tx-onboard__progress" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`tx-onboard__bar${i < step ? ' tx-onboard__bar--on' : ''}`}
          />
        ))}
      </div>

      <Card className="tx-onboard__card" pad>
        <div className="tx-onboard__step">
          Step {step} of {TOTAL_STEPS}
        </div>

        {step === 1 && (
          <>
            <h1>What describes you{user ? `, ${user.firstName}` : ''}?</h1>
            <p className="text-muted">
              This helps us tailor Talorax to where you are right now.
            </p>
            <div className="tx-choice-grid">
              {PERSONAS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`tx-choice${persona === p.value ? ' tx-choice--selected' : ''}`}
                  onClick={() => setPersona(p.value)}
                  aria-pressed={persona === p.value}
                >
                  <span className="tx-choice__emoji" aria-hidden="true">
                    {p.emoji}
                  </span>
                  {p.value}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1>What are you interested in?</h1>
            <p className="text-muted">Pick as many as you like.</p>
            <div className="tx-chip-wrap">
              {interestNames.map((name) => (
                <Tag
                  key={name}
                  selected={selectedInterests.includes(name)}
                  onClick={() =>
                    toggle(selectedInterests, name, setSelectedInterests)
                  }
                >
                  {name}
                </Tag>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1>What are you looking for?</h1>
            <p className="text-muted">Select everything that applies.</p>
            <div className="tx-chip-wrap">
              {LOOKING_FOR.map((name) => (
                <Tag
                  key={name}
                  selected={selectedLookingFor.includes(name)}
                  onClick={() =>
                    toggle(selectedLookingFor, name, setSelectedLookingFor)
                  }
                >
                  {name}
                </Tag>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1>What can you do?</h1>
            <p className="text-muted">
              Add your skills — select from popular ones or type your own.
            </p>
            <div className="tx-skill-input-row" style={{ marginTop: 16 }}>
              <input
                className="tx-input"
                placeholder="Add a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                aria-label="Add a skill"
              />
              <Button type="button" variant="secondary" onClick={addSkill}>
                Add
              </Button>
            </div>

            {selectedSkills.length > 0 && (
              <div className="tx-chip-wrap" style={{ marginTop: 4 }}>
                {selectedSkills.map((s) => (
                  <Tag
                    key={s}
                    selected
                    onClick={() =>
                      setSelectedSkills(selectedSkills.filter((x) => x !== s))
                    }
                  >
                    {s} ✕
                  </Tag>
                ))}
              </div>
            )}

            <p className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
              Popular skills
            </p>
            <div className="tx-chip-wrap">
              {skillNames
                .filter((s) => !selectedSkills.includes(s))
                .map((s) => (
                  <Tag
                    key={s}
                    onClick={() => setSelectedSkills([...selectedSkills, s])}
                  >
                    + {s}
                  </Tag>
                ))}
            </div>
          </>
        )}

        <div className="tx-onboard__actions">
          {step > 1 ? (
            <Button variant="ghost" onClick={back}>
              ← Back
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={next} disabled={!canContinue}>
            {step === TOTAL_STEPS ? 'Finish & go to Home' : 'Continue →'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
