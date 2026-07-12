/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Edit this file to update the site — components only render it.
 *
 *  ⚠ TODO (Prashant): the three GitHub repo URLs below were marked
 *    as placeholders in your resume source — confirm them before deploy.
 * ─────────────────────────────────────────────────────────────
 */

export const identity = {
  name: "Prashant Yadav",
  firstName: "PRASHANT",
  lastName: "YADAV",
  role: "SOFTWARE DEVELOPER · AI/ML ENGINEER",
  tagline: "Building intelligent systems end-to-end.",
  location: "Lucknow, India",
  coordinates: "26°51'N 80°57'E",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  email: "ydvprashant0508@gmail.com",
  github: "https://github.com/YdvPrashant",
  githubHandle: "YdvPrashant",
  linkedin: "https://linkedin.com/in/pr7nt",
  linkedinHandle: "pr7nt",
  availability: "OPEN TO SWE / AI-ML ROLES",
  /** Drop this file into public/ to activate the download button. */
  resumePdf: "/Prashant_Yadav_Resume.pdf",
  siteUrl: "https://prashantyadav.dev", // update after deploy
};

/** Chips under the hero name. */
export const heroMeta = [
  "B.TECH CSE '25",
  "LUCKNOW, INDIA",
  "OPEN TO SWE / AI-ML ROLES",
];

/** 02/ABOUT manifesto — web voice, resume facts. */
export const about = {
  lede: "I ship the product — and train the model behind it.",
  paragraphs: [
    "Web products with Next.js and TypeScript on one side; the models that make them intelligent — PyTorch, computer vision, retrieval-augmented LLMs — on the other. My flagship, Prism, is a deployed news-transparency platform that grounds LLM fact-check verdicts in live web citations.",
    "Underneath it all: a solid DSA foundation in C++ and Python, 300+ LeetCode problems deep, and a habit of building systems that degrade gracefully instead of crashing.",
  ],
};

export const education = {
  school: "Lovely Professional University",
  place: "Phagwara, Punjab, India",
  degree: "B.Tech in Computer Science Engineering",
  graduated: "July 2025",
  coursework: [
    "Data Structures & Algorithms",
    "Operating Systems",
    "Database Management Systems",
    "Object-Oriented Programming",
  ],
};

export type Stat = { value: number; suffix?: string; label: string };

export const stats: Stat[] = [
  { value: 300, suffix: "+", label: "LeetCode problems solved" },
  { value: 1600, suffix: "+", label: "LeetCode contest rating" },
  { value: 15, suffix: "+", label: "Projects engineered" },
  { value: 1, label: "Platform live in production" },
];

export type Project = {
  index: string;
  title: string;
  subtitle: string;
  pitch: string;
  bullets: string[];
  tech: string[];
  links: { live?: string; github: string };
  metrics?: { value: string; label: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    index: "001",
    title: "PRISM",
    subtitle: "News transparency & bias analysis platform",
    pitch:
      "Refracts any article, YouTube link, or pasted text into a six-stage transparency analysis — claim classification, source provenance, live fact-checking, and cross-outlet coverage gaps.",
    bullets: [
      "Deployed full-stack platform: sentence-level claim/opinion/rhetoric classification, source forensics, and coverage-gap comparison across outlets.",
      "RAG fact-checking pipeline ranks an article's most salient claims, searches them against live web sources, and grounds Llama 3.3 70B verdicts in real citations — with a ≥2-source backfill so no verdict rests on a single proof.",
      "Resilient by design: fail-open Redis caching, per-IP rate limiting, keyless RDAP/DNS/IP forensics and YouTube transcript extraction — degrading gracefully when a dependency is absent.",
    ],
    tech: ["Next.js", "TypeScript", "React", "Tailwind", "Node.js", "Groq · Llama 3.3 70B", "RAG", "Redis"],
    links: {
      live: "https://www.prismrefractor.in/",
      github: "https://github.com/YdvPrashant/PrismNews", // TODO: confirm repo URL
    },
    featured: true,
  },
  {
    index: "002",
    title: "SENTINEL VISION",
    subtitle: "Real-time surveillance threat detection",
    pitch:
      "A multi-stage computer-vision pipeline that watches video streams for conflict, weapons, and crowd risk — scoring threats in real time.",
    bullets: [
      "Chains a Swin Transformer conflict classifier, a fine-tuned YOLOv8 weapon detector, and a crowd-density estimator into one unified threat-scoring engine.",
      "Trained on a custom-labelled surveillance dataset with targeted augmentation and class balancing to cut false positives on crowded, visually ambiguous scenes.",
      "GPU-accelerated CUDA inference loop decodes, preprocesses, and scores frames in real time, overlaying live alerts on streams and recorded footage.",
    ],
    tech: ["Python", "PyTorch", "YOLOv8", "Swin Transformer", "OpenCV", "CUDA"],
    links: {
      github: "https://github.com/YdvPrashant/Ultimate_Conflict_Detection", // TODO: confirm repo URL
    },
    metrics: [
      { value: "83%", label: "RECALL" },
      { value: "75%", label: "PRECISION" },
      { value: "0.79", label: "F1 SCORE" },
    ],
  },
  {
    index: "003",
    title: "LEDGERFLOW",
    subtitle: "Invoice management platform",
    pitch:
      "A full-lifecycle MERN invoicing platform — clients, invoices, and revenue analytics from draft to overdue.",
    bullets: [
      "Full-stack MERN platform with JWT authentication, client management, and invoice creation over a self-designed REST API.",
      "Responsive React dashboard with PDF export and revenue / paid / outstanding analytics powered by MongoDB aggregation pipelines.",
      "Complete invoice lifecycle (draft → sent → paid → overdue) with automatic status transitions, searchable paginated listings, and schema validation on every route.",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "REST API", "JWT"],
    links: {
      github: "https://github.com/YdvPrashant/Invoice-System", // TODO: confirm repo URL
    },
  },
];

