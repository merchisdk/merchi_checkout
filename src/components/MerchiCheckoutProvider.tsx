'use client';
import * as React from 'react';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { MerchiCheckoutTab } from '../types';
import { tabsInit, tabIdConfirm } from '../tabs_utils';
import { Merchi } from 'merchi_sdk_ts';
import {
  buildCheckoutSession,
  checkoutSessionChanged,
  getCheckoutQuoteSignature,
  getSafeRestoredTabIndex,
  loadCheckoutSession,
  mergeJobWithCheckoutSession,
  saveCheckoutSession,
} from '../checkoutSession';
import { isUserRegistered } from '../utils';

interface IMerchiCheckout {
  activeTabIndex: number;
  alerts: any[];
  alertClose: (index: number) => void;
  alertErrorShow: (message: string) => void;
  classNameMerchiCheckoutAlertsContainer?: string;
  classNameMerchiCheckoutAlert?: string;
  classNameMerchiCheckoutAlertError?: string;
  classNameMerchiCheckoutAlertSuccess?: string;
  classNameMerchiCheckoutButtonPrimary?: string;
  classNameMerchiCheckoutButtonPrimaryBlock?: string;
  classNameMerchiCheckoutButtonSecondary?: string;
  classNameMerchiCheckoutButtonSecondaryBlock?: string;
  classNameMerchiCheckoutButtonDownloadInvoice?: string;
  classNameMerchiCheckoutButtonCancelOrder?: string;
  classNameMerchiCheckoutConfirmInfoPanel?: string;
  classNameMerchiCheckoutFooterActionsContainer?: string;
  classNameMerchiCheckoutFormCheckbox?: string;
  classNameMerchiCheckoutFormGroup?: string;
  classNameMerchiCheckoutFormGroupCheckbox?: string;
  classNameMerchiCheckoutFormInput?: string;
  classNameMerchiCheckoutFormSelect?: string;
  classNameMerchiCheckoutGoogleSuggestList?: string;
  classNameMerchiCheckoutGoogleSuggestListItem?: string;
  classNameMerchiCheckoutListGroupItemLoader?: string;
  classNameMerchiCheckoutFormLabelCheckbox?: string;
  classNameMerchiCheckoutInputError?: string;
  classNameMerchiCheckoutListGroup?: string;
  classNameMerchiCheckoutListGroupItem?: string;
  classNameMerchiCheckoutRow?: string;
  classNameMerchiCheckoutRowColumn?: string;
  classNameMerchiCheckoutSubtitle?: string;
  classNameMerchiCheckoutTabsContainer?: string;
  classNameMerchiCheckoutTab?: string;
  classNameMerchiCheckoutTabPane?: string;
  classNameMerchiCheckoutTabPaneContainer?: string;
  classNameMerchiCheckoutTabButton?: string;
  classNameMerchiInvoiceButtonPayInvoice?: string;
  clearCustomer: () => void;
  cancelCheckoutOrder: () => void;
  currentUser?: any;
  customer?: any;
  discountButtonText?: string;
  discountCallbackError: () => void;
  discountCallbackSuccess: (items: any[]) => void;
  discountClassName?: string;
  discountClassNameMainContainer?: string;
  discountClassNameButtonItemRemove?: string;
  discountClassNameButton?: string;
  discountClassNameButtonContainer?: string;
  discountClassNameErrorMessage?: string;
  discountClassNameInput?: string;
  discountClassNameListItem?: string;
  discountClassNameListItems?: string;
  discountClassNameInputContainer?: string;
  discountClassNameInputdiscountLabel?: string;
  discountLabel?: string;
  discountShowAppliedItems?: boolean;
  domain?: any;
  editDraftTemplate: (index: number, draft: any) => void;
  includeDomainSignup?: boolean;
  invoice: any;
  isBuyRequest?: boolean;
  isOpen?: boolean;
  isProductEmbedForm?: boolean;
  job: any;
  loading: boolean;
  merchi: Merchi;
  messageSuccessBuyRequest?: string;
  messageSuccessQuoteRequest?: string;
  nextTab: () => void;
  product: any;
  redirectAfterSuccessUrl?: string;
  redirectAfterQuoteSuccessUrl?: string;
  redirectWithValue?: boolean;
  setActiveTabById: (id: string) => void;
  setActiveTabIndex: (index: number) => void;
  setCustomer: (customer: any) => void;
  setDomain: (domain: any) => void;
  setInvoice: (invoice: any) => void;
  setJob: (job: any) => void;
  showDiscountCode?: boolean;
  showUserTermsAndConditions?: boolean;
  tabs: MerchiCheckoutTab[];
  toggleMerchiCheckout: () => void;
  urlFrontend: string;
  urlApi: string;
}

