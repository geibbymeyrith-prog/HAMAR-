/**
 * ============================================================================
 * HAMARÉ Visitor Helper
 * ----------------------------------------------------------------------------
 * Responsible for managing visitor identity on the client.
 *
 * IMPORTANT
 * ----------
 * This helper does NOT communicate with Firestore yet.
 * It only manages the local Visitor object.
 * ============================================================================
 */

import { Visitor, VisitorStatus } from "./types";

const VISITOR_STORAGE_KEY = "hamare_visitor";

export function createVisitor(): Visitor {

  const now = new Date().toISOString();

  return {
    visitorId: crypto.randomUUID(),

    status: VisitorStatus.ACTIVE,

    generateUsed: 0,

    trialConsumed: false,

    registeredUserId: null,

    createdAt: now,

    lastSeenAt: now,
  };
}

export function getVisitor(): Visitor | null {

  const raw = localStorage.getItem(VISITOR_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {

    return JSON.parse(raw) as Visitor;

  } catch {

    return null;

  }
}

export function saveVisitor(
  visitor: Visitor
): void {

  visitor.lastSeenAt = new Date().toISOString();

  localStorage.setItem(
    VISITOR_STORAGE_KEY,
    JSON.stringify(visitor)
  );
}

export function getOrCreateVisitor(): Visitor {

  const existing = getVisitor();

  if (existing) {

    return existing;

  }

  const visitor = createVisitor();

  saveVisitor(visitor);

  return visitor;
}

export function markTrialConsumed(
  visitor: Visitor
): Visitor {

  visitor.trialConsumed = true;

  visitor.status = VisitorStatus.LICENSE_REQUIRED;

  saveVisitor(visitor);

  return visitor;
}

export function incrementGenerate(
  visitor: Visitor
): Visitor {

  visitor.generateUsed += 1;

  saveVisitor(visitor);

  return visitor;
}

export function clearSession(): void {

  sessionStorage.clear();

}
