'use client';
import Cookies from 'js-cookie';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { tabIdComplete } from '../tabs_utils';
import TitleStep from './TitleStep';
import TabPane from './TabPane';
import InvoiceInfo from './InvoiceInfo';
import { completeCheckoutSession } from '../checkoutSession';
import { clearMerchiSource } from '../merchi_source';

function CompleteButton({ className }: { className: string }) {
  const { product } = useMerchiCheckboutContext();

  function handleComplete() {
    completeCheckoutSession(product);
    clearMerchiSource();
    window.location.reload();
  }

  return (
    <button type='button' className={className} onClick={handleComplete}>
      Complete!
    </button>
  );
}

function TabPaneSubmitted() {
  const {
    classNameMerchiCheckoutButtonPrimary,
    classNameMerchiCheckoutButtonPrimaryBlock,
    classNameMerchiCheckoutButtonSecondary,
    classNameMerchiCheckoutButtonSecondaryBlock,
    invoice,
    isBuyRequest,
    isProductEmbedForm,
    job,
    messageSuccessBuyRequest,
    messageSuccessQuoteRequest,
    urlFrontend,
  } = useMerchiCheckboutContext();
  const activeSession = Cookies.get('session_token');
  const msg = isBuyRequest
    ? messageSuccessBuyRequest
    : messageSuccessQuoteRequest;
  return (
    <TabPane tabId={tabIdComplete}>
      <TitleStep
        title={`Thank You - ${isBuyRequest ? 'Received' : 'Submitted'}`}
      />
      {isBuyRequest && invoice?.id ? <InvoiceInfo invoice={invoice} /> : null}
      <div className='d-flex justify-content-center'>
        <div className='w-100'>
          <div className='py-3'>
            <p>{msg}</p>
          </div>
          <div
            className={
              isProductEmbedForm
                ? 'd-none d-sm-flex justify-content-center'
                : 'd-none d-sm-flex justify-content-between'
            }
          >
            {isProductEmbedForm ? (
              <CompleteButton className={classNameMerchiCheckoutButtonPrimary} />
            ) : (
              <>
                <CompleteButton className={classNameMerchiCheckoutButtonSecondary} />
                {!!(activeSession && job.id && !isBuyRequest) && (
                  <a
                    className={classNameMerchiCheckoutButtonPrimary}
                    href={`${urlFrontend}jobs/${job.id}/`}
                  >
                    View Job
                  </a>
                )}
              </>
            )}
          </div>
          <div
            className={
              isProductEmbedForm
                ? 'd-sm-none d-flex justify-content-center'
                : 'd-sm-none'
            }
          >
            {isProductEmbedForm ? (
              <CompleteButton className={classNameMerchiCheckoutButtonPrimary} />
            ) : (
              <>
                <CompleteButton className={classNameMerchiCheckoutButtonPrimaryBlock} />
                {!!(activeSession && job.id && !isBuyRequest) && (
                  <a
                    className={classNameMerchiCheckoutButtonSecondaryBlock}
                    href={`${urlFrontend}jobs/${job.id}/`}
                  >
                    View Job
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TabPane>
  );
}

export default TabPaneSubmitted;
