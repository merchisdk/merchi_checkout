import { isProductSupplierMOD, userAdminDomains } from './utils';
import {
  faAddressCard,
  faCheckCircle,
  faCreditCard,
  faDraftingCompass,
  faShoppingCart,
  faStore,
  faThumbsUp,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';
import { MerchiCheckoutTab } from './types';

function makeTabData(icon: any, id: string, title: string) {
  return {
    disabled: true,
    icon,
    id,
    title,
  } as MerchiCheckoutTab;
}

export const tabIdDrafting = 'drafting';
export const tabDrafting = makeTabData(
  faDraftingCompass,
  tabIdDrafting,
  'Customise'
);
export const tabIdCustomerInfo = 'customer';
export const tabCustomerInfo = makeTabData(
  faAddressCard,
  tabIdCustomerInfo,
  'Customer'
);
export const tabIdShipment = 'shipment';
export const tabShipment = makeTabData(faTruck, tabIdShipment, 'Address');
export const tabIdConfirm = 'confirm';
export const tabConfirm = makeTabData(faShoppingCart, tabIdConfirm, 'Confirm');
export const tabMODConfirm = makeTabData(
  faCheckCircle,
  tabIdConfirm,
  'Confirm'
);
export const tabIdPayment = 'payment';
export const tabPayment = makeTabData(faCreditCard, tabIdPayment, 'Checkout');
export const tabIdComplete = 'complete';
export const tabCompleteQuote = makeTabData(
  faThumbsUp,
  tabIdComplete,
  'Submitted'
);
export const tabComplete = makeTabData(faThumbsUp, tabIdComplete, 'Complete');

interface TabsProductMOD {
  hideDrafting?: boolean;
  includeDomainSignup?: boolean;
  job: any;
}

export function tabsProductMOD({
  hideDrafting,
  includeDomainSignup,
  job,
}: TabsProductMOD) {
  const { client, product } = job;
  const hasClient = client && (client as any).id > 0;
  const clientHasDomain = client && client.hasStore;
  const tabs = {} as any;
  const { needsDrafting } = product;
  if (!hideDrafting && needsDrafting) {
    tabs[tabIdDrafting] = { ...tabDrafting, disabled: false };
  }
  // if the current user doesn't have an account ask them to sign up
  if (!hasClient) {
    tabs[tabIdCustomerInfo] = needsDrafting
      ? tabCustomerInfo
      : { ...tabCustomerInfo, disabled: false };
  }
  // if the current user doesn't have domain ask them to make a domain
  // if (!clientHasDomain && includeDomainSignup) {
  //   tabs[tabIdNewDomain] =
  //     hasClient ?
  //       {...tabNewDomain, disabled: needsDrafting} :
  //       tabNewDomain;
  // }
  tabs[tabIdConfirm] = tabMODConfirm;
  tabs[tabIdComplete] = tabCompleteQuote;
  return tabs;
}

interface TabsProductSupplier {
  hideDrafting?: boolean;
  includeDomainSignup?: boolean;
  isBuyRequest: boolean;
  job: any;
}

export function tabsProductSupplier({
  includeDomainSignup,
  job,
  isBuyRequest,
  hideDrafting,
}: TabsProductSupplier) {
  const { client, product } = job;
  const tabs = {} as any;
  const hasClient = client && (client as any).id > 0;
  const { needsDrafting, needsShipping } = product;
  if (!hideDrafting && needsDrafting) {
    tabs[tabIdDrafting] = { ...tabDrafting, disabled: false };
  }
  // if the current user doesn't have an account ask them to sign up
  tabs[tabIdCustomerInfo] =
    needsDrafting && !hideDrafting
      ? tabCustomerInfo
      : { ...tabCustomerInfo, disabled: false };
  if (needsShipping) {
    tabs[tabIdShipment] = {
      ...tabShipment,
      disabled: !hasClient || needsDrafting,
    };
  }
  tabs[tabIdConfirm] = {
    ...tabConfirm,
    disabled: !hasClient || needsDrafting || needsShipping,
  };
  if (isBuyRequest) {
    tabs[tabIdPayment] = tabPayment;
    tabs[tabIdComplete] = tabComplete;
  } else {
    tabs[tabIdComplete] = tabCompleteQuote;
  }
  return tabs;
}

interface TabsInit {
  includeDomainSignup?: boolean;
  isBuyRequest?: boolean;
  hideDrafting?: boolean;
  job: any;
}

export function tabsInit(settings: TabsInit) {
  const {
    hideDrafting,
    includeDomainSignup,
    isBuyRequest = false,
    job,
  } = settings;
  const { product } = job;
  const isSupplierMOD = isProductSupplierMOD(product);
  if (isSupplierMOD) {
    return Object.values(
      tabsProductMOD({ hideDrafting, includeDomainSignup, job })
    );
  }
  return Object.values(
    tabsProductSupplier({
      hideDrafting,
      includeDomainSignup,
      isBuyRequest,
      job,
    })
  );
}

export function hasDraftTab(tabs: MerchiCheckoutTab[]) {
  return tabs.find((t: MerchiCheckoutTab) => t.id === tabIdDrafting);
}
