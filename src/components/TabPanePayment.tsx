'use client';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { tabIdPayment } from '../tabs_utils';
import TitleStep from './TitleStep';
import TabPane from './TabPane';
import MerchiInvoice from 'merchi_invoice';
import { redirectOnSuccess } from '../utils'

function TabPanePayment() {
  const {
    alertErrorShow,
    classNameMerchiCheckoutButtonDownloadInvoice,
    classNameMerchiInvoiceButtonPayInvoice,
    invoice,
    nextTab,
    redirectAfterSuccessUrl,
    redirectWithValue,
    setInvoice,
    urlApi,
  } = useMerchiCheckboutContext();
  return (
    <TabPane tabId={tabIdPayment}>
      <TitleStep title='Checkout / Payment' />
      <div className='d-flex checkout-border-top'>
        <div className='w-100 mt-3'>
          {invoice && (
            <MerchiInvoice
              alertErrorShow={alertErrorShow}
              callbackCreditCardPaymentSuccess={(i: any) => {
                if (redirectAfterSuccessUrl) {
                  redirectOnSuccess(redirectAfterSuccessUrl, redirectWithValue, i?.invoice?.totalCost);
                } else {
                  setInvoice(i.invoice);
                  nextTab();
                }
              }}
              classNameMerchiInvoiceButtonDownloadInvoice={
                classNameMerchiCheckoutButtonDownloadInvoice
              }
              classNameMerchiInvoiceButtonPayInvoice={
                classNameMerchiInvoiceButtonPayInvoice
              }
              invoice={invoice}
              urlApi={urlApi}
            />
          )}
        </div>
      </div>
    </TabPane>
  );
}

export default TabPanePayment;
