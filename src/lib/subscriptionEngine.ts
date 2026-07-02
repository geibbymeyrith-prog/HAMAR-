// ======================================================
// HAMARÉ Subscription Engine
// Central business rules for subscription & free quota.
// ======================================================

export interface SubscriptionDecision {
  isPremium: boolean;

  canGenerate: boolean;

  canDownloadResultPdf: boolean;

  shouldShowPremiumOffer: boolean;

  shouldShowRenewalPopup: boolean;

  remainingFreeGenerate: number;

  remainingFreePdf: number;
}

export interface SubscriptionInput {
  subscriptionStatus?: string;

  premiumExpiredAt?: string | Date | null;

  freeGenerateUsed?: number;

  freePdfUsed?: number;

  unlockedResults?: Array<{
    key?: string;
    type?: string;
    paymentId?: string;
    unlockedAt?: string;
  }>;
}

function isPremiumActive(
  subscriptionStatus?: string,
  premiumExpiredAt?: string | Date | null
): boolean {

  if (
    subscriptionStatus !== 'monthly' &&
    subscriptionStatus !== 'yearly'
  ) {
    return false;
  }

  if (!premiumExpiredAt) {
    return false;
  }

  const expiry =
    premiumExpiredAt instanceof Date
      ? premiumExpiredAt
      : new Date(premiumExpiredAt);

  return expiry.getTime() > Date.now();
}

export function evaluateSubscription(
  input: SubscriptionInput
): SubscriptionDecision {

  const premium = isPremiumActive(
    input.subscriptionStatus,
    input.premiumExpiredAt
  );

  const everSubscribed =
    input.subscriptionStatus === 'monthly' ||
    input.subscriptionStatus === 'yearly';

  // TODO:
  // Read freeGenerateUsed and freePdfUsed
  // from Firestore user profile.

  const freeGenerateUsed =
    input.freeGenerateUsed ?? 0;

  const freePdfUsed =
    input.freePdfUsed ?? 0;

  const remainingFreeGenerate =
    Math.max(0, 3 - freeGenerateUsed);

  const remainingFreePdf =
    Math.max(0, 3 - freePdfUsed);

  return {

    isPremium: premium,

    canGenerate:
      premium ||
      remainingFreeGenerate > 0,

    canDownloadResultPdf:
      premium ||
      remainingFreePdf > 0,

    shouldShowPremiumOffer:
      !premium &&
      remainingFreeGenerate === 0,

    shouldShowRenewalPopup:
      everSubscribed &&
      !premium,

    remainingFreeGenerate,

    remainingFreePdf
  };

}
