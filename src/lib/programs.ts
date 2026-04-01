export interface Program {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: string;
  description: string;
  icon: string;
  highlights: string[];
}

export const programs: Program[] = [
  {
    id: "1",
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    price: 220000,
    duration: "12 weeks",
    description: "Master artificial intelligence and machine learning algorithms. Build intelligent systems using Python, TensorFlow, and PyTorch. From neural networks to natural language processing.",
    icon: "Brain",
    highlights: ["Deep Learning & Neural Networks", "Natural Language Processing", "Computer Vision", "Model Deployment"],
  },
  {
    id: "2",
    name: "Software Engineering",
    slug: "software-engineering",
    price: 200000,
    duration: "12 weeks",
    description: "Learn software engineering principles, design patterns, and best practices. Build scalable applications with modern architectures and agile methodologies.",
    icon: "Code2",
    highlights: ["Design Patterns", "System Architecture", "Agile & Scrum", "Testing & CI/CD"],
  },
  {
    id: "3",
    name: "Cybersecurity",
    slug: "cybersecurity",
    price: 200000,
    duration: "12 weeks",
    description: "Protect digital assets and infrastructure. Learn ethical hacking, penetration testing, network security, and incident response strategies.",
    icon: "Shield",
    highlights: ["Ethical Hacking", "Penetration Testing", "Network Security", "Incident Response"],
  },
  {
    id: "4",
    name: "Data Science",
    slug: "data-science",
    price: 180000,
    duration: "12 weeks",
    description: "Transform data into actionable insights. Master statistics, data visualization, machine learning, and big data technologies.",
    icon: "BarChart3",
    highlights: ["Statistical Analysis", "Data Visualization", "Big Data Tools", "Predictive Modeling"],
  },
  {
    id: "5",
    name: "Cloud Computing",
    slug: "cloud-computing",
    price: 170000,
    duration: "12 weeks",
    description: "Design and deploy cloud infrastructure on AWS, Azure, and GCP. Learn cloud architecture, serverless computing, and cloud security.",
    icon: "Cloud",
    highlights: ["AWS & Azure & GCP", "Cloud Architecture", "Serverless", "Cloud Security"],
  },
  {
    id: "6",
    name: "Full Stack Web Development",
    slug: "full-stack-web-development",
    price: 150000,
    duration: "12 weeks",
    description: "Build complete web applications from frontend to backend. Master React, Node.js, databases, and deployment pipelines.",
    icon: "Globe",
    highlights: ["React & Next.js", "Node.js & Express", "Database Design", "API Development"],
  },
  {
    id: "7",
    name: "Mobile App Development",
    slug: "mobile-app-development",
    price: 150000,
    duration: "12 weeks",
    description: "Create cross-platform mobile applications. Master React Native, Flutter, and native development for iOS and Android.",
    icon: "Smartphone",
    highlights: ["React Native", "Flutter", "iOS & Android", "App Store Deployment"],
  },
  {
    id: "8",
    name: "DevOps Engineering",
    slug: "devops-engineering",
    price: 170000,
    duration: "12 weeks",
    description: "Bridge development and operations. Master CI/CD pipelines, containerization, infrastructure as code, and monitoring.",
    icon: "Settings",
    highlights: ["Docker & Kubernetes", "CI/CD Pipelines", "Infrastructure as Code", "Monitoring & Logging"],
  },
  {
    id: "9",
    name: "Blockchain Development",
    slug: "blockchain-development",
    price: 180000,
    duration: "12 weeks",
    description: "Build decentralized applications and smart contracts. Learn Solidity, Web3, DeFi protocols, and blockchain architecture.",
    icon: "Link",
    highlights: ["Smart Contracts", "Solidity & Web3", "DeFi Protocols", "dApp Development"],
  },
  {
    id: "10",
    name: "Game Development",
    slug: "game-development",
    price: 160000,
    duration: "12 weeks",
    description: "Create immersive games using Unity and Unreal Engine. Learn game design, 3D modeling, physics engines, and multiplayer networking.",
    icon: "Gamepad2",
    highlights: ["Unity & Unreal Engine", "Game Design", "3D Modeling", "Multiplayer Systems"],
  },
  {
    id: "11",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    price: 120000,
    duration: "12 weeks",
    description: "Design beautiful, user-centered digital experiences. Master Figma, prototyping, user research, and design systems.",
    icon: "Palette",
    highlights: ["Figma & Design Tools", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: "12",
    name: "Network Engineering",
    slug: "network-engineering",
    price: 130000,
    duration: "12 weeks",
    description: "Design and manage enterprise networks. Master routing, switching, network security, and wireless technologies.",
    icon: "Network",
    highlights: ["Routing & Switching", "Network Security", "Wireless Technologies", "Network Monitoring"],
  },
  {
    id: "13",
    name: "Database Administration",
    slug: "database-administration",
    price: 120000,
    duration: "12 weeks",
    description: "Manage and optimize enterprise databases. Master SQL, NoSQL, database security, backup strategies, and performance tuning.",
    icon: "Database",
    highlights: ["SQL & NoSQL", "Performance Tuning", "Backup & Recovery", "Database Security"],
  },
  {
    id: "14",
    name: "Internet of Things (IoT)",
    slug: "internet-of-things",
    price: 140000,
    duration: "12 weeks",
    description: "Build connected devices and IoT ecosystems. Learn embedded systems, sensor networks, edge computing, and IoT security.",
    icon: "Cpu",
    highlights: ["Embedded Systems", "Sensor Networks", "Edge Computing", "IoT Security"],
  },
];

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
