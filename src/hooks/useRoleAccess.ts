/**
 * TTGT Solutions Commerce Operations Platform
 * Central Hook to enforce Role-Based Access Control (RBAC) levels
 */

import { useStateEngine } from "../contexts/StateEngineContext";
import { AuthService, Permission } from "../services/AuthService";

export function useRoleAccess() {
  const { currentRole } = useStateEngine();

  /**
   * Validate if the active simulated actor has explicit clearance for an operation context
   */
  const canPerform = (permission: Permission): boolean => {
    return AuthService.roleHasPermission(currentRole, permission);
  };

  /**
   * Quick boolean flag mapping check if currently logged as fully authorized node
   */
  const isSuperAdmin = currentRole === "Super Admin";
  const isReadOnly = currentRole === "Read Only User";

  return {
    canPerform,
    isSuperAdmin,
    isReadOnly,
    currentRole
  };
}
