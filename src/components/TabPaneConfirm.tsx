'use client';
import * as React from 'react';
import { useState } from 'react';
import { submitBuyNow, submitQuoteRequest } from '../actions/confirm';
import TabPane from './TabPane';
import TitleStep from './TitleStep';
import FooterButtons from './FooterButtons';
import { currencyTaxAndCost } from './currency';
import {
  hasDraftTab,
  tabIdConfirm,
  tabIdDrafting,
  tabIdCustomerInfo,
  tabIdShipment,
} from '../tabs_utils';
import { addressInOneLine, isProductSupplierMOD, redirectOnSuccess } from '../utils';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { DraftImagesStatic } from './DraftImageUploaded';
import JobInfoContent from './JobInfoContent';
import { SmallCustomerInfo } from './TabPaneCustomer';
import DiscountInputGroup from './DiscountInputGroup';

interface PropsShippingAddressInfo {
  address: any;
  titleClass: string;
}

export function ShippingAddressInfo({
  address,
  titleClass = '',
}: PropsShippingAddressInfo) {
  return (
    <div>
      <p className={`text-capitalize ${titleClass}`}>
        {addressInOneLine(address)}
      </p>
    </div>
  );
}

interface PropsShipmentOptionInfoConfirm {
  shipment: any;
}

function ShipmentOptionInfoConfirm({
  shipment,
}: PropsShipmentOptionInfoConfirm) {
  const { shipmentMethod, taxType } = shipment;
  const { currency, name } = shipmentMethod;
  return (
    <div className='shipment-option-info-confirm'>
      <div className='my-1'>
        <p className='mb-0'>{name}</p>
      </div>
      <div className='mt-3 pt-2 total-order-cost-container'>
        <small className='mb-1 d-block'>Shipment Cost</small>
        <strong className='mb-0'>
          {currencyTaxAndCost(currency, taxType, shipment.cost)}
        </strong>
      </div>
    </div>
  );
}

interface PropsConfirmInfoPanel {
  content: any;
  minHeight: any;
  onClick: () => void;
  showClickToEdit?: boolean;
  title: string;
}

export function ConfirmInfoPanel({
  content,
  minHeight,
  onClick,
  showClickToEdit,
}: PropsConfirmInfoPanel) {
  const cursor = showClickToEdit ? 'pointer' : 'auto';
  return (
    <div
      className='d-flex align-items-center'
      style={{ cursor, minHeight }}
      onClick={onClick}
    >
      <div className='flex-fill'>{content}</div>
    </div>
  );
}

function ConfirmAddressAndShipmentInfo() {
  const { job } = useMerchiCheckboutContext();
  const { shipping, shipment } = job;
  return (
    <div className='text-left px-3 py-3 modal-merchi-checkout-shipment-detail'>
      <strong>Shipment Detail</strong>
      {shipping && (
        <div className='my-1'>
          <small className='mb-1'>Address</small>
          <ShippingAddressInfo titleClass='mb-0' address={shipping} />
        </div>
      )}
      {shipment && <ShipmentOptionInfoConfirm shipment={shipment} />}
    </div>
  );
}

function DiscountGroupContainer() {
  const {
    discountLabel,
    discountClassNameInputdiscountLabel,
  } = useMerchiCheckboutContext();
  return (
    <div className='text-left py-3 modal-merchi-checkout-discount-code'>
      {discountLabel && (
        <strong className={discountClassNameInputdiscountLabel}>
          {discountLabel}
        </strong>
      )}
      <DiscountInputGroup />
    </div>
  );
}

function ConfirmInfo() {
  const { job, setActiveTabById, tabs } = useMerchiCheckboutContext();
  const { client, ownDrafts, product } = job;
  const isResell = isProductSupplierMOD(product);
  const needsShipping = product && product.needsShipping;
  return (
    <>
      {client && (
        <ConfirmInfoPanel
          minHeight='0px'
          onClick={() => setActiveTabById(tabIdCustomerInfo)}
          showClickToEdit={false}
          title='Edit'
          content={<SmallCustomerInfo />}
        />
      )}
      <ConfirmInfoPanel
        minHeight='0px'
        onClick={() => {
          return;
        }}
        showClickToEdit={false}
        title='Edit'
        content={<JobInfoContent />}
      />
      {!!(!isResell && needsShipping) && (
        <ConfirmInfoPanel
          minHeight='0px'
          onClick={() => setActiveTabById(tabIdShipment)}
          showClickToEdit={false}
          title='Edit'
          content={<ConfirmAddressAndShipmentInfo />}
        />
      )}
      {!!(hasDraftTab(tabs) && ownDrafts) && (
        <ConfirmInfoPanel
          minHeight='0px'
          onClick={() => setActiveTabById(tabIdDrafting)}
          showClickToEdit={false}
          title='Edit'
          content={
            ownDrafts.length ? (
              <div className='parent-variation-card px-3 py-3 mt-4 file-upload-preview'>
                <strong>Uploaded Files</strong>
                <DraftImagesStatic
                  className='width-100 mt-2 z-index-10000'
                  items={ownDrafts}
                />
              </div>
            ) : (
              ''
            )
          }
        />
      )}
    </>
  );
}

function TabPaneConfirm() {
  const {
    alertErrorShow,
    job,
    isBuyRequest,
    nextTab,
    product,
    redirectAfterSuccessUrl,
    redirectAfterQuoteSuccessUrl,
    redirectWithValue,
    setInvoice,
    setJob,
    showDiscountCode,
    urlApi,
  } = useMerchiCheckboutContext();
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    try {
      if (isBuyRequest) {
        const response = await submitBuyNow(
          (urlApi as string),
          { ...job, product: { id: product.id },
        });
        if (response.ok) {
          const invoice = await response.json();
          setInvoice({ ...invoice.invoice });
          setLoading(false);
          nextTab();
        } else {
          const error = await response.json();
          alertErrorShow(error.message);
          setLoading(false);
        }
      } else {
        const response = await submitQuoteRequest((urlApi as string), job);
        if (response.ok) {
          const quote = await response.json();
          let quoteRedirect = redirectAfterQuoteSuccessUrl ?
            String(redirectAfterQuoteSuccessUrl) :
            String(redirectAfterSuccessUrl);
          if (quoteRedirect) {
            redirectOnSuccess(quoteRedirect, redirectWithValue, quote.job.totalCost);
          } else {
            setJob({ ...job, id: quote.job.id });
            setLoading(false);
            nextTab();
          }
        } else {
          const error = await response.json();
          alertErrorShow(error.message);
        }
        setLoading(false);
      }
    } catch (e: any) {
      alertErrorShow(e.message);
      setLoading(false);
    }
  }
  return (
    <TabPane tabId={tabIdConfirm}>
      <TitleStep title='Confirm - Quote Summary' />
      <ConfirmInfo />
      {showDiscountCode && (
        <DiscountGroupContainer />
      )}
      <FooterButtons
        forceDisabled={false}
        loading={loading}
        onClickNext={submit}
      />
    </TabPane>
  );
}

export default TabPaneConfirm;
