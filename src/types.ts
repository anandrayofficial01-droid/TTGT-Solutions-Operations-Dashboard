export enum ClientStatus {
  Active = "Active",
  Inactive = "Inactive",
  Suspended = "Suspended",
}

export interface Client {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  agreementDate: string;
  status: ClientStatus;
}

export enum StoreStatus {
  Active = "Active",
  Inactive = "Inactive",
  UnderReview = "Under Review",
  Suspended = "Suspended",
}

export interface Store {
  id: string;
  storeName: string;
  clientName: string;
  marketplace: string;
  storeId: string;
  launchDate: string;
  status: StoreStatus;
  performanceScore: number; // 0-100
}

export interface Marketplace {
  name: string;
  storeLinked: number;
  loginStatus: "Connected" | "Disconnected" | "Re-auth Required";
  lastSync: string;
  healthScore: number;
  revenue: number;
  orderVolume: number;
}

export interface InventoryItem {
  sku: string;
  productName: string;
  category: string;
  storeName: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  costPrice: number;
  sellingPrice: number;
  inventoryValue: number;
}

export enum OrderStatus {
  New = "New",
  Processing = "Processing",
  Packed = "Packed",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Returned = "Returned",
  RTO = "RTO",
}

export interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  product: string;
  quantity: number;
  marketplace: string;
  store: string;
  status: OrderStatus;
  courier: string;
  trackingNumber: string;
  revenue: number;
  phone?: string;
  awb?: string;
  paymentStatus?: "Paid" | "Pending" | "Refunded" | "COD";
  paymentMethod?: string;
  city?: string;
  state?: string;
  address?: string;
  billingAddress?: string;
  weight?: string;
  dimensions?: string;
  rawJson?: string;
  historyLogs?: Array<{ timestamp: string; description: string; location: string; status: string }>;
}

export interface ReturnOrder {
  id: string;
  orderId: string;
  storeName: string;
  marketplace: string;
  productName: string;
  returnReason: string;
  type: "Return" | "RTO";
  refundStatus: "Pending" | "Refunded" | "Rejected";
  date: string;
}

export enum SellerStatus {
  Active = "Active",
  Suspended = "Suspended",
  Pending = "Pending",
}

export interface Seller {
  id: string;
  sellerName: string;
  companyName: string;
  email: string;
  phone: string;
  status: SellerStatus;
  joinedDate: string;
  storeCount: number;
}

export enum UserRole {
  SuperAdmin = "Super Admin",
  OperationsManager = "Operations Manager",
  TeamLeader = "Team Leader",
  Executive = "Executive",
  ReadOnly = "Read Only User",
  CEO = "Chief Executive Officer",
  WarehouseManager = "Warehouse Manager",
  FinanceManager = "Finance Manager",
  CustomerSupport = "Customer Support",
  SalesTeam = "Sales Team",
  HR = "Human Resource Manager",
  Employee = "Operational Employee",
}

export interface OperationNotification {
  id: string;
  type: "Low Stock" | "Delayed Order" | "High Return Rate" | "RTO Spike" | "Store Suspension" | "Failed Sync" | "Generic";
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: "Google Sheets" | "API Webhook" | "REST Client";
  sheetName?: string;
  status: "Success" | "Failed" | "Retrying";
  recordsProcessed: number;
  details: string;
  errorCount: number;
}
