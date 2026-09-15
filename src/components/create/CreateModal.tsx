import { useState } from 'react';
import { Modal, Button, Card } from '../ui';
import { useAppState } from '../../services/appState';
import { useAuth } from '../../services/auth';
import type {
  Post,
  Project,
  Opportunity,
  OpportunityType,
  Seniority,
  WorkMode,
  Collab,
  CollabCategoryGroup,
} from '../../models';
import { COLLAB_CATEGORIES, COLLAB_GROUP_ICON } from '../../data/collabs';
import { INDUSTRY_NAMES } from '../../data/industries';
import { getActiveMarkets } from '../../data/geo';

type CreateKind =
  | 'menu'
  | 'post'
  | 'project'
  | 'opportunity'
  | 'collaboration'
  | 'collab';

const KIND_OPTIONS: {
  kind: CreateKind;
  emoji: string;
  title: string;
  desc: string;
}[] = [
  { kind: 'post', emoji: '📝', title: 'Post', desc: 'Share an update or thought' },
  {
    kind: 'project',
    emoji: '🚀',
    title: 'Project',
    desc: 'Showcase something you built',
  },
  {
    kind: 'opportunity',
    emoji: '💼',
    title: 'Opportunity',
    desc: 'Post a role or opening',
  },
  {
    kind: 'collab',
    emoji: '🤝',
    title: 'Collab',
    desc: 'Find someone to build, create, or work with',
  },
  {
    kind: 'collaboration',
    emoji: '🧩',
    title: 'Project collaboration',
    desc: 'Invite others to join a project',
  },
];

