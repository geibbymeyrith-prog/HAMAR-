/**
 * ============================================================================
 * HAMARÉ Visitor Repository
 * ============================================================================
 *
 * Repository layer for Visitor persistence.
 *
 * Responsibilities
 * ----------------
 * - Read Visitor
 * - Save Visitor
 * - Claim Visitor
 * - Clear Session
 * - Future Firestore synchronization
 *
 * IMPORTANT
 * ---------
 * This repository DOES NOT contain business rules.
 *
 * Business rules belong to:
 * - AccessEngine
 *
 * Visitor object creation and local persistence belong to:
 * - visitor.ts
 *
 * Firestore integration will be added in a future commit
 * without changing this public API.
 * ============================================================================
 */

import type { Visitor } from "./types";

import {
  getOrCreateVisitor,
  saveVisitor,
  clearSession,
} from "./visitor";

export interface VisitorRepository {
  /**
   * Creates a Visitor if one does not already exist.
   *
   * Firestore document is NOT created here.
   * Firestore document will be created after the
   * first successful Generate.
   */
  create(): Promise<Visitor>;

  /**
   * Returns the current Visitor.
   *
   * If no Visitor exists locally,
   * one will automatically be created.
   */
  getCurrent(): Promise<Visitor>;

  /**
   * Persists Visitor changes.
   */
  save(visitor: Visitor): Promise<void>;

  /**
   * Links an anonymous Visitor
   * with a registered Firebase account.
   *
   * Firestore implementation will be added
   * in a future commit.
   */
  claim(
    visitorId: string,
    uid: string
  ): Promise<void>;

  /**
   * Clears the current application session
   * without removing Visitor identity.
   */
  clearCurrentSession(): Promise<void>;

  /**
   * Synchronizes Visitor data between
   * Local Storage and Firestore.
   *
   * Placeholder for future implementation.
   */
  sync(): Promise<void>;
}

export class DefaultVisitorRepository
  implements VisitorRepository {

  async create(): Promise<Visitor> {

    return getOrCreateVisitor();

  }

  async getCurrent(): Promise<Visitor> {

    return getOrCreateVisitor();

  }

  async save(
    visitor: Visitor
  ): Promise<void> {

    saveVisitor(visitor);

  }

  async claim(
    _visitorId: string,
    _uid: string
  ): Promise<void> {

    /**
     * TODO
     *
     * Link visitorId with Firebase UID.
     *
     * Claim all Visitor Results.
     *
     * Update Visitor document
     * in Firestore.
     */

    return;

  }

  async clearCurrentSession(): Promise<void> {

    clearSession();

  }

  async sync(): Promise<void> {

    /**
     * TODO
     *
     * Synchronize Visitor data
     * between Local Storage
     * and Firestore.
     */

    return;

  }

}

export const visitorRepository =
  new DefaultVisitorRepository();