const MerchiCheckoutContext = createContext<IMerchiCheckout>({
  activeTabIndex: 0,
  alerts: [],
  alertClose() { },
  alertErrorShow() { },
  classNameMerchiCheckoutAlertsContainer: undefined,
  classNameMerchiCheckoutAlert: undefined,
  classNameMerchiCheckoutAlertError: undefined,
  classNameMerchiCheckoutAlertSuccess: undefined,
  classNameMerchiCheckoutButtonPrimary: undefined,
  classNameMerchiCheckoutButtonPrimaryBlock: undefined,
  classNameMerchiCheckoutButtonSecondary: undefined,
  classNameMerchiCheckoutButtonSecondaryBlock: undefined,
  classNameMerchiCheckoutButtonDownloadInvoice: undefined,
  classNameMerchiCheckoutConfirmInfoPanel: undefined,
  classNameMerchiCheckoutFooterActionsContainer: undefined,
  classNameMerchiCheckoutFormCheckbox: undefined,
  classNameMerchiCheckoutFormGroup: undefined,
  classNameMerchiCheckoutFormGroupCheckbox: undefined,
  classNameMerchiCheckoutFormInput: undefined,
  classNameMerchiCheckoutFormSelect: undefined,
  classNameMerchiCheckoutGoogleSuggestList: undefined,
  classNameMerchiCheckoutGoogleSuggestListItem: undefined,
  classNameMerchiCheckoutListGroupItemLoader: undefined,
  classNameMerchiCheckoutFormLabelCheckbox: undefined,
  classNameMerchiCheckoutInputError: undefined,
  classNameMerchiCheckoutListGroup: undefined,
  classNameMerchiCheckoutListGroupItem: undefined,
  classNameMerchiCheckoutRow: undefined,
  classNameMerchiCheckoutRowColumn: undefined,
  classNameMerchiCheckoutSubtitle: undefined,
  classNameMerchiCheckoutTabsContainer: undefined,
  classNameMerchiCheckoutTab: undefined,
  classNameMerchiCheckoutTabPane: undefined,
  classNameMerchiCheckoutTabPaneContainer: undefined,
  classNameMerchiCheckoutTabButton: undefined,
  classNameMerchiInvoiceButtonPayInvoice: undefined,
  clearCustomer() { },
  cancelCheckoutOrder() { },
  currentUser: undefined,
  customer: undefined,
  discountButtonText: undefined,
  discountCallbackError() { },
  discountCallbackSuccess() { },
  discountClassName: undefined,
  discountClassNameButton: undefined,
  discountClassNameButtonContainer: undefined,
  discountClassNameButtonItemRemove: undefined,
  discountClassNameErrorMessage: undefined,
  discountClassNameInput: undefined,
  discountClassNameInputContainer: undefined,
  discountClassNameInputdiscountLabel: undefined,
  discountClassNameListItem: undefined,
  discountClassNameListItems: undefined,
  discountClassNameMainContainer: undefined,
  discountLabel: undefined,
  discountShowAppliedItems: true,
  domain: undefined,
  editDraftTemplate() { },
  isBuyRequest: false,
  isOpen: false,
  loading: false,
  merchi: undefined,
  messageSuccessBuyRequest: undefined,
  messageSuccessQuoteRequest: undefined,
  nextTab() { },
  includeDomainSignup: false,
  invoice: {},
  isProductEmbedForm: false,
  job: {},
  product: {},
  redirectAfterSuccessUrl: undefined,
  redirectAfterQuoteSuccessUrl: undefined,
  redirectWithValue: true,
  setActiveTabById() { },
  setActiveTabIndex() { },
  setCustomer() { },
  setDomain() { },
  setInvoice() { },
  setJob() { },
  showDiscountCode: true,
  showUserTermsAndConditions: true,
  tabs: [],
  toggleMerchiCheckout() { },
  urlFrontend: '',
  urlApi: '',
});

export const useMerchiCheckboutContext = () =>
  useContext(MerchiCheckoutContext);

