/**
 * ============================================================================
 * HAMARÉ Result Helper
 * ----------------------------------------------------------------------------
 * Responsible for manipulating Result objects.
 *
 * IMPORTANT
 * ----------
 * This helper does NOT communicate with Firestore.
 * It ONLY manages Result objects in memory.
 * ============================================================================
 */

import {
  Result,
  ResultAccessSource,
} from "./types";

/**
 * Creates a new Result object.
 */
export function createResult(params: {
  visitorId: string;
  ownerId?: string | null;
  feature: string;
  payload: unknown;
  accessSource: ResultAccessSource;
}): Result {

  return {

    id: crypto.randomUUID(),

    ownerId: params.ownerId ?? null,

    visitorId: params.visitorId,

    feature: params.feature,

    payload: params.payload,

    generatedAt: new Date().toISOString(),

    accessSource: params.accessSource,

    pdfAllowed: true,

    pdfDownloaded: false,

    pdfDownloadedAt: null,
  };
}

/**
 * Returns TRUE if Result may download PDF.
 */
export function canDownloadPdf(
  result: Result
): boolean {

  return result.pdfAllowed;

}

/**
 * Marks PDF as downloaded.
 */
export function markPdfDownloaded(
  result: Result
): Result {

  result.pdfDownloaded = true;

  result.pdfDownloadedAt =
    new Date().toISOString();

  return result;

}

/**
 * Transfers Visitor Result ownership
 * after registration.
 */
export function attachOwner(
  result: Result,
  ownerId: string
): Result {

  result.ownerId = ownerId;

  return result;

}

/**
 * Returns TRUE when Result
 * originated from Free Trial.
 */
export function isFreeTrialResult(
  result: Result
): boolean {

  return (
    result.accessSource ===
    ResultAccessSource.FREE_TRIAL
  );

}

/**
 * Returns TRUE when Result
 * originated from an active License.
 */
export function isLicensedResult(
  result: Result
): boolean {

  return (
    result.accessSource !==
    ResultAccessSource.FREE_TRIAL
  );

}
