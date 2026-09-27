import { useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  CircleCheck,
  CircleUserRound,
  Code2,
  Compass,
  Flame,
  FolderKanban,
  Lightbulb,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
  Wrench,
} from 'lucide-react';
import {
  Link,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
  useParams,
} from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/index.css';

type AppState = {
  name: string;
  completedLessons: string[];
  completedProjects: string[];
  streak: number;
};

type Lesson = {
  id: string;
  number: string;
  title: string;
  summary: string;
  category: string;
  duration: string;
  explanation: string;
  code: string;
  question: string;
  choices: string[];
  answer: number;
  hint: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  art: string;
  icon: 'target' | 'lightbulb' | 'terminal' | 'wrench';
  steps: { title: string; detail: string }[];
  starter: string;
};

const queryClient = new QueryClient();
const STORAGE_KEY = 'funza-toto-progress-v1';

const lessons: Lesson[] = [
  {
    id: 'variables',
    number: '01',
    title: 'Give your code a memory',
    summary: 'Store a useful piece of information in a variable.',
    category: 'Foundations',
    duration: '8 min',
    explanation: 'Variables are labeled boxes for information. Give a value a clear name and your program can use it again later. Python uses a single equals sign to store a value.',
    code: `name = "Maya"
project_count = 3

print(name)
print("Projects:", project_count)`,
    question: 'What will print on the first line?',
    choices: ['project_count', 'Maya', 'name', 'Nothing'],
    answer: 1,
    hint: 'The variable name is a label. Look at the value stored inside it.',
  },
  {
    id: 'strings',
    number: '02',
    title: 'Talk to your user',
    summary: 'Use text and input to make a program feel personal.',
    category: 'Foundations',
    duration: '10 min',
    explanation: 'Strings are pieces of text wrapped in quotes. The input function lets a person type an answer, which your program can remember and use in a message.',
    code: `nickname = input("What should I call you? ")
message = "Nice to meet you, " + nickname
print(message)`,
    question: 'Which symbol joins two pieces of text?',
    choices: ['The plus sign (+)', 'The equals sign (=)', 'The slash (/)', 'The percent sign (%)'],
    answer: 0,
    hint: 'Think about how you would add two things together.',
  },
  {
    id: 'conditions',
    number: '03',
    title: 'Make choices with if',
    summary: 'Help a program respond differently to different situations.',
    category: 'Logic',
    duration: '12 min',
    explanation: 'An if statement gives your program a choice. Python checks whether a condition is true, then runs the indented lines underneath it.',
    code: `points = 12

if points > 10:
    print("Level up!")
else:
    print("Keep exploring")`,
    question: 'Which message appears when points is 12?',
    choices: ['Keep exploring', 'Level up!', 'Both messages', 'There is an error'],
    answer: 1,
    hint: '12 is greater than 10, so the first branch gets a turn.',
  },
  {
    id: 'loops',
    number: '04',
    title: 'Repeat the useful bit',
    summary: 'Use loops to do a small task more than once.',
    category: 'Logic',
    duration: '11 min',
    explanation: 'A for loop is a tiny instruction for repeating an action. It is great for lists, routines, and any job where copying the same line would be tedious.',
    code: `tools = ["editor", "terminal", "notebook"]

for tool in tools:
    print("Pack:", tool)`,
    question: 'How many times does the loop print?',
    choices: ['Once', 'Two times', 'Three times', 'Until you stop it'],
    answer: 2,
    hint: 'The list has three items. The loop visits each item once.',
  },
  {
    id: 'functions',
    number: '05',
    title: 'Package a superpower',
    summary: 'Bundle a repeatable action into a function.',
    category: 'Tools',
    duration: '13 min',
    explanation: 'Functions make code easier to reuse and understand. Define a function once, then call its name whenever you need that little superpower.',
    code: `def cheer(name):
    return "Keep building, " + name

message = cheer("Sam")
print(message)`,
    question: 'What does cheer("Sam") do?',
    choices: ['Defines a new list', 'Runs the function with Sam', 'Deletes the function', 'Prints every name'],
    answer: 1,
    hint: 'Calling a function means asking it to do the job it was packaged for.',
  },
  {
    id: 'lists',
    number: '06',
    title: 'Keep a collection',
    summary: 'Organize several related values in one list.',
    category: 'Tools',
    duration: '9 min',
    explanation: 'Lists keep a group of values in order. You can add to them, look at one item, and loop over the whole collection as your project grows.',
    code: `ideas = ["quiz", "timer"]
ideas.append("journal")

print(ideas[0])`,
    question: 'What is the first item in ideas?',
    choices: ['timer', 'journal', 'quiz', '0'],
    answer: 2,
    hint: 'Python starts counting list positions at zero.',
  },
];

