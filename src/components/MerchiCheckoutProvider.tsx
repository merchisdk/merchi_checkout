'use client';
import * as React from 'react';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MerchiCheckoutTab } from '../types';
import { tabsInit } from '../tabs_utils';
import { Merchi } from 'merchi_sdk_ts';

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
  googlePlacesApiKey?: string;
  googlePlacesLoaded?: boolean;
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
  alertClose() {},
  alertErrorShow() {},
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
  clearCustomer() {},
  currentUser: undefined,
  customer: undefined,
  discountButtonText: undefined,
  discountCallbackError() {},
  discountCallbackSuccess() {},
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
  editDraftTemplate() {},
  googlePlacesApiKey: undefined,
  googlePlacesLoaded: false,
  isBuyRequest: false,
  isOpen: false,
  loading: false,
  merchi: undefined,
  messageSuccessBuyRequest: undefined,
  messageSuccessQuoteRequest: undefined,
  nextTab() {},
  includeDomainSignup: false,
  invoice: {},
  isProductEmbedForm: false,
  job: {},
  product: {},
  redirectAfterSuccessUrl: undefined,
  redirectAfterQuoteSuccessUrl: undefined,
  redirectWithValue: true,
  setActiveTabById() {},
  setActiveTabIndex() {},
  setCustomer() {},
  setDomain() {},
  setInvoice() {},
  setJob() {},
  showDiscountCode: true,
  showUserTermsAndConditions: true,
  tabs: [],
  toggleMerchiCheckout() {},
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
  googlePlacesApiKey?: string;
  googlePlacesLoaded?: boolean;
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
  classNameMerchiCheckoutConfirmInfoPanel = 'd-flex align-items-center',
  classNameMerchiCheckoutFooterActionsContainer = 'd-flex justify-content-between mt-4',
  classNameMerchiCheckoutFormCheckbox = 'form-check-input',
  classNameMerchiCheckoutFormGroup = 'form-group',
  classNameMerchiCheckoutFormGroupCheckbox = 'form-check',
  classNameMerchiCheckoutFormInput = 'form-control',
  classNameMerchiCheckoutFormSelect = 'form-control',
  classNameMerchiCheckoutGoogleSuggestList = 'list-group m-b-0',
  classNameMerchiCheckoutGoogleSuggestListItem = 'list-group-item cursor-pointer',
  classNameMerchiCheckoutListGroupItemLoader = 'list-group-item modal-merchi-checkout-shipment-option',
  classNameMerchiCheckoutInputError = 'text-danger',
  classNameMerchiCheckoutFormLabelCheckbox = '',
  classNameMerchiCheckoutListGroup = 'modal-merchi-checkout-shipment-option',
  classNameMerchiCheckoutListGroupItem = 'list-group-item',
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
  discountClassNameInputdiscountLabel = 'visually-hidden',
  discountClassNameListItem = 'list-group-item d-flex align-items-center justify-content-between mt-2',
  discountClassNameListItems = 'list-group',
  discountClassNameMainContainer,
  discountLabel = 'Discount code',
  discountShowAppliedItems = true,
  googlePlacesApiKey,
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
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [domain, setDomain] = useState(null);
  const [tabs, setTabs] = useState([] as any[]);
  const [googlePlacesLoaded, setGoogleMapsLoaded] = useState(false);
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
  function resetTabs() {
    const _tabs = tabsInit({
      job,
      includeDomainSignup,
      isBuyRequest,
    });
    setTabs(_tabs as []);
  }
  function setCustomer(customer: any) {
    setJob({ ...job, client: customer });
    resetTabs();
  }
  function clearCustomer() {
    setCustomer({});
    resetTabs();
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
  // Persistent callback setup
  if (typeof window !== 'undefined') {
    if (!(window as any).googleMapsScriptLoaded) {
      (window as any).googleMapsScriptLoaded = () => {
        setGoogleMapsLoaded(true);
      };
    }
  }
  useEffect(() => {
    if (job.product && !tabs.length) {
      resetTabs();
    }
    if (!job.client) {
      setCustomer(currentUser || {});
    }
  }, [job]);
  useEffect(() => {
    // Use an ID for easier detection
    if (googlePlacesApiKey) {
      const scriptId = 'googleMapsScript';

      // Check if the script already exists
      const existingScript = document.getElementById(scriptId);
      // Check if any script from maps.googleapis.com already exists in the document
      const existingScript2 = document.querySelector(
        `script[src^="https://maps.googleapis.com/maps-api-v3/api/js/"]`
      );

      if (!existingScript && !existingScript2) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesApiKey}&libraries=places&callback=googleMapsScriptLoaded`;
        script.async = true;
        script.defer = true;
        // Append the script to the head
        document.head.appendChild(script);
      } else {
        setGoogleMapsLoaded(true);
      }
    }
  }, [googlePlacesApiKey]);
  function discountCallbackSuccess(items: any[]) {
    setJob({...job, items});
  }
  function discountCallbackError() {
    setJob({...job, items: []});
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
          googlePlacesLoaded,
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
      {children}
    </MerchiCheckoutContext.Provider>
  );
};
