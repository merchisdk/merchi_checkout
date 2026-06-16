import { isUserRegistered } from './utils';
import { tabsInit } from './tabs_utils';
import { tabIdPayment } from './tabs_utils';

export interface CheckoutSession {
  activeTabIndex?: number;
  client?: any;
  shipping?: any;
  billing?: any;
  shipment?: any;
  items?: any[];
  invoice?: any;
  checkoutOpen?: boolean;
  isBuyRequest?: boolean;
  savedShipping?: any;
  savedBilling?: any;
}

const STORAGE_PREFIX = 'merchi_checkout_session';

function hasAddress(address: any) {
  return Boolean(address?.lineOne?.trim());
}

export function checkoutSessionKey(product: any) {
  const productId = product?.id ?? 'unknown';
  const domainId = product?.domain?.id ?? product?.domainId ?? 'unknown';
  return `${STORAGE_PREFIX}_${domainId}_${productId}`;
}

export function loadCheckoutSession(product: any): CheckoutSession | null {
  if (typeof sessionStorage === 'undefined' || !product?.id) {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(checkoutSessionKey(product));
    return raw ? (JSON.parse(raw) as CheckoutSession) : null;
  } catch {
    return null;
  }
}

export function saveCheckoutSession(product: any, session: CheckoutSession) {
  if (typeof sessionStorage === 'undefined' || !product?.id) {
    return;
  }
  try {
    sessionStorage.setItem(
      checkoutSessionKey(product),
      JSON.stringify(session)
    );
  } catch {
    /* private browsing / quota */
  }
}

export function clearCheckoutSession(product: any) {
  if (typeof sessionStorage === 'undefined' || !product?.id) {
    return;
  }
  try {
    sessionStorage.removeItem(checkoutSessionKey(product));
  } catch {
    /* ignore */
  }
}

export function isResumableCheckoutSession(session: CheckoutSession | null) {
  if (!session) return false;

  return Boolean(
    session.checkoutOpen ||
    session.invoice?.id ||
    (session.activeTabIndex ?? 0) > 0 ||
    hasAddress(session.shipping) ||
    hasAddress(session.billing) ||
    session.shipment ||
    session.items?.length
  );
}

export function getSavedShippingAddress(session: CheckoutSession | null) {
  if (!session?.savedShipping?.lineOne) return null;
  return session.savedShipping;
}

export function completeCheckoutSession(product: any) {
  const session = loadCheckoutSession(product);
  const profile: CheckoutSession = {};

  if (isUserRegistered(session?.client)) {
    profile.client = session.client;
  }

  const shippingToSave = hasAddress(session?.shipping)
    ? session.shipping
    : session?.savedShipping;
  const billingToSave = hasAddress(session?.billing)
    ? session.billing
    : session?.savedBilling;

  if (hasAddress(shippingToSave)) {
    profile.savedShipping = shippingToSave;
  }
  if (hasAddress(billingToSave)) {
    profile.savedBilling = billingToSave;
  }

  if (Object.keys(profile).length === 0) {
    clearCheckoutSession(product);
  } else {
    saveCheckoutSession(product, profile);
  }
}

export function mergeJobWithCheckoutSession(
  job: any,
  session: CheckoutSession | null
) {
  if (!session) return job;

  const merged = { ...job };

  if (!isUserRegistered(merged.client) && isUserRegistered(session.client)) {
    merged.client = session.client;
  }

  if (!isResumableCheckoutSession(session)) {
    return merged;
  }

  if (!hasAddress(merged.shipping) && hasAddress(session.shipping)) {
    merged.shipping = session.shipping;
  }
  if (!hasAddress(merged.billing) && hasAddress(session.billing)) {
    merged.billing = session.billing;
  }
  if (!merged.shipment && session.shipment) {
    merged.shipment = session.shipment;
  }
  if (!merged.items?.length && session.items?.length) {
    merged.items = session.items;
  }

  return merged;
}

export function buildCheckoutSession(
  job: any,
  activeTabIndex: number,
  extras?: {
    invoice?: any;
    checkoutOpen?: boolean;
    isBuyRequest?: boolean;
  },
  existingSession?: CheckoutSession | null
): CheckoutSession {
  const existing = existingSession ?? null;

  return {
    activeTabIndex,
    client: job.client,
    shipping: job.shipping,
    billing: job.billing,
    shipment: job.shipment,
    items: job.items,
    savedShipping: existing?.savedShipping,
    savedBilling: existing?.savedBilling,
    invoice: extras?.invoice?.id ? extras.invoice : undefined,
    checkoutOpen: extras?.checkoutOpen,
    isBuyRequest: extras?.isBuyRequest,
  };
}

export function getSafeRestoredTabIndex(
  job: any,
  options: { includeDomainSignup?: boolean; isBuyRequest?: boolean },
  requestedIndex: number,
  invoice?: any
): number {
  if (!job?.product) return 0;

  const tabs = tabsInit({ job, ...options });
  if (!tabs.length) return 0;

  const paymentIndex = tabs.findIndex((tab) => tab.id === tabIdPayment);
  const safeIndex = Math.max(0, Math.min(requestedIndex, tabs.length - 1));

  if (paymentIndex >= 0 && safeIndex >= paymentIndex && !invoice?.id) {
    return Math.max(0, paymentIndex - 1);
  }

  return safeIndex;
}

export function checkoutSessionChanged(job: any, merged: any) {
  return (
    merged.client !== job.client ||
    merged.shipping !== job.shipping ||
    merged.billing !== job.billing ||
    merged.shipment !== job.shipment ||
    merged.items !== job.items
  );
}

export function getCheckoutQuoteSignature(job: any) {
  return JSON.stringify({
    productId: job.product?.id,
    quantity: job.quantity,
    totalCost: job.totalCost,
    variations: job.variations,
    variationsGroups: job.variationsGroups,
  });
}