const projects: Project[] = [
  {
    id: 'focus-timer',
    title: 'Focus timer',
    description: 'Make a tiny command-line timer for your next creative sprint.',
    difficulty: 'Starter',
    time: '25 min',
    art: 'art-teal',
    icon: 'target',
    steps: [
      { title: 'Set your minutes', detail: 'Store the session length in a variable.' },
      { title: 'Give a countdown', detail: 'Use a loop to show each minute.' },
      { title: 'Celebrate the finish', detail: 'Print a clear message when time is up.' },
    ],
    starter: `minutes = 3

for minute in range(minutes, 0, -1):
    print("Minutes left:", minute)

print("Nice work. Break time!")`,
  },
  {
    id: 'story-remixer',
    title: 'Story remixer',
    description: 'Turn a few answers into a silly, shareable story for your family.',
    difficulty: 'Starter',
    time: '30 min',
    art: 'art-coral',
    icon: 'lightbulb',
    steps: [
      { title: 'Ask for ingredients', detail: 'Collect a place, character, and action.' },
      { title: 'Build the sentence', detail: 'Join your answers into a story.' },
      { title: 'Read it aloud', detail: 'Print the result and test a new version.' },
    ],
    starter: `place = "the moon"
character = "a curious cat"
action = "learned Python"

story = character + " " + action + " on " + place + "."
print(story)`,
  },
  {
    id: 'kindness-generator',
    title: 'Kindness generator',
    description: 'Create a pocket-sized prompt machine for thoughtful moments.',
    difficulty: 'Growing',
    time: '35 min',
    art: 'art-indigo',
    icon: 'terminal',
    steps: [
      { title: 'Collect prompts', detail: 'Write a short list of kind actions.' },
      { title: 'Pick one', detail: 'Use a random choice to surprise yourself.' },
      { title: 'Make it yours', detail: 'Add a name or place from your world.' },
    ],
    starter: `import random

prompts = ["thank a helper", "share a skill", "send a kind note"]
print("Try this:", random.choice(prompts))`,
  },
  {
    id: 'family-inventory',
    title: 'Family inventory',
    description: 'Help someone at home keep track of books, plants, or board games.',
    difficulty: 'Growing',
    time: '40 min',
    art: 'art-gold',
    icon: 'wrench',
    steps: [
      { title: 'Choose a collection', detail: 'Ask an adult which list would help.' },
      { title: 'Add the first items', detail: 'Store names in a Python list.' },
      { title: 'Make it searchable', detail: 'Print a neat numbered view.' },
    ],
    starter: `items = ["The Hobbit", "Braiding Sweetgrass"]

for number, item in enumerate(items, start=1):
    print(number, item)`,
  },
];

function usePersistentState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
}

const defaultState: AppState = {
  name: 'Maya',
  completedLessons: ['variables'],
  completedProjects: [],
  streak: 4,
};

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CC';
}

function Logo() {
  return (
    <Link href="/" className="brand" data-testid="link-brand">
      <span className="brand-mark">cc</span>
      <span className="brand-name">code<span>craft</span></span>
    </Link>
  );
}

