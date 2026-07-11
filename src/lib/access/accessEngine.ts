/**
 * ============================================================================
 * HAMARÉ Access Engine
 * ============================================================================
 *
 * Central Decision Engine.
 *
 * IMPORTANT
 * ----------
 * This engine DOES NOT modify data.
 *
 * It only decides whether an action is allowed.
 *
 * Current production code is still handled by:
 *
 * - App.tsx
 * - AuthContext
 * - subscriptionEngine.ts
 *
 * Future migration will gradually move those decisions here.
 * ============================================================================
 */

import {
  Visitor,
  License,
  Result,
} from "./types";

export enum AccessDecision {

  ALLOW = "ALLOW",

  LOGIN_REQUIRED = "LOGIN_REQUIRED",

  LICENSE_REQUIRED = "LICENSE_REQUIRED",

  GENERATE_LIMIT_REACHED = "GENERATE_LIMIT_REACHED",

  PDF_NOT_ALLOWED = "PDF_NOT_ALLOWED",

  RESULT_NOT_FOUND = "RESULT_NOT_FOUND",

}

export interface DecisionResult {

  allowed: boolean;

  decision: AccessDecision;

  reason?: string;

}

export class AccessEngine {

  /**
   * Business rule migration in progress.
   *
   * Generation rule
   * will be implemented
   * in the next commit.
   */
  
  static canGenerate(
    visitor: Visitor | null,
    license: License | null
  ): DecisionResult {

    return {

      allowed: false,

      decision: AccessDecision.LICENSE_REQUIRED,

      reason:
        "Business rule has not been migrated yet.",

    };

  }

  /**
   * Placeholder.
   *
   * PDF access rule
   * will be migrated
   * after generation rule.
   */
  
  static canDownloadPdf(
    result: Result | null
  ): DecisionResult {

    return {

      allowed: false,

      decision: AccessDecision.PDF_NOT_ALLOWED,

      reason:
        "Business rule has not been migrated yet.",

    };

  }

 /**
   * Registration requirement rule.
   *
   * Determines whether
   * an anonymous Visitor
   * must register
   * before continuing.
   */
 
  static needsRegistration(
    visitor: Visitor | null
  ): DecisionResult {

    if (!visitor) {

      return {

        allowed: false,

        decision: AccessDecision.LOGIN_REQUIRED,

        reason:
          "Visitor not found.",

      };

    }

    if (visitor.registeredUserId) {
      return {
        allowed: true,
        decision: AccessDecision.ALLOW,
      };
    }

    if (visitor.trialConsumed) {

      return {

        allowed: false,

        decision: AccessDecision.LOGIN_REQUIRED,

        reason:
          "Trial has been consumed.",

      };

    }

    return {
      allowed: true,
      decision: AccessDecision.ALLOW,
    };

  }

}