interface PropsMerchiProductFormProvider {
  children: ReactNode;
  classNameMerchiCheckoutAlertsContainer?: string;
  classNameMerchiCheckoutAlert?: string;
  classNameMerchiCheckoutAlertError?: string;
  classNameMerchiCheckoutAlertSuccess?: string;
  classNameMerchiCheckoutButtonPrimary?: string;
  classNameMerchiCheckoutButtonPrimaryBlock?: string;
  classNameMerchiCheckoutButtonSecondary?: string;
  classNameMerchiCheckoutButtonSecondaryBlock?: string;
  classNameMerchiCheckoutButtonDownloadInvoice?: string;
  classNameMerchiCheckoutButtonCancelOrder?: string;
  classNameMerchiCheckoutConfirmInfoPanel?: string;
  classNameMerchiCheckoutFooterActionsContainer?: string;
  classNameMerchiCheckoutFormCheckbox?: string;
  classNameMerchiCheckoutFormGroup?: string;
  classNameMerchiCheckoutFormGroupCheckbox?: string;
  classNameMerchiCheckoutFormInput?: string;
  classNameMerchiCheckoutFormSelect?: string;
  classNameMerchiCheckoutGoogleSuggestList?: string;
  classNameMerchiCheckoutGoogleSuggestListItem?: string;
  classNameMerchiCheckoutListGroupItemLoader?: string;
  classNameMerchiCheckoutInputError?: string;
  classNameMerchiCheckoutListGroup?: string;
  classNameMerchiCheckoutListGroupItem?: string;
  classNameMerchiCheckoutRow?: string;
  classNameMerchiCheckoutRowColumn?: string;
  classNameMerchiCheckoutSubtitle?: string;
  classNameMerchiCheckoutTabsContainer?: string;
  classNameMerchiCheckoutFormLabelCheckbox?: string;
  classNameMerchiCheckoutTab?: string;
  classNameMerchiCheckoutTabButton?: string;
  classNameMerchiCheckoutTabPane?: string;
  classNameMerchiCheckoutTabPaneContainer?: string;
  classNameMerchiInvoiceButtonPayInvoice?: string;
  currentUser?: any;
  discountButtonText?: string;
  discountClassName?: string;
  discountClassNameMainContainer?: string;
  discountClassNameButtonItemRemove?: string;
  discountClassNameButton?: string;
  discountClassNameButtonContainer?: string;
  discountClassNameErrorMessage?: string;
  discountClassNameInput?: string;
  discountClassNameListItem?: string;
  discountClassNameListItems?: string;
  discountClassNameInputContainer?: string;
  discountClassNameInputdiscountLabel?: string;
  discountLabel?: string;
  discountShowAppliedItems?: boolean;
  includeDomainSignup?: boolean;
  isBuyRequest?: boolean;
  isOpen: boolean;
  isProductEmbedForm?: boolean;
  messageSuccessBuyRequest?: string;
  messageSuccessQuoteRequest?: string;
  showDiscountCode?: boolean;
  showUserTermsAndConditions?: boolean;
  invoice: any;
  job: any;
  product: any;
  redirectAfterSuccessUrl?: string;
  redirectAfterQuoteSuccessUrl?: string;
  redirectWithValue?: boolean;
  setInvoice: (invoice: any) => void;
  setJob: (job: any) => void;
  toggleMerchiCheckout: () => void;
  urlApi?: string;
  urlFrontend?: string;
}

function buildTabsState(
  jobForTabs: any,
  {
    includeDomainSignup,
    isBuyRequest,
    tabIndex = 0,
  }: {
    includeDomainSignup?: boolean;
    isBuyRequest?: boolean;
    tabIndex?: number;
  }
): { tabs: MerchiCheckoutTab[]; activeTabIndex: number } {
  if (!jobForTabs?.product) {
    return { tabs: [], activeTabIndex: 0 };
  }

  const baseTabs = tabsInit({
    job: jobForTabs,
    includeDomainSignup,
    isBuyRequest,
  });

  if (!baseTabs.length) {
    return { tabs: [], activeTabIndex: 0 };
  }

  const safeIndex = Math.max(0, Math.min(tabIndex, baseTabs.length - 1));
  const tabsWithProgress = baseTabs.map((tab, i) => ({
    ...tab,
    disabled: i > safeIndex,
  }));

  return { tabs: tabsWithProgress, activeTabIndex: safeIndex };
}