export function CreateModal({ onClose }: { onClose: () => void }) {
  const [kind, setKind] = useState<CreateKind>('menu');
  const { user } = useAuth();
  const {
    addPost,
    addProject,
    addOpportunity,
    createOpportunity,
    addCollab,
    companies,
  } = useAppState();

  const authorId = user?.id ?? 'u-alex';

  // Companies this user is authorized to post on behalf of (employer flow).
  // If none, the opportunity form behaves exactly as before (person poster).
  const manageableCompanies = companies.filter((c) =>
    c.adminUserIds?.includes(authorId),
  );

  const now = () => new Date().toISOString();
  const uid = (prefix: string) => `${prefix}-${Date.now()}`;

  const titleFor: Record<CreateKind, string> = {
    menu: 'Create',
    post: 'Create a post',
    project: 'Showcase a project',
    opportunity: 'Post an opportunity',
    collaboration: 'Start a project collaboration',
    collab: 'Start a Collab',
  };

  return (
    <Modal title={titleFor[kind]} onClose={onClose}>
      {kind === 'menu' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <p className="text-muted" style={{ marginTop: -4 }}>
            What would you like to create?
          </p>
          {KIND_OPTIONS.map((o) => (
            <Card
              key={o.kind}
              hover
              className="row"
              style={{ gap: 14, cursor: 'pointer' }}
              onClick={() => setKind(o.kind)}
            >
              <span style={{ fontSize: 26 }} aria-hidden="true">
                {o.emoji}
              </span>
              <span>
                <div style={{ fontWeight: 700 }}>{o.title}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {o.desc}
                </div>
              </span>
            </Card>
          ))}
        </div>
      )}

      {kind === 'post' && (
        <PostForm
          onCancel={() => setKind('menu')}
          onSubmit={(content) => {
            const post: Post = {
              id: uid('post'),
              authorId,
              type: 'text',
              content,
              createdAt: now(),
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            };
            addPost(post);
            onClose();
          }}
        />
      )}

      {kind === 'project' && (
        <ProjectForm
          onCancel={() => setKind('menu')}
          onSubmit={({ title, description, technologies }) => {
            const project: Project = {
              id: uid('p'),
              title,
              creatorId: authorId,
              description,
              technologies,
              status: 'In progress',
              collaboratorIds: [],
              coverColor: '#101828',
              coverLabel: title.slice(0, 18),
              likeCount: 0,
              commentCount: 0,
              createdAt: now(),
            };
            addProject(project);
            const post: Post = {
              id: uid('post'),
              authorId,
              type: 'project',
              content: `I just shared a new project: ${title}.`,
              projectId: project.id,
              createdAt: now(),
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            };
            addPost(post);
            onClose();
          }}
        />
      )}

      {kind === 'opportunity' && (
        <OpportunityForm
          companies={manageableCompanies}
          onCancel={() => setKind('menu')}
          onSubmit={(v) => {
            const {
              title,
              type,
              location,
              shortDescription,
              skills,
              companyId,
              industry,
              seniority,
              workMode,
              neighborhood,
              city,
              state,
              salaryMin,
              salaryMax,
            } = v;
            const isEmployerPost = Boolean(companyId);
            const nowIso = now();
            const opp: Opportunity = {
              id: uid('o'),
              title,
              // Employer posts are attributed to the company; personal posts to
              // the person. Never both, preserving the existing behavior.
              ...(isEmployerPost
                ? { companyId }
                : { posterId: authorId }),
              location: location || 'Remote',
              workMode: workMode ?? 'Remote',
              type,
              industry: industry || undefined,
              seniority: seniority || undefined,
              city: city || undefined,
              state: state || undefined,
              neighborhood: neighborhood || undefined,
              salaryMin: salaryMin || undefined,
              salaryMax: salaryMax || undefined,
              salaryPeriod: salaryMin || salaryMax ? 'year' : undefined,
              shortDescription,
              description: shortDescription,
              responsibilities: [],
              requiredSkills: skills,
              teamMemberIds: isEmployerPost ? [] : [authorId],
              createdAt: nowIso,
              postedAt: nowIso,
              // New listings are Active and honestly Unverified. Employer posts
              // carry the TALORAX Employer source; personal posts leave source
              // unset (legacy behavior).
              status: 'Active',
              ...(isEmployerPost
                ? {
                    source: 'TALORAX Employer' as const,
                    verificationStatus: 'Unverified' as const,
                  }
                : {}),
            };
            // Use the employer-aware createOpportunity when a company is set (it
            // also links the listing into the company's openOpportunityIds);
            // otherwise keep the original addOpportunity path untouched.
            if (isEmployerPost) createOpportunity(opp);
            else addOpportunity(opp);
            const post: Post = {
              id: uid('post'),
              authorId,
              type: 'opportunity',
              content: `New opportunity: ${title}. ${shortDescription}`,
              opportunityId: opp.id,
              ...(companyId ? { companyId } : {}),
              createdAt: nowIso,
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            };
            addPost(post);
            onClose();
          }}
        />
      )}

      {kind === 'collab' && (
        <CollabForm
          onCancel={() => setKind('menu')}
          onSubmit={({
            title,
            description,
            categoryGroup,
            category,
            lookingFor,
            budget,
            timeline,
            location,
          }) => {
            const collab: Collab = {
              id: uid('cl'),
              creatorId: authorId,
              title,
              description,
              categoryGroup,
              category,
              lookingFor,
              location: location || 'Remote',
              workMode: 'Remote',
              budget: budget || undefined,
              timeline: timeline || undefined,
              collaboratorsNeeded: 1,
              interestedUserIds: [],
              invitedUserIds: [],
              accentColor: '#0aa5e0',
              accentLabel: title.slice(0, 18),
              createdAt: now(),
            };
            addCollab(collab);
            const post: Post = {
              id: uid('post'),
              authorId,
              type: 'collab',
              content: `${description}`,
              collabId: collab.id,
              createdAt: now(),
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            };
            addPost(post);
            onClose();
          }}
        />
      )}

      {kind === 'collaboration' && (
        <CollaborationForm
          onCancel={() => setKind('menu')}
          onSubmit={({ title, description, roles, technologies }) => {
            const project: Project = {
              id: uid('p'),
              title,
              creatorId: authorId,
              description,
              technologies,
              status: 'Looking for collaborators',
              collaboratorIds: [],
              coverColor: '#0aa5e0',
              coverLabel: title.slice(0, 18),
              likeCount: 0,
              commentCount: 0,
              seekingRoles: roles,
              createdAt: now(),
            };
            addProject(project);
            const post: Post = {
              id: uid('post'),
              authorId,
              type: 'collaboration',
              content: `Looking for collaborators on ${title}! Seeking: ${roles.join(', ')}.`,
              projectId: project.id,
              createdAt: now(),
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
            };
            addPost(post);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

/* ---------------- Sub-forms ---------------- */

function FormActions({
  onCancel,
  disabled,
  submitLabel,
}: {
  onCancel: () => void;
  disabled: boolean;
  submitLabel: string;
}) {
  return (
    <div className="tx-onboard__actions" style={{ marginTop: 16 }}>
      <Button type="button" variant="ghost" onClick={onCancel}>
        ← Back
      </Button>
      <Button type="submit" disabled={disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}

function PostForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (content: string) => void;
}) {
  const [content, setContent] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (content.trim()) onSubmit(content.trim());
      }}
    >
      <div className="tx-field">
        <label className="tx-label" htmlFor="post-content">
          What's on your mind?
        </label>
        <textarea
          id="post-content"
          className="tx-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share an update, a win, or something you're learning…"
          rows={5}
          autoFocus
        />
      </div>
      <FormActions
        onCancel={onCancel}
        disabled={!content.trim()}
        submitLabel="Post"
      />
    </form>
  );
}

function csv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function ProjectForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (v: {
    title: string;
    description: string;
    technologies: string[];
  }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const valid = title.trim() && description.trim();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid)
          onSubmit({
            title: title.trim(),
            description: description.trim(),
            technologies: csv(tech),
          });
      }}
    >
      <TextField label="Project title" value={title} onChange={setTitle} autoFocus />
      <TextArea label="Description" value={description} onChange={setDescription} />
      <TextField
        label="Technologies (comma separated)"
        value={tech}
        onChange={setTech}
        placeholder="Python, React, SQL"
      />
      <FormActions
        onCancel={onCancel}
        disabled={!valid}
        submitLabel="Share project"
      />
    </form>
  );
}

