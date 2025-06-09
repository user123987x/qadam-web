import { Project, WorkLog, Material, Worker, Supplier, User } from "./types";

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmad Rahimi",
    role: "employer",
    email: "ahmad@construction.tj",
    avatar: "👨‍💼",
  },
  {
    id: "2",
    name: "Farid Nazarov",
    role: "worker",
    email: "farid@worker.tj",
    avatar: "👷‍♂️",
  },
  {
    id: "3",
    name: "Gulnora Supply Co.",
    role: "supplier",
    email: "info@gulnora.tj",
    avatar: "🏢",
  },
];

// Mock projects data
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Residential Complex A",
    description: "Construction of 3-story residential building in Dushanbe",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    status: "active",
    progress: 65,
    totalArea: 1200,
    completedArea: 780,
    location: "Dushanbe, Tajikistan",
    budget: 250000,
    spentAmount: 162500,
    assignedWorkers: ["worker-1", "worker-2", "worker-3"],
    materials: [],
    workLogs: [],
  },
  {
    id: "proj-2",
    name: "Office Building B",
    description: "Modern office complex with glass facade",
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    status: "active",
    progress: 30,
    totalArea: 800,
    completedArea: 240,
    location: "Khujand, Tajikistan",
    budget: 180000,
    spentAmount: 54000,
    assignedWorkers: ["worker-2", "worker-4"],
    materials: [],
    workLogs: [],
  },
  {
    id: "proj-3",
    name: "School Renovation",
    description: "Complete renovation of local school building",
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    status: "completed",
    progress: 100,
    totalArea: 600,
    completedArea: 600,
    location: "Khorog, Tajikistan",
    budget: 120000,
    spentAmount: 118000,
    assignedWorkers: ["worker-1", "worker-3"],
    materials: [],
    workLogs: [],
  },
];

// Mock workers data
export const mockWorkers: Worker[] = [
  {
    id: "worker-1",
    name: "Farid Nazarov",
    specialization: "Mason",
    ratePerSquareMeter: 15,
    totalEarnings: 23400,
    projectsAssigned: ["proj-1", "proj-3"],
    phone: "+992 92 123 4567",
  },
  {
    id: "worker-2",
    name: "Jamshid Karimov",
    specialization: "Carpenter",
    ratePerSquareMeter: 18,
    totalEarnings: 18900,
    projectsAssigned: ["proj-1", "proj-2"],
    phone: "+992 93 234 5678",
  },
  {
    id: "worker-3",
    name: "Sanjar Mirzaev",
    specialization: "Electrician",
    ratePerSquareMeter: 20,
    totalEarnings: 16800,
    projectsAssigned: ["proj-1", "proj-3"],
    phone: "+992 91 345 6789",
  },
  {
    id: "worker-4",
    name: "Rustam Asadov",
    specialization: "Painter",
    ratePerSquareMeter: 12,
    totalEarnings: 8640,
    projectsAssigned: ["proj-2"],
    phone: "+992 95 456 7890",
  },
];

// Mock materials data
export const mockMaterials: Material[] = [
  {
    id: "mat-1",
    name: "Cement",
    unit: "kg",
    totalQuantity: 5000,
    usedQuantity: 3200,
    remainingQuantity: 1800,
    pricePerUnit: 0.8,
    supplier: "Gulnora Supply Co.",
    deliveryDate: "2024-01-10",
  },
  {
    id: "mat-2",
    name: "Steel Rebar",
    unit: "kg",
    totalQuantity: 2000,
    usedQuantity: 1300,
    remainingQuantity: 700,
    pricePerUnit: 2.5,
    supplier: "Metallstroy LLC",
    deliveryDate: "2024-01-12",
  },
  {
    id: "mat-3",
    name: "Fiberglass",
    unit: "m²",
    totalQuantity: 800,
    usedQuantity: 520,
    remainingQuantity: 280,
    pricePerUnit: 12,
    supplier: "Gulnora Supply Co.",
    deliveryDate: "2024-01-15",
  },
  {
    id: "mat-4",
    name: "Paint",
    unit: "L",
    totalQuantity: 300,
    usedQuantity: 45,
    remainingQuantity: 255,
    pricePerUnit: 8,
    supplier: "ColorMax Trading",
    deliveryDate: "2024-02-01",
  },
];

// Mock work logs
export const mockWorkLogs: WorkLog[] = [
  {
    id: "log-1",
    workerId: "worker-1",
    workerName: "Farid Nazarov",
    projectId: "proj-1",
    date: "2024-01-20",
    areaCompleted: 25,
    description: "Completed masonry work on ground floor east wall",
    ratePerSquareMeter: 15,
    earnings: 375,
  },
  {
    id: "log-2",
    workerId: "worker-2",
    workerName: "Jamshid Karimov",
    projectId: "proj-1",
    date: "2024-01-20",
    areaCompleted: 18,
    description: "Installed wooden framework for windows",
    ratePerSquareMeter: 18,
    earnings: 324,
  },
  {
    id: "log-3",
    workerId: "worker-1",
    workerName: "Farid Nazarov",
    projectId: "proj-1",
    date: "2024-01-21",
    areaCompleted: 30,
    description: "Continued masonry work on ground floor",
    ratePerSquareMeter: 15,
    earnings: 450,
  },
];

// App navigation items
export const navigationItems = [
  { key: "home", label: "Home", icon: "🏠", path: "/" },
  { key: "projects", label: "Projects", icon: "🏗️", path: "/projects" },
  { key: "add", label: "Add Entry", icon: "➕", path: "/add-entry" },
  { key: "profile", label: "Profile", icon: "👤", path: "/profile" },
];

// Material units
export const materialUnits = ["kg", "m²", "L", "pcs", "m³", "m"];

// Project statuses
export const projectStatuses = [
  { value: "planning", label: "Planning", color: "bg-yellow-500" },
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "paused", label: "Paused", color: "bg-orange-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
];

// Worker specializations
export const workerSpecializations = [
  "Mason",
  "Carpenter",
  "Electrician",
  "Plumber",
  "Painter",
  "Roofer",
  "Welder",
  "General Labor",
];
