export type Job = {
  id: string;
  title: string;
  role: string;
  team: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export const JOBS: Job[] = [
  {
    id: "full-stack-developer", title: "Full-Stack Developer", role: "Developer", team: "Engineering",
    summary: "Build dependable web applications, APIs, and integrations that make everyday work easier for our clients.",
    responsibilities: ["Turn product requirements into accessible, responsive interfaces and reliable APIs.", "Design data models and integrations with security, performance, and maintainability in mind.", "Write tests, review code, and take features through release and production support.", "Work with designers and project leads to explain tradeoffs and keep delivery predictable."],
    requirements: ["Experience shipping and supporting production software.", "Strong JavaScript or TypeScript skills and experience with a modern frontend framework.", "Comfort working with APIs, relational databases, version control, and automated testing.", "Clear communication and the ability to work independently within a collaborative team."],
    niceToHave: ["React, Next.js, Node.js, or Python experience.", "Cloud deployment, CI/CD, or mobile development experience.", "Experience with payments, client portals, or sensitive business workflows."],
  },
  {
    id: "ux-designer", title: "UX Designer", role: "UX Designer", team: "Design",
    summary: "Make complex workflows feel simple through thoughtful research, clear interaction design, and accessible interfaces.",
    responsibilities: ["Understand user needs through interviews, workflow reviews, and usability testing.", "Create user journeys, wireframes, and prototypes that make product decisions concrete.", "Design responsive interfaces and reusable components in close collaboration with engineers.", "Present design decisions, incorporate feedback, and review the implemented experience."],
    requirements: ["A portfolio or project examples that explain your process and contribution.", "Experience designing digital products from discovery through implementation.", "Proficiency with Figma or comparable design tools.", "A working understanding of accessibility, responsive design, and usability research."],
    niceToHave: ["Experience with design systems or complex B2B products.", "Comfort with analytics, experimentation, and content design.", "Basic HTML/CSS knowledge and experience partnering with frontend engineers."],
  },
  {
    id: "project-manager", title: "Project Manager", role: "Project Manager", team: "Delivery",
    summary: "Keep clients and delivery teams aligned on scope, priorities, risks, and the next meaningful milestone.",
    responsibilities: ["Plan delivery milestones, track dependencies, and make ownership clear.", "Run practical project routines and communicate progress, decisions, and risks.", "Manage scope changes and help teams balance quality, timing, and budget.", "Coordinate client reviews, acceptance, launch readiness, and handover."],
    requirements: ["Experience coordinating software or digital product delivery.", "Strong organization, written communication, and stakeholder management skills.", "Ability to surface risks early and turn ambiguity into actionable next steps.", "Familiarity with agile delivery, project tracking tools, and distributed teams."],
    niceToHave: ["Agency or consulting experience with multiple stakeholders.", "Technical background or experience leading integrations and migrations.", "PMP, Scrum, or similar training supported by hands-on delivery experience."],
  },
  {
    id: "business-analyst", title: "Business Analyst", role: "Business Analyst", team: "Delivery",
    summary: "Translate business problems into clear requirements and help teams build the changes that matter most.",
    responsibilities: ["Facilitate discovery conversations and map current and future workflows.", "Write clear requirements, user stories, acceptance criteria, and process documentation.", "Identify gaps, dependencies, and opportunities to simplify how work gets done.", "Partner with delivery teams on validation, user acceptance testing, and adoption."],
    requirements: ["Experience analyzing business processes and defining software requirements.", "Strong facilitation, documentation, and analytical problem-solving skills.", "Ability to communicate with both technical teams and business stakeholders.", "Experience prioritizing requirements and validating delivered outcomes."],
    niceToHave: ["SQL, data analysis, or reporting experience.", "Familiarity with CRM systems, client operations, or regulated workflows.", "Experience with process modeling, API integrations, or automation projects."],
  },
  {
    id: "data-scientist", title: "Data Scientist", role: "Data Scientist", team: "Data & AI",
    summary: "Turn business data into trustworthy analysis, useful predictions, and decisions people can act on.",
    responsibilities: ["Frame business questions, assess data quality, and define measurable success criteria.", "Explore datasets, build models, and evaluate results with appropriate statistical methods.", "Communicate findings and limitations to technical and business audiences.", "Work with engineers to make analytical work reproducible and useful in production."],
    requirements: ["Strong Python, SQL, and practical statistical analysis skills.", "Experience with data preparation, predictive modeling, and model evaluation.", "Ability to explain uncertainty, assumptions, and limitations clearly.", "Evidence of applying analysis or models to a real business problem."],
    niceToHave: ["Experiment design, forecasting, or causal inference experience.", "Experience with cloud data platforms and production model monitoring.", "Domain experience in service operations, healthcare, finance, or marketplaces."],
  },
  {
    id: "ml-engineer", title: "ML Engineer", role: "ML Engineer", team: "Data & AI",
    summary: "Take machine learning from experimentation to reliable services that can be deployed, measured, and maintained.",
    responsibilities: ["Build training, evaluation, and inference pipelines with reproducible results.", "Package and deploy models through APIs or batch workflows.", "Monitor model quality, latency, cost, and operational reliability.", "Partner with data scientists and product teams on data requirements and production tradeoffs."],
    requirements: ["Strong Python and software engineering fundamentals.", "Experience deploying or maintaining machine learning systems.", "Familiarity with an ML framework, model evaluation, and data pipelines.", "Comfort with testing, containers, cloud infrastructure, and version control."],
    niceToHave: ["PyTorch, scikit-learn, MLflow, or comparable tools.", "Experience with feature pipelines, model drift, or inference optimization.", "Familiarity with LLM serving, embeddings, or vector search."],
  },
  {
    id: "genai-engineer", title: "GenAI Engineer", role: "GenAI Engineer", team: "Data & AI",
    summary: "Build useful AI features and assistants with clear evaluation, thoughtful safeguards, and dependable integrations.",
    responsibilities: ["Design and build retrieval, tool-use, and document-processing workflows.", "Create evaluations that measure answer quality, reliability, and business usefulness.", "Integrate models with existing products, data sources, and business systems.", "Track latency and cost, handle failure modes, and improve systems from real feedback."],
    requirements: ["Strong Python or TypeScript skills and experience building APIs.", "Hands-on experience with LLM applications, retrieval, or tool calling.", "Understanding of grounding, evaluation, privacy, and common model failure modes.", "Ability to turn an early prototype into a tested, maintainable product feature."],
    niceToHave: ["Experience with voice interfaces, multimodal models, or agent workflows.", "Vector databases, search relevance, or data engineering experience.", "Familiarity with model observability, red-team testing, or human review workflows."],
  },
];

export const JOB_TERMS = {
  location: "Tysons, VA or remote",
  type: "Full-time or contract",
  pay: "Compensation is based on experience, location, and engagement type. We discuss the range during the initial conversation.",
  benefits: ["Remote and Tysons-based opportunities, depending on the project.", "Direct collaboration with experienced engineers, designers, and delivery leads.", "Exposure to a range of products, industries, and technical challenges.", "A clear scope, practical feedback, and room to grow your craft. Specific benefits are confirmed with the offer and vary by engagement."],
  expectations: ["Clear priorities and honest conversations about scope and timelines.", "Context about the customer problem, not just a list of tickets.", "Constructive reviews and a team that shares responsibility for quality."],
  culture: ["Own the outcome: think beyond your task and care about what happens after launch.", "Communicate early: share progress, raise concerns, and make decisions visible.", "Stay curious: ask questions, test assumptions, and keep improving how we work."],
};