const OPP_TYPES: OpportunityType[] = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance',
  'Contract',
  'Collaboration',
  'Mentorship',
  'Cofounder',
  'Project',
];

const SENIORITY_OPTIONS: Seniority[] = [
  'Entry level',
  'Mid level',
  'Senior level',
  'Not specified',
];
const WORK_MODE_OPTIONS: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];

interface OpportunityFormValue {
  title: string;
  type: OpportunityType;
  location: string;
  shortDescription: string;
  skills: string[];
  companyId?: string;
  industry?: string;
  seniority?: Seniority;
  workMode?: WorkMode;
  city?: string;
  state?: string;
  neighborhood?: string;
  salaryMin?: number;
  salaryMax?: number;
}

function OpportunityForm({
  onCancel,
  onSubmit,
  companies,
}: {
  onCancel: () => void;
  onSubmit: (v: OpportunityFormValue) => void;
  // Companies the current user may post on behalf of (employer flow). When
  // empty, the form is exactly the original personal opportunity form.
  companies: { id: string; name: string }[];
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('Internship');
  const [location, setLocation] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [skills, setSkills] = useState('');

  // Employer / job fields (all optional; only shown when relevant).
  const [companyId, setCompanyId] = useState('');
  const [industry, setIndustry] = useState('');
  const [seniority, setSeniority] = useState<Seniority>('Not specified');
  const [workMode, setWorkMode] = useState<WorkMode>('On-site');
  const [neighborhood, setNeighborhood] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  const activeMarkets = getActiveMarkets();
  const postingAsEmployer = Boolean(companyId);
  // Derive market/neighborhood options from the selected location's market, if
  // it maps to an active market (Miami-first, but not hard-coded).
  const marketForNeighborhood =
    activeMarkets.find((m) =>
      location.toLowerCase().includes(m.city.toLowerCase()),
    ) ?? activeMarkets[0];

  const valid = title.trim() && shortDescription.trim();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        const market = marketForNeighborhood;
        onSubmit({
          title: title.trim(),
          type,
          location: location.trim(),
          shortDescription: shortDescription.trim(),
          skills: csv(skills),
          companyId: companyId || undefined,
          industry: industry || undefined,
          seniority: seniority !== 'Not specified' ? seniority : undefined,
          workMode,
          neighborhood: neighborhood || undefined,
          // Populate structured city/state from the matched active market when
          // a neighborhood was chosen, so employer posts are marketplace-ready.
          city: neighborhood && market ? market.city : undefined,
          state: neighborhood && market ? market.stateCode : undefined,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryMax: salaryMax ? Number(salaryMax) : undefined,
        });
      }}
    >
      {companies.length > 0 && (
        <div className="tx-field">
          <label className="tx-label" htmlFor="opp-company">
            Post as
          </label>
          <select
            id="opp-company"
            className="tx-select"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Myself (personal opportunity)</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (employer)
              </option>
            ))}
          </select>
        </div>
      )}

      <TextField label="Opportunity title" value={title} onChange={setTitle} autoFocus />
      <div className="tx-field">
        <label className="tx-label" htmlFor="opp-type">
          Type
        </label>
        <select
          id="opp-type"
          className="tx-select"
          value={type}
          onChange={(e) => setType(e.target.value as OpportunityType)}
        >
          {OPP_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <TextField
        label="Location"
        value={location}
        onChange={setLocation}
        placeholder="Miami, FL or Remote"
      />

      {/* Job details — most useful for employer job posts, optional otherwise. */}
      {postingAsEmployer && (
        <>
          <div className="tx-field">
            <label className="tx-label" htmlFor="opp-industry">
              Industry
            </label>
            <select
              id="opp-industry"
              className="tx-select"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="">Select an industry</option>
              {INDUSTRY_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="tx-field">
            <label className="tx-label" htmlFor="opp-seniority">
              Experience level
            </label>
            <select
              id="opp-seniority"
              className="tx-select"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value as Seniority)}
            >
              {SENIORITY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="tx-field">
            <label className="tx-label" htmlFor="opp-workmode">
              Work arrangement
            </label>
            <select
              id="opp-workmode"
              className="tx-select"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as WorkMode)}
            >
              {WORK_MODE_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          {marketForNeighborhood && (
            <div className="tx-field">
              <label className="tx-label" htmlFor="opp-neighborhood">
                {marketForNeighborhood.city} neighborhood (optional)
              </label>
              <select
                id="opp-neighborhood"
                className="tx-select"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              >
                <option value="">Any / not specified</option>
                {marketForNeighborhood.neighborhoods.map((n) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="row" style={{ gap: 12 }}>
            <div className="tx-field" style={{ flex: 1 }}>
              <label className="tx-label" htmlFor="opp-salmin">
                Salary min ($/yr)
              </label>
              <input
                id="opp-salmin"
                className="tx-input"
                type="number"
                inputMode="numeric"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="45000"
              />
            </div>
            <div className="tx-field" style={{ flex: 1 }}>
              <label className="tx-label" htmlFor="opp-salmax">
                Salary max ($/yr)
              </label>
              <input
                id="opp-salmax"
                className="tx-input"
                type="number"
                inputMode="numeric"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="60000"
              />
            </div>
          </div>
        </>
      )}

      <TextArea
        label="Short description"
        value={shortDescription}
        onChange={setShortDescription}
      />
      <TextField
        label="Required skills (comma separated)"
        value={skills}
        onChange={setSkills}
        placeholder="Networking, Linux"
      />
      {postingAsEmployer && (
        <p className="text-muted" style={{ fontSize: 12.5, marginTop: -4 }}>
          Employer posts go live immediately and are labeled “Not independently
          verified” until TALORAX verifies your account.
        </p>
      )}
      <FormActions
        onCancel={onCancel}
        disabled={!valid}
        submitLabel={postingAsEmployer ? 'Post job' : 'Post opportunity'}
      />
    </form>
  );
}

function CollaborationForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (v: {
    title: string;
    description: string;
    roles: string[];
    technologies: string[];
  }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState('');
  const [tech, setTech] = useState('');
  const valid = title.trim() && description.trim() && roles.trim();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid)
          onSubmit({
            title: title.trim(),
            description: description.trim(),
            roles: csv(roles),
            technologies: csv(tech),
          });
      }}
    >
      <TextField label="Project title" value={title} onChange={setTitle} autoFocus />
      <TextArea label="What are you building?" value={description} onChange={setDescription} />
      <TextField
        label="Roles you're looking for (comma separated)"
        value={roles}
        onChange={setRoles}
        placeholder="React Developer, UX Designer"
      />
      <TextField
        label="Technologies (comma separated)"
        value={tech}
        onChange={setTech}
        placeholder="React, Python"
      />
      <FormActions
        onCancel={onCancel}
        disabled={!valid}
        submitLabel="Post collaboration"
      />
    </form>
  );
}

