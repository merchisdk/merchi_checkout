'use client';
import { useState } from 'react';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { tabIdPayment } from '../tabs_utils';
import TitleStep from './TitleStep';
import TabPane from './TabPane';
import MerchiInvoice from 'merchi_invoice';
import CancelOrderConfirmModal from './CancelOrderConfirmModal';
import { redirectOnSuccess } from '../utils';

function TabPanePayment() {
  const {
    alertErrorShow,
    cancelCheckoutOrder,
    classNameMerchiCheckoutButtonCancelOrder,
    classNameMerchiCheckoutButtonDownloadInvoice,
    classNameMerchiCheckoutButtonPrimary,
    classNameMerchiCheckoutButtonSecondary,
    classNameMerchiInvoiceButtonPayInvoice,
    invoice,
    nextTab,
    redirectAfterSuccessUrl,
    redirectWithValue,
    setInvoice,
    urlApi,
  } = useMerchiCheckboutContext();
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  function handleConfirmCancel() {
    setConfirmCancelOpen(false);
    cancelCheckoutOrder();
  }

  return (
    <TabPane tabId={tabIdPayment}>
      <TitleStep title='Checkout / Payment' />
      <div className='d-flex checkout-border-top'>
        <div className='w-100 mt-3'>
          {invoice?.id && (
            <>
              <MerchiInvoice
                alertErrorShow={alertErrorShow}
                callbackCreditCardPaymentSuccess={(i: any) => {
                  if (redirectAfterSuccessUrl) {
                    redirectOnSuccess(
                      redirectAfterSuccessUrl,
                      redirectWithValue,
                      i?.invoice?.totalCost
                    );
                  } else {
                    setInvoice(i?.invoice ?? i);
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
              <div className='merchi-checkout-cancel-order'>
                <button
                  type='button'
                  className={classNameMerchiCheckoutButtonCancelOrder}
                  onClick={() => setConfirmCancelOpen(true)}
                >
                  Cancel Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <CancelOrderConfirmModal
        isOpen={confirmCancelOpen}
        onCancel={() => setConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        classNameConfirmButton={classNameMerchiCheckoutButtonPrimary}
        classNameDismissButton={classNameMerchiCheckoutButtonSecondary}
      />
    </TabPane>
  );
}

export default TabPanePayment;