/** 04/WORK — poster header + archive copy (rendered by Work.tsx). */
export const workCopy = {
  poster:
    "THREE FLAGSHIP SYSTEMS — ONE IN PRODUCTION, ONE WATCHING VIDEO STREAMS, ONE MOVING MONEY. THE ARCHIVE HOLDS THE REST.",
  archiveNote: "SMALLER BUILDS & EXPERIMENTS — SOURCE ON GITHUB.",
};

/** Compact archive of smaller builds — renders in 04/WORK once non-empty. */
export type ArchiveProject = {
  title: string;
  desc: string;
  tech: string[];
  links: { github?: string; live?: string };
  year?: string;
};

// ⚠ TODO (Prashant): these four entries are PLACEHOLDERS so you can see the
// archive grid working. Replace them with your real projects (you have 15+;
// list the best 4–8 here) — title, one-liner, tech, link. Delete the rest.
export const otherProjects: ArchiveProject[] = [
  {
    title: "YOUR PROJECT 004",
    desc: "Replace this entry in src/data/resume.ts — title, one-liner, tech, link.",
    tech: ["EDIT", "ME"],
    links: { github: identity.github },
    year: "20XX",
  },
  {
    title: "YOUR PROJECT 005",
    desc: "Replace this entry in src/data/resume.ts — title, one-liner, tech, link.",
    tech: ["EDIT", "ME"],
    links: { github: identity.github },
    year: "20XX",
  },
  {
    title: "YOUR PROJECT 006",
    desc: "Replace this entry in src/data/resume.ts — title, one-liner, tech, link.",
    tech: ["EDIT", "ME"],
    links: { github: identity.github },
    year: "20XX",
  },
  {
    title: "YOUR PROJECT 007",
    desc: "Replace this entry in src/data/resume.ts — title, one-liner, tech, link.",
    tech: ["EDIT", "ME"],
    links: { github: identity.github },
    year: "20XX",
  },
];

export type SkillGroup = { index: string; label: string; items: string[] };

export const skills: SkillGroup[] = [
  { index: "03.1", label: "LANGUAGES", items: ["C++", "Python", "JavaScript", "TypeScript", "SQL"] },
  { index: "03.2", label: "FRONTEND", items: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"] },
  { index: "03.3", label: "BACKEND", items: ["Node.js", "Express", "REST APIs", "JWT Auth"] },
  { index: "03.4", label: "AI / ML", items: ["PyTorch", "OpenCV", "YOLOv8", "Deep Learning", "Computer Vision", "LLMs", "RAG", "Prompt Engineering"] },
  { index: "03.5", label: "DATABASES", items: ["MongoDB", "MySQL", "Redis"] },
  { index: "03.6", label: "TOOLS", items: ["Git", "GitHub", "Docker", "CI/CD", "Vercel", "AWS", "Postman", "Linux"] },
];

export const competitive = {
  headline: "LEETCODE",
  lines: ["300+ problems solved", "1600+ contest rating"],
};

/** Future jobs go here — 04/WORK renders them automatically once non-empty. */
export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};
export const experience: Experience[] = [];

/** Site navigation — index numbers are the HUD section numbers. */
export const navLinks = [
  { index: "02", label: "ABOUT", href: "#about" },
  { index: "03", label: "STACK", href: "#stack" },
  { index: "04", label: "WORK", href: "#work" },
  { index: "05", label: "CONTACT", href: "#contact" },
];
