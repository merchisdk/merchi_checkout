'use client';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { tabIdPayment } from '../tabs_utils';
import TitleStep from './TitleStep';
import TabPane from './TabPane';
import MerchiInvoice from 'merchi_invoice';

function TabPanePayment() {
  const {
    alertErrorShow,
    classNameMerchiCheckoutButtonDownloadInvoice,
    classNameMerchiInvoiceButtonPayInvoice,
    invoice,
    nextTab,
    setInvoice,
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
                setInvoice(i.invoice);
                nextTab();
              }}
              classNameMerchiInvoiceButtonDownloadInvoice={
                classNameMerchiCheckoutButtonDownloadInvoice
              }
              classNameMerchiInvoiceButtonPayInvoice={
                classNameMerchiInvoiceButtonPayInvoice
              }
              invoice={invoice}
            />
          )}
        </div>
      </div>
    </TabPane>
  );
}

export default TabPanePayment;
