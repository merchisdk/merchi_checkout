'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MerchiCheckoutTab } from '../types';
import { tabsInit } from '../tabs_utils';

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
  classNameMerchiCheckoutFormCheckbox?: string;
  classNameMerchiCheckoutFormGroup?: string;
  classNameMerchiCheckoutFormGroupCheckbox?: string;
  classNameMerchiCheckoutFormInput?: string;
  classNameMerchiCheckoutGoogleSuggestList?: string;
  classNameMerchiCheckoutGoogleSuggestListItem?: string;
  classNameMerchiCheckoutListGroupItemLoader?: string;
  classNameMerchiCheckoutFormLabelCheckbox?: string;
  classNameMerchiCheckoutInputError?: string;
  classNameMerchiCheckoutListGroup?: string;
  classNameMerchiCheckoutListGroupItem?: string;
  classNameMerchiCheckoutRow?: string;
  classNameMerchiCheckoutRowColumn?: string;
  classNameMerchiCheckoutTabsContainer?: string;
  classNameMerchiCheckoutTab?: string;
  classNameMerchiCheckoutTabPane?: string;
  classNameMerchiCheckoutTabPaneContainer?: string;
  classNameMerchiCheckoutTabButton?: string;
  classNameMerchiInvoiceButtonPayInvoice?: string;
  clearCustomer: () => void;
  currentUser?: any;
  customer?: any;
  domain?: any;
  editDraftTemplate: (index: number, draft: any) => void;
  googlePlacesApiKey?: string;
  googlePlacesLoaded?: boolean;
  hideDrafting?: boolean;
  includeDomainSignup?: boolean;
  invoice: any;
  isBuyRequest?: boolean;
  isOpen?: boolean;
  isProductEmbedForm?: boolean;
  job: any;
  loading: boolean;
  messageSuccessBuyRequest?: string;
  messageSuccessQuoteRequest?: string;
  nextTab: () => void;
  product: any;
  setActiveTabById: (id: string) => void;
  setActiveTabIndex: (index: number) => void;
  setCustomer: (customer: any) => void;
  setDomain: (domain: any) => void;
  setInvoice: (invoice: any) => void;
  setJob: (job: any) => void;
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
  classNameMerchiCheckoutFormCheckbox: undefined,
  classNameMerchiCheckoutFormGroup: undefined,
  classNameMerchiCheckoutFormGroupCheckbox: undefined,
  classNameMerchiCheckoutFormInput: undefined,
  classNameMerchiCheckoutGoogleSuggestList: undefined,
  classNameMerchiCheckoutGoogleSuggestListItem: undefined,
  classNameMerchiCheckoutListGroupItemLoader: undefined,
  classNameMerchiCheckoutInputError: undefined,
  classNameMerchiCheckoutListGroup: undefined,
  classNameMerchiCheckoutListGroupItem: undefined,
  classNameMerchiCheckoutRow: undefined,
  classNameMerchiCheckoutRowColumn: undefined,
  classNameMerchiCheckoutTabsContainer: undefined,
  classNameMerchiCheckoutFormLabelCheckbox: undefined,
  classNameMerchiCheckoutTab: undefined,
  classNameMerchiCheckoutTabPane: undefined,
  classNameMerchiCheckoutTabPaneContainer: undefined,
  classNameMerchiCheckoutTabButton: undefined,
  classNameMerchiInvoiceButtonPayInvoice: undefined,
  clearCustomer() {},
  currentUser: undefined,
  customer: undefined,
  domain: undefined,
  editDraftTemplate() {},
  googlePlacesApiKey: undefined,
  googlePlacesLoaded: false,
  hideDrafting: false,
  isBuyRequest: false,
  isOpen: false,
  loading: false,
  messageSuccessBuyRequest: undefined,
  messageSuccessQuoteRequest: undefined,
  nextTab() {},
  includeDomainSignup: false,
  invoice: {},
  isProductEmbedForm: false,
  job: {},
  product: {},
  setActiveTabById() {},
  setActiveTabIndex() {},
  setCustomer() {},
  setDomain() {},
  setInvoice() {},
  setJob() {},
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
  classNameMerchiCheckoutFormCheckbox?: string;
  classNameMerchiCheckoutFormGroup?: string;
  classNameMerchiCheckoutFormGroupCheckbox?: string;
  classNameMerchiCheckoutFormInput?: string;
  classNameMerchiCheckoutGoogleSuggestList?: string;
  classNameMerchiCheckoutGoogleSuggestListItem?: string;
  classNameMerchiCheckoutListGroupItemLoader?: string;
  classNameMerchiCheckoutInputError?: string;
  classNameMerchiCheckoutListGroup?: string;
  classNameMerchiCheckoutListGroupItem?: string;
  classNameMerchiCheckoutRow?: string;
  classNameMerchiCheckoutRowColumn?: string;
  classNameMerchiCheckoutTabsContainer?: string;
  classNameMerchiCheckoutFormLabelCheckbox?: string;
  classNameMerchiCheckoutTab?: string;
  classNameMerchiCheckoutTabButton?: string;
  classNameMerchiCheckoutTabPane?: string;
  classNameMerchiCheckoutTabPaneContainer?: string;
  classNameMerchiInvoiceButtonPayInvoice?: string;
  currentUser?: any;
  googlePlacesApiKey?: string;
  googlePlacesLoaded?: boolean;
  hideDrafting?: boolean;
  includeDomainSignup?: boolean;
  isBuyRequest?: boolean;
  isOpen: boolean;
  isProductEmbedForm?: boolean;
  messageSuccessBuyRequest?: string;
  messageSuccessQuoteRequest?: string;
  showUserTermsAndConditions?: boolean;
  invoice: any;
  job: any;
  product: any;
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
  classNameMerchiCheckoutFormCheckbox = 'form-check-input',
  classNameMerchiCheckoutFormGroup = 'form-group',
  classNameMerchiCheckoutFormGroupCheckbox = 'form-check',
  classNameMerchiCheckoutFormInput = 'form-control',
  classNameMerchiCheckoutGoogleSuggestList = 'list-group m-b-0',
  classNameMerchiCheckoutGoogleSuggestListItem = 'list-group-item cursor-pointer',
  classNameMerchiCheckoutListGroupItemLoader = 'list-group-item modal_merchi-checkout-shipment-option',
  classNameMerchiCheckoutInputError = 'text-danger',
  classNameMerchiCheckoutFormLabelCheckbox = '',
  classNameMerchiCheckoutListGroup = 'modal_merchi-checkout-shipment-option',
  classNameMerchiCheckoutListGroupItem = 'list-group-item',
  classNameMerchiCheckoutRow = 'merchi-row',
  classNameMerchiCheckoutRowColumn = 'merchi-column',
  classNameMerchiCheckoutTabsContainer = 'merchi-checkout-tabs-container',
  classNameMerchiCheckoutTab = 'merchi-checkout-tab',
  classNameMerchiCheckoutTabButton = 'btn merchi-checkout-tab-btn',
  classNameMerchiCheckoutTabPane = 'tab-pane',
  classNameMerchiCheckoutTabPaneContainer = 'tab-content',
  classNameMerchiInvoiceButtonPayInvoice = 'btn btn-lg btn-primary btn-block',
  currentUser,
  googlePlacesApiKey,
  hideDrafting = true,
  includeDomainSignup = false,
  invoice,
  isBuyRequest,
  isOpen,
  isProductEmbedForm = false,
  job,
  product,
  messageSuccessBuyRequest,
  messageSuccessQuoteRequest,
  setInvoice,
  setJob,
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
      hideDrafting,
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
          classNameMerchiCheckoutFormCheckbox,
          classNameMerchiCheckoutFormGroup,
          classNameMerchiCheckoutFormGroupCheckbox,
          classNameMerchiCheckoutFormInput,
          classNameMerchiCheckoutGoogleSuggestList,
          classNameMerchiCheckoutGoogleSuggestListItem,
          classNameMerchiCheckoutListGroupItemLoader,
          classNameMerchiCheckoutFormLabelCheckbox,
          classNameMerchiCheckoutInputError,
          classNameMerchiCheckoutListGroup,
          classNameMerchiCheckoutListGroupItem,
          classNameMerchiCheckoutRow,
          classNameMerchiCheckoutRowColumn,
          classNameMerchiCheckoutTabsContainer,
          classNameMerchiCheckoutTab,
          classNameMerchiCheckoutTabButton,
          classNameMerchiCheckoutTabPane,
          classNameMerchiCheckoutTabPaneContainer,
          classNameMerchiInvoiceButtonPayInvoice,
          clearCustomer,
          currentUser,
          customer: job.client || {},
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
          messageSuccessBuyRequest,
          messageSuccessQuoteRequest,
          nextTab,
          product,
          setActiveTabById,
          setActiveTabIndex,
          setCustomer,
          setDomain,
          setInvoice,
          setJob,
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
