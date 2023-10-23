'use client';
import { MerchiCheckoutProvider } from './MerchiCheckoutProvider';
import MerchiCheckoutTabs from './MerchiCheckoutTabs';
import TabPaneAddress from './TabPaneAddress';
import TabPaneDrafting from './TabPaneDrafting';
import TabPaneConfirm from './TabPaneConfirm';
import TabPaneContainer from './TabPaneContainer';
import TabPaneCustomer from './TabPaneCustomer';
import TabPaneSubmitted from './TabPaneSubmitted';
import TabPanePayment from './TabPanePayment';
import TabPaneNewDomain from './TabPaneNewDomain';
import Alerts from './Alerts';

interface Props {
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
  hideDrafting?: boolean;
  includeDomainSignup?: boolean;
  invoice: any;
  isBuyRequest?: boolean;
  isOpen: boolean;
  isProductEmbedForm?: boolean;
  job: any;
  product: any;
  setInvoice: (invoice: any) => void;
  setJob: (job: any) => void;
  showUserTermsAndConditions?: boolean;
  toggleMerchiCheckout: () => void;
}

function MerchiCheckout(props: Props) {
  return (
    <MerchiCheckoutProvider {...props}>
      <Alerts />
      <MerchiCheckoutTabs />
      <TabPaneContainer>
        <TabPaneCustomer />
        <TabPaneDrafting />
        <TabPaneAddress />
        <TabPaneConfirm />
        <TabPaneSubmitted />
        <TabPanePayment />
      </TabPaneContainer>
    </MerchiCheckoutProvider>
  );
}

export default MerchiCheckout;
