/**
 * ============================================================================
 * HAMARÉ Visitor Repository
 * ============================================================================
 *
 * Single gateway for Visitor persistence.
 *
 * Responsibilities:
 * - Local Storage
 * - Firestore
 * - Session persistence
 *
 * This repository DOES NOT:
 * - decide business rules
 * - check subscription
 * - generate results
 * - activate licenses
 * - process payments
 *
 * Business decisions belong to AccessEngine.
 *
 * ============================================================================
 */

import type { Visitor } from "./types";

export interface VisitorRepository {
  /**
   * Creates a new Visitor.
   *
   * Local Storage is always created.
   *
   * Firestore document will only be created
   * after the first successful Generate.
   */
  createVisitor(): Promise<Visitor | null>;

  /**
   * Returns the current Visitor.
   *
   * Priority:
   * 1. Local Storage
   * 2. Firestore
   * 3. Create new Visitor
   */
  getCurrentVisitor(): Promise<Visitor | null>;

  /**
   * Persists Visitor data.
   */
  saveVisitor(visitor: Visitor): Promise<void>;

  /**
   * Claims a Visitor after registration.
   */
  claimVisitor(
    visitorId: string,
    uid: string
  ): Promise<void>;

  /**
   * Clears current application session
   * without removing Visitor identity.
   */
  clearSession(): Promise<void>;

  /**
   * Synchronizes Visitor between
   * Local Storage and Firestore.
   */
  syncVisitor(): Promise<void>;
}

export class DefaultVisitorRepository
  implements VisitorRepository {

  async createVisitor(): Promise<Visitor | null> {
    return null;
  }

  async getCurrentVisitor(): Promise<Visitor | null> {
    return null;
  }

  async saveVisitor(
    _visitor: Visitor
  ): Promise<void> {
    return;
  }

  async claimVisitor(
    _visitorId: string,
    _uid: string
  ): Promise<void> {
    return;
  }

  async clearSession(): Promise<void> {
    return;
  }

  async syncVisitor(): Promise<void> {
    return;
  }
}

export const visitorRepository =
  new DefaultVisitorRepository();
