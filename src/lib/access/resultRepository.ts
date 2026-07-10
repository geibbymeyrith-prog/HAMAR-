/**
 * ============================================================================
 * HAMARÉ Result Repository
 * ============================================================================
 *
 * Repository layer for Result persistence.
 *
 * Responsibilities
 * ----------------
 * - Create Result
 * - Read Result
 * - Save Result
 * - Read History
 * - Claim Visitor Results
 * - Mark PDF Download
 *
 * IMPORTANT
 * ---------
 * This repository DOES NOT contain business rules.
 *
 * Business rules belong to:
 * - AccessEngine
 *
 * Result object creation belongs to:
 * - result.ts
 *
 * Firestore integration will be added
 * in a future commit without changing
 * this public API.
 * ============================================================================
 */

import type { Result } from "./types";

import {
  markPdfDownloaded,
} from "./result";

export interface ResultRepository {

  /**
   * Creates a new Result.
   *
   * Firestore document is NOT created here.
   */
  create(
    result: Result
  ): Promise<Result>;

  /**
   * Persists Result changes.
   */
  save(
    result: Result
  ): Promise<void>;

  /**
   * Returns a Result by id.
   *
   * Placeholder implementation.
   */
  getById(
    resultId: string
  ): Promise<Result | null>;

  /**
   * Returns every Result
   * belonging to a Visitor.
   */
  getVisitorResults(
    visitorId: string
  ): Promise<Result[]>;

  /**
   * Returns every Result
   * belonging to an Account.
   */
  getAccountResults(
    ownerId: string
  ): Promise<Result[]>;

  /**
   * Claims all Visitor Results
   * after registration.
   */
  claimVisitorResults(
    visitorId: string,
    ownerId: string
  ): Promise<void>;

  /**
   * Marks PDF as downloaded.
   */
  markDownloaded(
    result: Result
  ): Promise<Result>;
}

export class DefaultResultRepository
  implements ResultRepository {

  async create(
    result: Result
  ): Promise<Result> {

    return result;

  }

  async save(
    _result: Result
  ): Promise<void> {

    return;

  }

  async getById(
    _resultId: string
  ): Promise<Result | null> {

    /**
     * TODO
     *
     * Firestore implementation.
     */

    return null;

  }

  async getVisitorResults(
    _visitorId: string
  ): Promise<Result[]> {

    /**
     * TODO
     *
     * Read Visitor Results
     * from Firestore.
     */

    return [];

  }

  async getAccountResults(
    _ownerId: string
  ): Promise<Result[]> {

    /**
     * TODO
     *
     * Read Account Results
     * from Firestore.
     */

    return [];

  }

  async claimVisitorResults(
    _visitorId: string,
    _ownerId: string
  ): Promise<void> {

    /**
     * TODO
     *
     * Move every Visitor Result
     * to Account ownership.
     */

    return;

  }

  async markDownloaded(
    result: Result
  ): Promise<Result> {

    return markPdfDownloaded(result);

  }

}

export const resultRepository =
  new DefaultResultRepository();
