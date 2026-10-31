// All portfolio content lives here, so copy can be edited without touching components.

export const profile = {
  name: "Kerlos Amir Girgis",
  firstName: "Kerlos",
  location: "Cairo, Egypt",
  email: "kerlos.girgis1@gmail.com",
  phone: "+20 112 111 2362",
  whatsapp:
    "https://wa.me/201121112362?text=Hello%20Kerlos%2C%20I%20would%20like%20to%20connect%20with%20you!",
  github: "https://github.com/KerlosGirgis",
  linkedin: "https://www.linkedin.com/in/kerlos-amir-7718762a3/",
  resume: "https://drive.google.com/file/d/1QMVk6k27WGlatZsWjDGi4FegFKzZpiu1/view?usp=drive_link",
  roles: ["Flutter Developer", "Mobile App Developer", "Web Developer"],
  intro:
    "A passionate Flutter & web developer from Cairo. I turn big ideas into polished, user-friendly mobile apps and websites — built on Clean Architecture and BLoC, and shipped to real users.",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "apps", label: "Apps" },
  { id: "websites", label: "Websites" },
  { id: "toolbox", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const stats = [
  { value: 7000, suffix: "+", label: "downloads of my Todo app" },
  { value: 14, suffix: "", label: "apps & websites shipped" },
  { value: 99.9, suffix: "%", label: "crash-free rate at ITI", decimals: 1 },
  { value: 28, suffix: "★", label: "GitHub stars on Todo" },
];

export const todaysPlan = [
  { text: "Wake up. It's summer!", done: true },
  { text: "Architect an e-commerce suite with BLoC", done: true },
  { text: "Encrypt every note with AES-256", done: true },
  { text: "Ship websites across Saudi Arabia & Egypt", done: true },
  { text: "Hit 7,000+ downloads", done: true },
  { text: "Build a rollercoaster in the backyard", done: false, note: "pending Mom's approval" },
];

export const quickFacts = [
  { icon: "pin", text: "Cairo, Egypt" },
  { icon: "cap", text: "B.Sc. Computer Science" },
  { icon: "chat", text: "Arabic & English" },
] as const;

export type Mission = {
  id: string;
  codename: string;
  role: string;
  org: string;
  period: string;
  kind: "work" | "training" | "education";
  status: "active" | "accomplished" | "graduated";
  briefing: string;
  results: string[];
  tags: string[];
};

export const missions: Mission[] = [
  {
    id: "elevate",
    codename: "Operation BLoC Party",
    role: "Flutter Developer Intern",
    org: "Elevate Tech",
    period: "Mar 2026 — Present",
    kind: "work",
    status: "active",
    briefing:
      "Architected a BLoC-based state management system for a suite of e-commerce apps, built on reusable Clean Architecture layers.",
    results: ["−30% code complexity", "+50% faster feature delivery"],
    tags: ["Flutter", "BLoC", "Clean Architecture", "E-commerce"],
  },
  {
    id: "iti",
    codename: "Operation Launch Pad",
    role: "Front-End & Cross-Platform Development Intern",
    org: "Information Technology Institute (ITI)",
    period: "Mar 2025 — Jul 2025",
    kind: "work",
    status: "accomplished",
    briefing:
      "Delivered production-ready Flutter applications, keeping them fast and stable through rigorous unit testing.",
    results: ["−20% app launch time", "99.9% crash-free rate"],
    tags: ["Flutter", "Unit testing", "Front-end"],
  },
  {
    id: "amit",
    codename: "Training Montage",
    role: "Flutter Development Program",
    org: "AMIT",
    period: "Jun 2024 — Oct 2024",
    kind: "training",
    status: "accomplished",
    briefing: "Completed an intensive Flutter development program covering the full journey from widgets to shipped apps.",
    results: [],
    tags: ["Flutter", "Dart"],
  },
  {
    id: "freelance",
    codename: "Operation Free Agent",
    role: "Freelance Flutter Developer",
    org: "Independent",
    period: "Dec 2023 — Present",
    kind: "work",
    status: "active",
    briefing:
      "Engineering cross-platform Flutter applications for diverse clients — optimizing widget trees and adding efficient local caching with Hive.",
    results: ["+15% frame-rate performance"],
    tags: ["Flutter", "Hive", "Performance"],
  },
  {
    id: "acu",
    codename: "Origin Story",
    role: "B.Sc. Computer Science",
    org: "Ahram Canadian University",
    period: "Oct 2018 — May 2022",
    kind: "education",
    status: "graduated",
    briefing: "Where it all began: algorithms, data structures and software engineering fundamentals.",
    results: [],
    tags: ["Computer Science"],
  },
];

export type AppLink = { kind: "github" | "fdroid"; label: string; href: string };

export type MobileApp = {
  slug: string;
  name: string;
  nickname: string;
  description: string;
  tags: string[];
  /** Number of screenshots in /public/media/apps/<slug>/NN.webp */
  screens: number;
  /** Intrinsic size of the screenshots */
  size: { w: number; h: number };
  links: AppLink[];
  badges?: string[];
  video?: { src: string; poster: string };
  /** Which screens (1-based) make up the card's phone fan: [front, left, right]. */
  cover: [number, number, number];
  /** Handwritten note scribbled on the blueprint. */
  note: string;
  /** Screenshots not ready yet: render the blueprint sketch instead. */
  blueprintOnly?: boolean;
  accent: string;
};

export const mobileApps: MobileApp[] = [
  {
    slug: "shoppy",
    name: "Shoppy",
    nickname: "the Shop-inator",
    description:
      "A Flutter e-commerce app with secure authentication and a personalized shopping experience. BLoC drives the complex flows — real-time cart sync and order tracking.",
    tags: ["Flutter", "BLoC", "Firebase Auth", "Firestore", "REST API"],
    screens: 10,
    size: { w: 900, h: 1905 },
    links: [{ kind: "github", label: "GitHub", href: "https://github.com/KerlosGirgis/Shoppy" }],
    cover: [1, 2, 9],
    note: "real-time cart sync!",
    accent: "#ff7a1a",
  },
  {
    slug: "digitalhouse",
    name: "DigitalHouse",
    nickname: "the Gadget-inator",
    description:
      "An Arabic-first electronics store: browse categories, compare product variants, fill the cart and check out with card payments — then track every order.",
    tags: ["Flutter", "RTL / Arabic", "E-commerce", "Card payments"],
    screens: 9,
    size: { w: 900, h: 1890 },
    links: [],
    video: { src: "/media/apps/digitalhouse/demo.mp4", poster: "/media/apps/digitalhouse/poster.webp" },
    cover: [1, 3, 5],
    note: "fully RTL!",
    accent: "#2a9fdc",
  },
  {
    slug: "todo",
    name: "Todo",
    nickname: "the Get-Things-Done-inator",
    description:
      "An offline, privacy-first to-do & notes app. Everything is encrypted with AES-256 and locked behind biometrics — no account, no cloud, no leaks.",
    tags: ["Flutter", "MVVM", "Provider", "SQFLite", "AES-256"],
    screens: 8,
    size: { w: 900, h: 1879 },
    links: [
      { kind: "github", label: "GitHub", href: "https://github.com/KerlosGirgis/Todo" },
      { kind: "fdroid", label: "F-Droid", href: "https://f-droid.org/en/packages/com.k.todo/" },
    ],
    badges: ["7,000+ downloads", "28 ★ on GitHub"],
    cover: [2, 1, 5],
    note: "AES-256 inside!",
    accent: "#2cc3b5",
  },
  {
    slug: "flower",
    name: "Flower App",
    nickname: "the Bloom-inator",
    description:
      "A Flutter app for ordering flowers. Still on the drawing board here — screenshots are coming soon.",
    tags: ["Flutter", "E-commerce"],
    screens: 0,
    size: { w: 900, h: 1890 },
    links: [],
    blueprintOnly: true,
    cover: [1, 1, 1],
    note: "petals TBD…",
    accent: "#ff8fc4",
  },
  {
    slug: "exam",
    name: "Exam App",
    nickname: "the Exam-inator",
    description:
      "A feature-based exam-prep app following Clean Architecture: browse subjects, take timed exams, get instant scores and review every answer.",
    tags: ["Flutter", "Clean Architecture", "Bloc / Cubit", "DI", "GoRouter"],
    screens: 6,
    size: { w: 900, h: 1879 },
    links: [{ kind: "github", label: "GitHub", href: "https://github.com/KerlosGirgis/ExamApp" }],
    cover: [3, 1, 4],
    note: "timer: 20 min!",
    accent: "#2f6fe0",
  },
  {
    slug: "alpha",
    name: "Alpha",
    nickname: "the Read-inator",
    description:
      "A bookstore app to read without limits: sign up or browse as a guest, explore categories, fill your cart and keep a list of favourites.",
    tags: ["Flutter", "Dart", "E-commerce"],
    screens: 6,
    size: { w: 900, h: 1905 },
    links: [{ kind: "github", label: "GitHub", href: "https://github.com/KerlosGirgis/alpha" }],
    cover: [4, 1, 5],
    note: "read w/o limits",
    accent: "#ff4d5e",
  },
];

export type Website = {
  slug: string;
  name: string;
  url: string;
  domain: string;
  description: string;
  location: string;
  kind: "built" | "edits";
  /** Height of /public/media/sites/<slug>/full.webp (width is 900) */
  fullHeight: number;
  facade: string;
  awning: string;
};

export const websites: Website[] = [
  {
    slug: "alriyada",
    name: "Al Riyada",
    url: "https://alriyada-sa.com/",
    domain: "alriyada-sa.com",
    description: "Construction & facades company",
    location: "Saudi Arabia",
    kind: "built",
    fullHeight: 3893,
    facade: "#ffe08a",
    awning: "#2a9fdc",
  },
  {
    slug: "mihwar",
    name: "Mihwar",
    url: "https://mihwarco.com/",
    domain: "mihwarco.com",
    description: "General contracting company",
    location: "Saudi Arabia",
    kind: "built",
    fullHeight: 2916,
    facade: "#ffc29a",
    awning: "#ff7a1a",
  },
  {
    slug: "arena",
    name: "Arena Capital",
    url: "https://arenaksa.com/",
    domain: "arenaksa.com",
    description: "Contracting & insulation company",
    location: "Riyadh",
    kind: "built",
    fullHeight: 4160,
    facade: "#b9ecc4",
    awning: "#2e8b57",
  },
  {
    slug: "celebrate",
    name: "Celebrate",
    url: "https://celebrate-eg.com/",
    domain: "celebrate-eg.com",
    description: "Digital marketing agency",
    location: "Egypt",
    kind: "built",
    fullHeight: 5365,
    facade: "#ffb3b3",
    awning: "#ff4d5e",
  },
  {
    slug: "digicraft",
    name: "DigiCraft",
    url: "https://digicraftsa.com/",
    domain: "digicraftsa.com",
    description: "Digital marketing agency",
    location: "Saudi Arabia",
    kind: "built",
    fullHeight: 6209,
    facade: "#c9c2ff",
    awning: "#5b4bd6",
  },
  {
    slug: "fajrdm",
    name: "Fajr",
    url: "https://fajrdm.com/",
    domain: "fajrdm.com",
    description: "Home services company",
    location: "Saudi Arabia",
    kind: "built",
    fullHeight: 4201,
    facade: "#bfe9ff",
    awning: "#1c4f92",
  },
  {
    slug: "fajradv",
    name: "Fajr Advanced",
    url: "https://fajradv.net/",
    domain: "fajradv.net",
    description: "Moving, A/C, cleaning & pest control",
    location: "Saudi Arabia",
    kind: "edits",
    fullHeight: 3126,
    facade: "#d6f5a6",
    awning: "#4f9d2a",
  },
  {
    slug: "cimilre",
    name: "Cimilre",
    url: "https://cimilresa.com/ar",
    domain: "cimilresa.com",
    description: "Online store for breast pumps",
    location: "Saudi Arabia",
    kind: "edits",
    fullHeight: 4524,
    facade: "#ffd0e6",
    awning: "#e0559a",
  },
];

export type Tool = { name: string; icon?: string };

export const toolbox: { label: string; note: string; tools: Tool[] }[] = [
  {
    label: "Mobile",
    note: "the main workbench",
    tools: [
      { name: "Flutter", icon: "flutter" },
      { name: "Dart", icon: "dart" },
      { name: "BLoC / Cubit" },
      { name: "Provider" },
      { name: "GetIt" },
      { name: "Injectable" },
      { name: "Dio" },
      { name: "Retrofit" },
      { name: "GoRouter" },
      { name: "Hive" },
      { name: "SQFLite" },
      { name: "Android", icon: "android" },
    ],
  },
  {
    label: "Architecture",
    note: "how it all fits together",
    tools: [
      { name: "Clean Architecture" },
      { name: "MVVM" },
      { name: "MVC" },
      { name: "Dependency Injection" },
      { name: "Unit Testing" },
      { name: "REST APIs" },
      { name: "JSON Serialization" },
    ],
  },
  {
    label: "Web",
    note: "for Main Street",
    tools: [
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React", icon: "react" },
      { name: "Angular", icon: "angular" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Sass", icon: "sass" },
      { name: "Node.js", icon: "nodejs" },
    ],
  },
  {
    label: "Backend & Data",
    note: "where the data sleeps",
    tools: [
      { name: "Firebase", icon: "firebase" },
      { name: "Supabase", icon: "supabase" },
      { name: "SQL", icon: "sqlite" },
    ],
  },
  {
    label: "Tools & Languages",
    note: "always within reach",
    tools: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "GitLab", icon: "gitlab" },
      { name: "Figma", icon: "figma" },
      { name: "Linux", icon: "linux" },
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cplusplus" },
    ],
  },
];

export const marqueeWords = [
  "Flutter",
  "Dart",
  "BLoC",
  "Clean Architecture",
  "Firebase",
  "Supabase",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "Angular",
  "Node.js",
  "Figma",
];

export const catchphrases = [
  "104 days of summer vacation",
  "Whatcha doin'?",
  "I know what we're gonna build today!",
  "Where's Perry?",
  "Ferb, hand me the wrench",
  "Aren't you a little young to be a developer?",
];