const navItems = [
  { href: '/', label: 'My launchpad', icon: Compass },
  { href: '/learn', label: 'Learn Python', icon: BookOpen },
  { href: '/projects', label: 'Build projects', icon: FolderKanban },
  { href: '/opportunities', label: 'Explore ideas', icon: Lightbulb },
  { href: '/profile', label: 'My profile', icon: CircleUserRound },
];

function Shell({ state, setState }: { state: AppState; setState: Dispatch<SetStateAction<AppState>> }) {
  const [location] = useLocation();
  return (
    <>
      <aside className="sidebar">
        <Logo />
        <div className="nav-label">Your workspace</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-item ${location === href || (href !== '/' && location.startsWith(href)) ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={16} strokeWidth={2} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><strong>Funza Toto note</strong><p>Small steps count. Make something real, then show a trusted adult.</p></div></div>
      </aside>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={location === href || (href !== '/' && location.startsWith(href)) ? 'active' : ''} data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}>
            <Icon /><span>{label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
      <main className="main">
        <header className="topbar">
          <span className="crumb">Funza Toto / {location === '/' ? 'Launchpad' : location.slice(1).split('/')[0]}</span>
          <div className="topbar-actions">
            <div className="streak-pill" data-testid="status-streak"><span className="streak-dot" /> {state.streak} day streak</div>
            <Link href="/profile" className="avatar" data-testid="link-avatar">{initials(state.name)}</Link>
          </div>
        </header>
        <RouterContent state={state} setState={setState} />
      </main>
    </>
  );
}

function RouterContent({ state, setState }: { state: AppState; setState: Dispatch<SetStateAction<AppState>> }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage state={state} />} />
      <Route path="/learn" component={() => <LearnPage state={state} />} />
      <Route path="/learn/:lessonId" component={() => <LessonPage state={state} setState={setState} />} />
      <Route path="/projects" component={() => <ProjectsPage state={state} />} />
      <Route path="/projects/:projectId" component={() => <ProjectPage state={state} setState={setState} />} />
      <Route path="/opportunities" component={OpportunitiesPage} />
      <Route path="/profile" component={() => <ProfilePage state={state} setState={setState} />} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function HomePage({ state }: { state: AppState }) {
  const nextLesson = lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) || lessons[lessons.length - 1];
  const lessonProgress = Math.round((state.completedLessons.length / lessons.length) * 100);
  const projectProgress = Math.round((state.completedProjects.length / projects.length) * 100);
  return (
    <div className="page">
      <div className="eyebrow">Your launchpad</div>
      <h1 className="page-title">Keep making things,<br /><span style={{ color: 'hsl(var(--primary))' }}> {state.name}.</span></h1>
      <p className="page-intro">A little practice today gives tomorrow’s ideas somewhere to start. You are {lessonProgress}% through your Python path.</p>
      <section className="hero-card">
        <div className="eyebrow">Today’s tiny win</div>
        <h2>Build one useful idea before lunch.</h2>
        <p>Open a lesson, try the example, then change one thing. That is how builders grow their toolkit.</p>
        <Link href={`/learn/${nextLesson.id}`} className="button button-primary" data-testid="button-next-lesson">Continue learning <ArrowRight size={14} /></Link>
      </section>
      <div className="section-row"><h2 className="section-title">Your momentum</h2><Link href="/profile" className="text-link" data-testid="link-view-profile">View profile <ArrowRight size={13} /></Link></div>
      <div className="dashboard-grid">
        <div className="card next-card">
          <div>
            <div className="lesson-meta">Up next · {nextLesson.duration}</div>
            <h3>{nextLesson.title}</h3>
            <p>{nextLesson.summary}</p>
            <Link href={`/learn/${nextLesson.id}`} className="text-link" style={{ marginTop: 15 }} data-testid="link-up-next">Open lesson <ArrowRight size={13} /></Link>
          </div>
          <div className="lesson-icon"><Code2 size={28} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><Flame size={18} /></div><div><div className="stat-number">{state.streak}</div><div className="stat-label">days of building</div></div>
        </div>
      </div>
      <div className="card momentum-card" style={{ marginTop: 16 }}>
        <h3>Learning path</h3>
        <div className="momentum-row"><span>Python foundations</span><span>{lessonProgress}%</span></div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${lessonProgress}%` }} /></div>
        <div className="mini-grid" aria-label={`${state.streak} active days`}>
          {Array.from({ length: 7 }, (_, index) => <span className={`mini-day ${index >= 7 - Math.min(state.streak, 7) ? 'on' : ''} ${index === 6 ? 'today' : ''}`} key={index} />)}
        </div>
      </div>
      <div className="section-row"><h2 className="section-title">Your project shelf</h2><Link href="/projects" className="text-link" data-testid="link-view-projects">Browse projects <ArrowRight size={13} /></Link></div>
      <div className="path-strip">
        {projects.slice(0, 4).map((project, index) => {
          const done = state.completedProjects.includes(project.id);
          return <Link href={`/projects/${project.id}`} className={`path-step ${done ? 'done' : ''} ${index === state.completedProjects.length ? 'current' : ''}`} key={project.id} data-testid={`card-home-project-${project.id}`}>
            <div className="step-index">{done ? 'DONE' : `0${index + 1}`}</div><h4>{project.title}</h4><p>{done ? 'You built it.' : project.difficulty}</p>
          </Link>;
        })}
      </div>
      <div style={{ display: 'none' }}>{projectProgress}</div>
    </div>
  );
}

function LearnPage({ state }: { state: AppState }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Foundations', 'Logic', 'Tools'];
  const visible = filter === 'All' ? lessons : lessons.filter((lesson) => lesson.category === filter);
  return (
    <div className="page">
      <div className="eyebrow">The learning path</div>
      <h1 className="page-title">Learn by making<br />small, smart moves.</h1>
      <p className="page-intro">Short lessons, real examples, zero pressure. Pick the next idea that feels useful and make it yours.</p>
      <div className="toolbar" role="tablist" aria-label="Lesson categories">
        {categories.map((category) => <button key={category} className={`filter-button ${filter === category ? 'active' : ''}`} onClick={() => setFilter(category)} data-testid={`button-filter-${category.toLowerCase()}`}>{category}</button>)}
      </div>
      {visible.length ? <div className="lesson-grid">{visible.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} done={state.completedLessons.includes(lesson.id)} />)}</div> : <div className="empty-state"><Sparkles className="empty-icon" /><h3>That path is still loading</h3><p>Try another chapter while we gather the next set of building blocks.</p></div>}
    </div>
  );
}

function LessonCard({ lesson, done }: { lesson: Lesson; done: boolean }) {
  return (
    <Link href={`/learn/${lesson.id}`} className="card lesson-card" data-testid={`card-lesson-${lesson.id}`}>
      <div className="lesson-card-top"><span className="lesson-number">{lesson.number} / {lesson.category}</span>{done ? <CircleCheck size={18} color="hsl(var(--primary))" /> : <BookOpen size={17} color="hsl(var(--muted-foreground))" />}</div>
      <h3>{lesson.title}</h3><p>{lesson.summary}</p>
      <div className="lesson-card-footer"><span className={`status ${done ? 'done' : ''}`}><span className="status-dot" /> {done ? 'Completed' : lesson.duration}</span><ArrowRight size={15} color="hsl(var(--primary))" /></div>
    </Link>
  );
}

function LessonPage({ state, setState }: { state: AppState; setState: Dispatch<SetStateAction<AppState>> }) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const done = state.completedLessons.includes(lesson.id);
  const markComplete = () => {
    setState((current) => current.completedLessons.includes(lesson.id) ? current : { ...current, completedLessons: [...current.completedLessons, lesson.id], streak: current.streak + 1 });
  };
  return (
    <div className="page detail-layout">
      <Link href="/learn" className="back-link" data-testid="link-back-learn"><ChevronLeft size={14} /> Learning path</Link>
      <div className="eyebrow">{lesson.number} · {lesson.category} · {lesson.duration}</div>
      <h1 className="detail-title">{lesson.title}</h1>
      <p className="detail-lede">{lesson.summary} Take your time, then change the example so it sounds like you.</p>
      <div className="detail-columns">
        <article className="card explanation">
          <h2>The idea</h2><p>{lesson.explanation}</p>
          <div className="code-block"><div className="code-head"><span>example.py</span><span className="code-dots"><i /><i /><i /></span></div><pre>{lesson.code}</pre></div>
          <div className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>Try this</div><p>Replace one value in the example. What changes when you make it personal?</p>
          <button className="button button-primary" onClick={markComplete} data-testid="button-complete-lesson">{done ? <><Check size={14} /> Lesson completed</> : <>Mark lesson complete <Check size={14} /></>}</button>
        </article>
        <aside className="card check-card">
          <span className="eyebrow">Quick check</span><h2>{lesson.question}</h2>
          {lesson.choices.map((choice, index) => <button key={choice} className={`choice ${selected === index ? 'selected' : ''} ${checked && index === lesson.answer ? 'correct' : ''} ${checked && selected === index && index !== lesson.answer ? 'wrong' : ''}`} onClick={() => { setSelected(index); setChecked(false); }} data-testid={`button-choice-${index}`}>{choice}</button>)}
          {selected !== null && !checked && <button className="button button-dark button-small" style={{ marginTop: 14, width: '100%' }} onClick={() => setChecked(true)} data-testid="button-check-answer">Check answer <ArrowRight size={13} /></button>}
          {checked && <div className="check-result" data-testid="status-knowledge-check">{selected === lesson.answer ? 'That is it. You spotted the pattern.' : lesson.hint}</div>}
        </aside>
      </div>
    </div>
  );
}

function ProjectIcon({ kind }: { kind: Project['icon'] }) {
  const Icon = kind === 'target' ? Target : kind === 'lightbulb' ? Lightbulb : kind === 'terminal' ? Code2 : Wrench;
  return <Icon size={21} />;
}

function ProjectsPage({ state }: { state: AppState }) {
  return (
    <div className="page">
      <div className="eyebrow">The project shelf</div>
      <h1 className="page-title">Turn practice into<br />something you can show.</h1>
      <p className="page-intro">Every project is small on purpose. Build it for yourself, your family, or a school idea — then keep the parts you like.</p>
      <div className="section-row"><h2 className="section-title">Choose your next build</h2><span className="lesson-meta">{state.completedProjects.length} / {projects.length} finished</span></div>
      <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} done={state.completedProjects.includes(project.id)} />)}</div>
      {projects.length === 0 && <div className="empty-state" style={{ marginTop: 18 }}><FolderKanban className="empty-icon" /><h3>Your shelf is ready for its first idea</h3><p>Come back soon for a new little build.</p></div>}
    </div>
  );
}

function ProjectCard({ project, done }: { project: Project; done: boolean }) {
  return (
    <Link href={`/projects/${project.id}`} className="card project-card" data-testid={`card-project-${project.id}`}>
      <div className={`project-art ${project.art}`}><div className="project-art-icon"><ProjectIcon kind={project.icon} /></div><div className="project-art-label">{project.title}</div></div>
      <div className="project-content"><h3>{project.title}</h3><p>{project.description}</p><div className="project-footer"><span className="project-tag">{done ? 'Completed' : project.difficulty}</span><span className="lesson-meta">{project.time}</span></div></div>
    </Link>
  );
}

function ProjectPage({ state, setState }: { state: AppState; setState: Dispatch<SetStateAction<AppState>> }) {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projects.find((item) => item.id === projectId) || projects[0];
  const [code, setCode] = useState(project.starter);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(0);
  const done = state.completedProjects.includes(project.id);
  const runCode = () => { setFeedback(code.trim().length > 20 ? 'Nice — your code is running with a clear starting point. Try changing one line and run it again.' : 'Add a little more code first. Start with the example, then make one small change.'); };
  const completeProject = () => setState((current) => current.completedProjects.includes(project.id) ? current : { ...current, completedProjects: [...current.completedProjects, project.id] });
  return (
    <div className="page detail-layout">
      <Link href="/projects" className="back-link" data-testid="link-back-projects"><ChevronLeft size={14} /> Project shelf</Link>
      <div className="eyebrow">{project.difficulty} build · {project.time}</div>
      <h1 className="detail-title">{project.title}</h1>
      <p className="detail-lede">{project.description} Follow the guide, but leave room for your own twist.</p>
      <div className="workspace-grid">
        <article className="card steps-card"><h2>Build guide</h2>{project.steps.map((item, index) => <button key={item.title} className="guide-step" style={{ width: '100%', textAlign: 'left', background: 'transparent', borderLeft: 0, borderRight: 0, cursor: 'pointer' }} onClick={() => setStep(index)} data-testid={`button-step-${index}`}><span className={`guide-number ${index < step ? 'done' : ''}`}>{index < step ? <Check size={13} /> : index + 1}</span><span><h4>{item.title}</h4><p>{item.detail}</p></span></button>)}<div className="safety-callout" style={{ marginTop: 19 }}><ShieldCheck size={17} color="hsl(var(--accent))" /><p style={{ marginTop: 8 }}>Build with a trusted adult nearby if you are sharing or testing anything online.</p></div></article>
        <article className="card editor-card"><h2>Your workspace</h2><textarea className="editor-textarea" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} aria-label="Project code editor" data-testid="input-project-code" /><div className="editor-actions"><button className="button button-primary button-small" onClick={runCode} data-testid="button-run-code"><Play size={13} /> Run check</button><button className="button button-ghost button-small" onClick={() => setCode(project.starter)} data-testid="button-reset-code"><RotateCcw size={13} /> Reset example</button></div>{feedback && <div className="feedback" data-testid="status-project-feedback">{feedback}</div>}<button className="button button-dark" style={{ marginTop: 24, width: '100%' }} onClick={completeProject} data-testid="button-complete-project">{done ? <><Check size={14} /> Project completed</> : <>I built this <Trophy size={14} /></>}</button></article>
      </div>
    </div>
  );
}

function OpportunitiesPage() {
  const opportunities = [
    { icon: UsersRound, title: 'Build for your people', badge: 'At home', text: 'Make a small helper for a family routine: a book list, plant tracker, recipe picker, or game night tool. Ask an adult what would actually help.' },
    { icon: BookOpen, title: 'Bring an idea to school', badge: 'With a teacher', text: 'Use Python for a class project, club demo, or science fair. A teacher can help you choose a safe question and decide what to share.' },
    { icon: Wrench, title: 'Run a supervised experiment', badge: 'With guidance', text: 'Try a tiny project for a community group or family friend with an adult involved from the beginning. Learning and feedback are the goal — not promised income.' },
  ];
  return (
    <div className="page">
      <div className="eyebrow">Explore ideas</div>
      <h1 className="page-title">Skills become useful<br />when they meet real life.</h1>
      <p className="page-intro">Python can help you notice a problem, make a tiny tool, and learn what people think. Start close to home and keep a trusted adult in the loop.</p>
      <div className="opportunity-list">{opportunities.map(({ icon: Icon, title, badge, text }) => <article className="card opportunity" key={title}><div className="opportunity-icon"><Icon size={19} /></div><div><h3>{title}</h3><p>{text}</p></div><span className="opportunity-badge">{badge}</span></article>)}</div>
      <div className="safety-callout"><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><LockKeyhole size={18} color="hsl(var(--accent))" /><h3>Good boundaries make brave builders</h3></div><p>Do not share your full name, school, location, passwords, or personal contact details. Do not message strangers about work. An adult should review any project, account, or conversation before you share it.</p></div>
      <div className="section-row"><h2 className="section-title">A simple experiment</h2></div>
      <div className="card" style={{ padding: 22 }}><div className="eyebrow">Notice → Make → Ask</div><p style={{ margin: '12px 0 0', color: 'hsl(var(--muted-foreground))', lineHeight: 1.7, fontSize: 13 }}>Write down one small repetitive task someone you trust has. Make a five-minute version in Python. Ask what would make it more helpful. That loop is real product thinking.</p></div>
    </div>
  );
}

function ProfilePage({ state, setState }: { state: AppState; setState: Dispatch<SetStateAction<AppState>> }) {
  const [nameInput, setNameInput] = useState(state.name);
  const [saved, setSaved] = useState(false);
  const saveName = () => { const name = nameInput.trim() || 'Builder'; setState((current) => ({ ...current, name })); setNameInput(name); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };
  const reset = () => { if (window.confirm('Reset your Funza Toto progress? This cannot be undone.')) setState({ ...defaultState, name: state.name }); };
  const badgeCount = state.completedLessons.length + state.completedProjects.length;
  return (
    <div className="page">
      <div className="eyebrow">Your profile</div><h1 className="page-title">A record of<br />what you can do.</h1><p className="page-intro">Keep your name, your wins, and your next small step in one place.</p>
      <div className="profile-layout">
        <aside className="card profile-card"><div className="profile-big-avatar">{initials(state.name)}</div><h2>{state.name}</h2><p>Curious builder · {state.streak} day streak</p><div className="stat-card" style={{ padding: '23px 0 0', justifyContent: 'center', background: 'transparent', boxShadow: 'none', border: 0 }}><div><div className="stat-number">{badgeCount}</div><div className="stat-label">things completed</div></div></div></aside>
        <div className="profile-details">
          <section className="card settings-card"><h2>Builder details</h2><label className="field-label" htmlFor="learner-name">What should we call you?</label><div className="form-row"><input id="learner-name" className="text-input" value={nameInput} onChange={(event) => setNameInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveName(); }} data-testid="input-learner-name" /><button className="button button-dark button-small" onClick={saveName} data-testid="button-save-name">{saved ? <><Check size={13} /> Saved</> : 'Save name'}</button></div></section>
          <section className="card settings-card"><h2>Badges in progress</h2><div className="badge-grid"><div className="badge"><span className="badge-icon"><Flame size={14} /></span><span><strong>Showing up</strong><br /><small>{state.streak} day streak</small></span></div><div className="badge"><span className="badge-icon"><Code2 size={14} /></span><span><strong>Code starter</strong><br /><small>{state.completedLessons.length} lessons</small></span></div><div className="badge"><span className="badge-icon"><Trophy size={14} /></span><span><strong>Maker</strong><br /><small>{state.completedProjects.length} projects</small></span></div></div></section>
          <section className="card settings-card"><div className="danger-row"><div><h2 style={{ marginBottom: 0 }}>Start fresh</h2><p>Reset lessons, projects, and streak. Your name stays.</p></div><button className="button button-danger button-small" onClick={reset} data-testid="button-reset-progress"><RotateCcw size={13} /> Reset</button></div></section>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return <div className="page"><div className="empty-state"><Code2 className="empty-icon" /><h3>That page wandered off</h3><p>Let’s get you back to a useful next step.</p><Link className="button button-primary" href="/" data-testid="link-back-home">Back to launchpad <ArrowRight size={14} /></Link></div></div>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [state, setState] = usePersistentState();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedErrorBoundary><div className="app-shell"><Shell state={state} setState={setState} /></div></RoutedErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;