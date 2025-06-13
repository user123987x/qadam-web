export type UserRole = "employer" | "worker" | "supplier";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "paused";
  progress: number;
  totalArea: number;
  completedArea: number;
  location: string;
  budget: number;
  spentAmount: number;
  assignedWorkers: string[];
  materials: Material[];
  workLogs: WorkLog[];
}

export interface WorkLog {
  id: string;
  workerId: string;
  workerName: string;
  projectId: string;
  date: string;
  areaCompleted: number;
  description: string;
  ratePerSquareMeter: number;
  earnings: number;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  totalQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  pricePerUnit: number;
  supplier: string;
  deliveryDate: string;
}

export interface MaterialUsage {
  id: string;
  materialId: string;
  materialName: string;
  projectId: string;
  workerId: string;
  workerName: string;
  quantityUsed: number;
  date: string;
  notes?: string;
}

export interface Worker {
  id: string;
  name: string;
  specialization: string;
  ratePerSquareMeter: number;
  totalEarnings: number;
  projectsAssigned: string[];
  phone: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  materials: string[];
}

export interface MaterialRequest {
  id: string;
  workerId: string;
  workerName: string;
  projectId: string;
  projectName: string;
  materialName: string;
  requestedQuantity: number;
  unit: string;
  urgency: "low" | "medium" | "high";
  reason: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  requestDate: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalWorkers: number;
  totalEarnings: number;
  materialAlerts: number;
  pendingRequests?: number;
}
