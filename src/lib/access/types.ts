/**
 * ============================================================================
 * HAMARÉ Access Engine
 * ----------------------------------------------------------------------------
 * Shared data models used by the next-generation Access Engine.
 *
 * IMPORTANT
 * ----------
 * This file ONLY contains type definitions.
 * It does NOT contain business logic.
 * It does NOT change any existing production behaviour.
 *
 * Existing production code continues using SubscriptionEngine until the
 * migration is completed.
 * ============================================================================
 */

export enum VisitorStatus {
  ACTIVE = "ACTIVE",

  LICENSE_REQUIRED = "LICENSE_REQUIRED",

  CLAIMED = "CLAIMED",
}

export enum AccountRole {
  MEMBER = "MEMBER",

  ADMIN = "ADMIN",
}

export enum LicenseType {
  SINGLE_UNLOCK = "SINGLE_UNLOCK",

  MONTHLY = "MONTHLY",

  YEARLY = "YEARLY",

  ADMIN = "ADMIN",
}

export enum LicenseStatus {
  ACTIVE = "ACTIVE",

  EXPIRED = "EXPIRED",

  CANCELLED = "CANCELLED",
}

export enum ResultAccessSource {
  FREE_TRIAL = "FREE_TRIAL",

  SINGLE_UNLOCK = "SINGLE_UNLOCK",

  MONTHLY = "MONTHLY",

  YEARLY = "YEARLY",

  ADMIN = "ADMIN",
}

export interface Visitor {

  /**
   * Permanent visitor identity.
   */
  visitorId: string;

  /**
   * Visitor lifecycle.
   */
  status: VisitorStatus;

  /**
   * Number of free generates already consumed.
   *
   * NOTE:
   * This is only a cache value.
   * Source of truth will later be Result collection.
   */
  generateUsed: number;

  /**
   * Trial has been consumed forever.
   */
  trialConsumed: boolean;

  /**
   * Filled after registration.
   */
  registeredUserId: string | null;

  createdAt: string;

  lastSeenAt: string;
}

export interface Account {

  uid: string;

  email: string;

  displayName: string;

  role: AccountRole;

  visitorId: string | null;

  lifetimeTrialConsumed: boolean;

  createdAt: string;
}

export interface License {

  id: string;

  ownerId: string;

  type: LicenseType;

  status: LicenseStatus;

  purchasedAt: string;

  activatedAt: string;

  expiredAt: string | null;

  /**
   * Only used by SINGLE_UNLOCK.
   */
  remainingUnlock: number;

  paymentId: string;
}

export interface Result {

  id: string;

  ownerId: string | null;

  visitorId: string;

  feature: string;

  payload: unknown;

  generatedAt: string;

  /**
   * FREE_TRIAL
   * MONTHLY
   * YEARLY
   * SINGLE_UNLOCK
   * ADMIN
   */
  accessSource: ResultAccessSource;

  /**
   * Permission to download PDF.
   */
  pdfAllowed: boolean;

  /**
   * Has user ever downloaded PDF?
   */
  pdfDownloaded: boolean;

  pdfDownloadedAt: string | null;
}
