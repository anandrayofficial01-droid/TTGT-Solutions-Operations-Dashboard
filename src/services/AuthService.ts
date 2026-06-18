/**
 * TTGT Solutions Commerce Operations Platform
 * Authentication and Enterprise RBAC Service Class
 */

import { UserRole } from "../types";

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  isMfaVerified?: boolean;
  mfaBackupCount?: number;
}

// Enterprise Permissions Registry
export type Permission =
  | "read:dashboard"
  | "read:orders"
  | "write:orders"
  | "read:inventory"
  | "write:inventory"
  | "read:clients"
  | "write:clients"
  | "read:sellers"
  | "write:sellers"
  | "read:stores"
  | "write:stores"
  | "read:finance"
  | "write:finance"
  | "read:employees"
  | "write:employees"
  | "read:integrations"
  | "write:integrations"
  | "read:reports"
  | "read:logs";

// Core Role to Privileges bounds mapping
export const RolePermissionsMap: Record<UserRole, Permission[]> = {
  [UserRole.SuperAdmin]: [
    "read:dashboard", "read:orders", "write:orders", "read:inventory", "write:inventory",
    "read:clients", "write:clients", "read:sellers", "write:sellers", "read:stores", "write:stores",
    "read:finance", "write:finance", "read:employees", "write:employees", "read:integrations",
    "write:integrations", "read:reports", "read:logs"
  ],
  [UserRole.CEO]: [
    "read:dashboard", "read:orders", "read:inventory", "read:clients", "read:sellers",
    "read:stores", "read:finance", "read:employees", "read:integrations", "read:reports", "read:logs"
  ],
  [UserRole.OperationsManager]: [
    "read:dashboard", "read:orders", "write:orders", "read:inventory", "write:inventory",
    "read:stores", "write:stores", "read:integrations", "read:reports", "read:logs"
  ],
  [UserRole.WarehouseManager]: [
    "read:dashboard", "read:orders", "write:orders", "read:inventory", "write:inventory",
    "read:reports"
  ],
  [UserRole.FinanceManager]: [
    "read:dashboard", "read:orders", "read:finance", "write:finance", "read:reports"
  ],
  [UserRole.CustomerSupport]: [
    "read:dashboard", "read:orders", "write:orders", "read:clients", "read:sellers"
  ],
  [UserRole.HR]: [
    "read:dashboard", "read:employees", "write:employees"
  ],
  [UserRole.SalesTeam]: [
    "read:dashboard", "read:stores", "write:stores", "read:sellers"
  ],
  [UserRole.Employee]: [
    "read:dashboard", "read:orders", "read:inventory"
  ],
  [UserRole.TeamLeader]: [ // Backward compatibility with previous version
    "read:dashboard", "read:orders", "write:orders", "read:inventory", "write:inventory", 
    "read:stores", "write:stores", "read:clients", "read:reports"
  ],
  [UserRole.Executive]: [ // Backward compatibility with previous version
    "read:dashboard", "read:orders", "write:orders", "read:inventory"
  ],
  [UserRole.ReadOnly]: [ // Backward compatibility with previous version
    "read:dashboard", "read:orders", "read:inventory"
  ]
};

export class AuthService {
  private static STORAGE_KEY = "ttgt_user_session";
  private static REMEMBER_ME_KEY = "ttgt_remember_me";

  /**
   * Authenticate worker credentials with security guidelines
   */
  public static async login(email: string, password: string, rememberMe: boolean = false): Promise<UserSession> {
    // In actual production, this routes via REST to secure microservices
    // We mock the successful validation of the core administrative handles securely
    if (!email || !password) {
      throw new Error("Missing mandatory credentials.");
    }

    let resolvedRole = UserRole.ReadOnly;
    let fullName = "Enterprise Guest Delegate";

    // Auto-detect role for frictionless simulation testing
    if (email.includes("admin")) {
      resolvedRole = UserRole.SuperAdmin;
      fullName = "Super Administrator Node";
    } else if (email.includes("ceo")) {
      resolvedRole = UserRole.CEO;
      fullName = "Chief Executive Audit";
    } else if (email.includes("ops")) {
      resolvedRole = UserRole.OperationsManager;
      fullName = "Operations Control Lead";
    } else if (email.includes("warehouse")) {
      resolvedRole = UserRole.WarehouseManager;
      fullName = "Warehouse Core Director";
    } else if (email.includes("finance")) {
      resolvedRole = UserRole.FinanceManager;
      fullName = "Financial Ledger Guardian";
    } else if (email.includes("support")) {
      resolvedRole = UserRole.CustomerSupport;
      fullName = "Customer Support Champion";
    } else if (email.includes("hr")) {
      resolvedRole = UserRole.HR;
      fullName = "Human Resource Lead";
    } else if (email.includes("sales")) {
      resolvedRole = UserRole.SalesTeam;
      fullName = "Enterprise Commerce Agent";
    } else {
      resolvedRole = UserRole.Employee;
      fullName = "TTGT Operations Associate";
    }

    const session: UserSession = {
      userId: `USR-${Math.floor(Math.random() * 900000 + 100000)}`,
      email,
      fullName,
      role: resolvedRole,
      isMfaVerified: true,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_ME_KEY, email);
    } else {
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    }

    return session;
  }

  /**
   * Retrieve active local storage session token
   */
  public static getSession(): UserSession | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserSession;
    } catch {
      return null;
    }
  }

  /**
   * Complete signout cleanup protocols
   */
  public static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Verify if the active supervisor session carries specific ACL permissions
   */
  public static hasPermission(permission: Permission): boolean {
    const session = this.getSession();
    if (!session) return false;
    const permissions = RolePermissionsMap[session.role] || [];
    return permissions.includes(permission);
  }

  /**
   * Verify if specific role carries target claim
   */
  public static roleHasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = RolePermissionsMap[role] || [];
    return permissions.includes(permission);
  }

  /**
   * Retrieve cached Remember-Me email prefix
   */
  public static getSavedUsername(): string {
    return localStorage.getItem(this.REMEMBER_ME_KEY) || "";
  }
}