/* ---- Small controlled inputs ---- */
function TextField({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const id = `cf-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="tx-field">
      <label className="tx-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="tx-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `cf-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="tx-field">
      <label className="tx-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="tx-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
}


const COLLAB_GROUPS = Object.keys(COLLAB_CATEGORIES) as CollabCategoryGroup[];

function CollabForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (v: {
    title: string;
    description: string;
    categoryGroup: CollabCategoryGroup;
    category: string;
    lookingFor: string[];
    budget: string;
    timeline: string;
    location: string;
  }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryGroup, setCategoryGroup] = useState<CollabCategoryGroup>('Creator');
  const [category, setCategory] = useState(COLLAB_CATEGORIES.Creator[0]);
  const [lookingFor, setLookingFor] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [location, setLocation] = useState('');

  const valid = title.trim() && description.trim() && lookingFor.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid)
          onSubmit({
            title: title.trim(),
            description: description.trim(),
            categoryGroup,
            category,
            lookingFor: csv(lookingFor),
            budget: budget.trim(),
            timeline: timeline.trim(),
            location: location.trim(),
          });
      }}
    >
      <p className="text-muted" style={{ marginTop: -4, marginBottom: 14 }}>
        Tell TALORAX who you need — it reads like a friendly request, not a job
        post.
      </p>
      <TextField
        label="Title"
        value={title}
        onChange={setTitle}
        placeholder="Looking for a YouTube editor"
        autoFocus
      />
      <TextArea
        label="What are you looking for?"
        value={description}
        onChange={setDescription}
      />

      <div className="tx-field">
        <label className="tx-label" htmlFor="collab-group">
          Category
        </label>
        <select
          id="collab-group"
          className="tx-select"
          value={categoryGroup}
          onChange={(e) => {
            const g = e.target.value as CollabCategoryGroup;
            setCategoryGroup(g);
            setCategory(COLLAB_CATEGORIES[g][0]);
          }}
        >
          {COLLAB_GROUPS.map((g) => (
            <option key={g} value={g}>
              {COLLAB_GROUP_ICON[g]} {g}
            </option>
          ))}
        </select>
      </div>
      <div className="tx-field">
        <label className="tx-label" htmlFor="collab-cat">
          Type
        </label>
        <select
          id="collab-cat"
          className="tx-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {COLLAB_CATEGORIES[categoryGroup].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <TextField
        label="Looking for (comma separated)"
        value={lookingFor}
        onChange={setLookingFor}
        placeholder="Video Editing, TikTok, Thumbnail Design"
      />
      <TextField
        label="Budget (optional)"
        value={budget}
        onChange={setBudget}
        placeholder="$50–$100 per video"
      />
      <TextField
        label="Timeline (optional)"
        value={timeline}
        onChange={setTimeline}
        placeholder="Starting this week"
      />
      <TextField
        label="Location"
        value={location}
        onChange={setLocation}
        placeholder="Remote"
      />
      <FormActions onCancel={onCancel} disabled={!valid} submitLabel="Post Collab" />
    </form>
  );
}