function getInitialTabsState(
  job: any,
  product: any,
  includeDomainSignup?: boolean,
  isBuyRequest?: boolean,
  invoice?: any
) {
  if (!product?.id) {
    return { tabs: [] as MerchiCheckoutTab[], activeTabIndex: 0 };
  }

  const session = loadCheckoutSession(product);
  const mergedJob = mergeJobWithCheckoutSession(job, session);
  const restoredInvoice = invoice?.id ? invoice : session?.invoice;
  const tabIndex = getSafeRestoredTabIndex(
    mergedJob,
    { includeDomainSignup, isBuyRequest },
    session?.activeTabIndex ?? 0,
    restoredInvoice
  );

  return buildTabsState(mergedJob, {
    includeDomainSignup,
    isBuyRequest,
    tabIndex,
  });
}

export const MerchiCheckoutProvider = ({
  children,
  classNameMerchiCheckoutAlertsContainer = 'd-flex justify-content-center flex-column alerts-container-sm',
  classNameMerchiCheckoutAlert = 'alert alert-dismissible alert-notify',
  classNameMerchiCheckoutAlertError = 'alert-danger',
  classNameMerchiCheckoutAlertSuccess = 'alert-success',
  classNameMerchiCheckoutButtonPrimary = 'btn btn-lmd btn-primary d-flex align-items-center justify-content-center',
  classNameMerchiCheckoutButtonPrimaryBlock = 'btn btn-lg btn-primary btn-block',
  classNameMerchiCheckoutButtonSecondary = 'btn btn-lg btn-secondary',
  classNameMerchiCheckoutButtonSecondaryBlock = 'btn btn-lg btn-secondary btn-block',
  classNameMerchiCheckoutButtonDownloadInvoice = 'btn btn-lg btn-primary',
  classNameMerchiCheckoutButtonCancelOrder = 'btn btn-lg btn-secondary',
  classNameMerchiCheckoutConfirmInfoPanel = 'd-flex align-items-center',
  classNameMerchiCheckoutFooterActionsContainer = 'd-flex justify-content-between mt-4',
  classNameMerchiCheckoutFormCheckbox = 'form-check-input',
  classNameMerchiCheckoutFormGroup = 'form-group',
  classNameMerchiCheckoutFormGroupCheckbox = 'form-check',
  classNameMerchiCheckoutFormInput = 'form-control',
  classNameMerchiCheckoutFormSelect = 'form-control',
  classNameMerchiCheckoutGoogleSuggestList = 'merchi-checkout-google-suggest-list',
  classNameMerchiCheckoutGoogleSuggestListItem = 'merchi-checkout-google-suggest-list-item',
  classNameMerchiCheckoutListGroupItemLoader = 'list-group-item modal-merchi-checkout-shipment-option',
  classNameMerchiCheckoutInputError = 'text-danger',
  classNameMerchiCheckoutFormLabelCheckbox = '',
  classNameMerchiCheckoutListGroup = 'modal-merchi-checkout-shipment-option',
  classNameMerchiCheckoutListGroupItem = 'list-group-item modal-merchi-checkout-shipment-option',
  classNameMerchiCheckoutRow = 'merchi-row',
  classNameMerchiCheckoutRowColumn = 'merchi-column',
  classNameMerchiCheckoutSubtitle = 'merchi-checkout-subtitle',
  classNameMerchiCheckoutTabsContainer = 'merchi-checkout-tabs-container',
  classNameMerchiCheckoutTab = 'merchi-checkout-tab',
  classNameMerchiCheckoutTabButton = 'btn merchi-checkout-tab-btn',
  classNameMerchiCheckoutTabPane = 'tab-pane',
  classNameMerchiCheckoutTabPaneContainer = 'tab-content',
  classNameMerchiInvoiceButtonPayInvoice = 'btn btn-lg btn-primary btn-block',
  currentUser,
  discountButtonText = 'Apply',
  discountClassName = 'merchi-checkout-discount-code-container',
  discountClassNameButton = 'btn btn-primary',
  discountClassNameButtonContainer = '',
  discountClassNameButtonItemRemove = 'btn btn-sm btn-link',
  discountClassNameErrorMessage = 'text-danger',
  discountClassNameInput = 'form-control',
  discountClassNameInputContainer = 'merchi-checkout-discount-code-field-container',
  discountClassNameInputdiscountLabel = 'merchi-checkout-discount-code-label',
  discountClassNameListItem = 'list-group-item d-flex align-items-center justify-content-between mt-2',
  discountClassNameListItems = 'list-group',
  discountClassNameMainContainer,
  discountLabel = 'Apply Discount Code',
  discountShowAppliedItems = true,
  includeDomainSignup = false,
  invoice,
  isBuyRequest,
  isOpen,
  isProductEmbedForm = false,
  job,
  product,
  messageSuccessBuyRequest,
  messageSuccessQuoteRequest,
  redirectAfterSuccessUrl,
  redirectAfterQuoteSuccessUrl,
  redirectWithValue,
  setInvoice,
  setJob,
  showDiscountCode = true,
  showUserTermsAndConditions = true,
  toggleMerchiCheckout,
  urlApi = 'https://api.merchi.co/v6/',
  urlFrontend = 'https://merchi.co/',
}: PropsMerchiProductFormProvider) => {
  const initialTabsState = getInitialTabsState(
    job,
    product,
    includeDomainSignup,
    isBuyRequest,
    invoice
  );
  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    initialTabsState.activeTabIndex
  );
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [domain, setDomain] = useState(null);
  const [tabs, setTabs] = useState(initialTabsState.tabs);
  const merchi = new Merchi(undefined, undefined, undefined, undefined, urlApi);
  function editDraftTemplate(index: number, draft: any) {
    const jobJson = { ...job };
    const draftTemplates = product.draftTemplates || [];
    const draftTemplateFiles = draftTemplates.map((d: any) => d.file);
    const ownDraft = (jobJson.ownDrafts && jobJson.ownDrafts[0]) || {
      images: draftTemplateFiles,
    };
    if (ownDraft.images) {
      ownDraft.images[index] = draft;
    } else {
      ownDraft.images = [draft];
    }
    jobJson.ownDrafts = [ownDraft];
    setJob(jobJson);
  }
  function alertClose(index: number) {
    const updatedAlerts = alerts.filter((_, idx) => idx !== index);
    setAlerts(updatedAlerts);
  }
  function alertErrorShow(message: string) {
    const newAlerts: any[] = [
      ...alerts,
      { alertType: 'error', message, title: 'Error!' },
    ];
    setAlerts(newAlerts as any);
  }
  function initTabsFromJob(jobForTabs: any, tabIndex = 0) {
    const { tabs: nextTabs, activeTabIndex: nextIndex } = buildTabsState(
      jobForTabs,
      { includeDomainSignup, isBuyRequest, tabIndex }
    );
    setTabs(nextTabs);
    setActiveTabIndex(nextIndex);
  }
  function resetTabs() {
    initTabsFromJob(job, activeTabIndex);
  }
  function setCustomer(customer: any) {
    const updatedJob = { ...job, client: customer };
    setJob(updatedJob);
    initTabsFromJob(
      updatedJob,
      isUserRegistered(customer) ? activeTabIndex : 0
    );
  }
  function clearCustomer() {
    const updatedJob = { ...job, client: {} };
    setJob(updatedJob);
    initTabsFromJob(updatedJob, 0);
  }
  function cancelCheckoutOrder() {
    const updatedJob = { ...job };
    delete updatedJob.id;
    setInvoice({});
    setJob(updatedJob);
    const confirmIndex = tabs.findIndex((t) => t.id === tabIdConfirm);
    initTabsFromJob(updatedJob, confirmIndex >= 0 ? confirmIndex : 0);
  }
  function nextTab() {
    const ndextIndex = activeTabIndex + 1;
    const _tabs: any[] = [...tabs];
    _tabs[ndextIndex].disabled = false;
    setTabs(_tabs as []);
    setActiveTabIndex(ndextIndex);
  }
  function setActiveTabById(tabId: string) {
    const index = tabs.findIndex((t: MerchiCheckoutTab) => t.id === tabId);
    setActiveTabIndex(index);
  }
  const quoteSignature = getCheckoutQuoteSignature(job);
  const quoteSignatureRef = React.useRef('');

  useLayoutEffect(() => {
    if (!product?.id) return;

    const session = loadCheckoutSession(product);
    const mergedJob = mergeJobWithCheckoutSession(job, session);

    if (checkoutSessionChanged(job, mergedJob)) {
      setJob(mergedJob);
    }

    const quoteChanged = quoteSignatureRef.current !== quoteSignature;
    quoteSignatureRef.current = quoteSignature;

    if (!tabs.length || quoteChanged) {
      const restoredInvoice = invoice?.id ? invoice : session?.invoice;
      const restoredIndex =
        quoteChanged && !restoredInvoice?.id
          ? 0
          : getSafeRestoredTabIndex(
              mergedJob,
              { includeDomainSignup, isBuyRequest },
              session?.activeTabIndex ?? 0,
              restoredInvoice
            );
      initTabsFromJob(mergedJob, restoredIndex);
    }

    if (
      !isUserRegistered(mergedJob.client) &&
      !isUserRegistered(session?.client) &&
      isUserRegistered(currentUser)
    ) {
      setJob({ ...mergedJob, client: currentUser });
    }
  }, [product?.id, quoteSignature]);

  useEffect(() => {
    if (!product?.id) return;

    const session = loadCheckoutSession(product);
    if (!invoice?.id && session?.invoice?.id) {
      setInvoice(session.invoice);
    }
  }, [product?.id]);

  useEffect(() => {
    if (!product?.id) return;
    saveCheckoutSession(
      product,
      buildCheckoutSession(
        job,
        activeTabIndex,
        {
          invoice,
          checkoutOpen: isOpen,
          isBuyRequest,
        },
        loadCheckoutSession(product)
      )
    );
  }, [
    product?.id,
    job.client,
    job.shipping,
    job.billing,
    job.shipment,
    job.items,
    activeTabIndex,
    invoice,
    isOpen,
    isBuyRequest,
  ]);
  function discountCallbackSuccess(items: any[]) {
    setJob({ ...job, items });
  }
  function discountCallbackError() {
    setJob({ ...job, items: [] });
  }
  return (
    <MerchiCheckoutContext.Provider
      value={
        {
          activeTabIndex,
          alerts,
          alertClose,
          alertErrorShow,
          classNameMerchiCheckoutAlertsContainer,
          classNameMerchiCheckoutAlert,
          classNameMerchiCheckoutAlertError,
          classNameMerchiCheckoutAlertSuccess,
          classNameMerchiCheckoutButtonPrimary,
          classNameMerchiCheckoutButtonPrimaryBlock,
          classNameMerchiCheckoutButtonSecondary,
          classNameMerchiCheckoutButtonSecondaryBlock,
          classNameMerchiCheckoutButtonDownloadInvoice,
          classNameMerchiCheckoutButtonCancelOrder,
          classNameMerchiCheckoutConfirmInfoPanel,
          classNameMerchiCheckoutFooterActionsContainer,
          classNameMerchiCheckoutFormCheckbox,
          classNameMerchiCheckoutFormGroup,
          classNameMerchiCheckoutFormGroupCheckbox,
          classNameMerchiCheckoutFormInput,
          classNameMerchiCheckoutFormSelect,
          classNameMerchiCheckoutGoogleSuggestList,
          classNameMerchiCheckoutGoogleSuggestListItem,
          classNameMerchiCheckoutListGroupItemLoader,
          classNameMerchiCheckoutFormLabelCheckbox,
          classNameMerchiCheckoutInputError,
          classNameMerchiCheckoutListGroup,
          classNameMerchiCheckoutListGroupItem,
          classNameMerchiCheckoutRow,
          classNameMerchiCheckoutRowColumn,
          classNameMerchiCheckoutSubtitle,
          classNameMerchiCheckoutTabsContainer,
          classNameMerchiCheckoutTab,
          classNameMerchiCheckoutTabButton,
          classNameMerchiCheckoutTabPane,
          classNameMerchiCheckoutTabPaneContainer,
          classNameMerchiInvoiceButtonPayInvoice,
          clearCustomer,
          cancelCheckoutOrder,
          currentUser,
          customer: job.client || {},
          discountButtonText,
          discountCallbackError,
          discountCallbackSuccess,
          discountClassName,
          discountClassNameButton,
          discountClassNameButtonContainer,
          discountClassNameButtonItemRemove,
          discountClassNameErrorMessage,
          discountClassNameInput,
          discountClassNameInputContainer,
          discountClassNameInputdiscountLabel,
          discountClassNameListItem,
          discountClassNameListItems,
          discountClassNameMainContainer,
          discountLabel,
          discountShowAppliedItems,
          domain,
          editDraftTemplate,
          includeDomainSignup,
          invoice,
          isBuyRequest,
          isOpen,
          isProductEmbedForm,
          job,
          loading,
          merchi,
          messageSuccessBuyRequest,
          messageSuccessQuoteRequest,
          nextTab,
          product,
          redirectAfterSuccessUrl,
          redirectAfterQuoteSuccessUrl,
          redirectWithValue,
          setActiveTabById,
          setActiveTabIndex,
          setCustomer,
          setDomain,
          setInvoice,
          setJob,
          showDiscountCode,
          showUserTermsAndConditions,
          tabs,
          toggleMerchiCheckout,
          urlApi,
          urlFrontend,
        } as IMerchiCheckout
      }
    >
      <div className="merchi-checkout">{children}</div>
    </MerchiCheckoutContext.Provider>
  );
};
