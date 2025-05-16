'use client';
import React from 'react';
import TabPane from './TabPane';
import TitleStep from './TitleStep';
import FooterButtons from './FooterButtons';
import { tabIdCustomerInfo } from '../tabs_utils';
import { isUserRegistered, isRegisteredAndHasStore } from '../utils';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { FormCustomerNew, FormCustomerReturning } from './forms';
import FormDomainNew from './forms/FormDomainNew';
import { BiUserCircle } from 'react-icons/bi';

export function CustomerInfo() {
  const { job } = useMerchiCheckboutContext();
  const { client } = job;

  const {
    emailAddresses = [],
    name = 'Returning customer',
    phoneNumbers = [],
  } = client;

  const emailAddress =
    (emailAddresses[0] && emailAddresses[0].emailAddress) || 'Email not shown';

  const phoneNumber =
    (phoneNumbers[0] && phoneNumbers[0].internationalFormatNumber) ||
    'Phone number not shown';

  return (
    <div className='modal-merchi-checkout-customer-details text-left'>
      <strong>{name}</strong>
      <p>{emailAddress}</p>
      <p>{phoneNumber}</p>
    </div>
  );
}

export function SmallCustomerInfo() {
  const { classNameMerchiCheckoutButtonPrimary, clearCustomer } =
    useMerchiCheckboutContext();
  return (
    <div className='w-100 modal-merchi-checkout-customer-card'>
      <CustomerInfo />
      <div className='mt-2'>
        <button
          className={classNameMerchiCheckoutButtonPrimary}
          onClick={clearCustomer}
        >
          <BiUserCircle fontSize='1rem' style={{ marginRight: '0.25rem' }} />{' '}
          Change
        </button>
      </div>
    </div>
  );
}

function CustomerPanel() {
  const { job } = useMerchiCheckboutContext();
  const { client } = job;
  const isActive = isUserRegistered(client);
  return (
    <div className={`${isActive ? '' : 'hide'}`}>
      {client && <SmallCustomerInfo />}
    </div>
  );
}

function TabPaneCustomer() {
  const { job, includeDomainSignup } = useMerchiCheckboutContext();
  const { client } = job;
  const isActive = isUserRegistered(client);
  const { classNameMerchiCheckoutSubtitle } = useMerchiCheckboutContext();

  return (
    <TabPane tabId={tabIdCustomerInfo}>
      <TitleStep title='Customer - Contact info' />
      {isActive ? (
        <CustomerPanel />
      ) : (
        <div
          className={`${
            isActive ? 'hide' : ''
          } d-flex justify-content-center flex-column`}
        >
          <div className='w-100 customer-detail-form'>
            <div className='mt-1 mb-5'>
              <h5 className={classNameMerchiCheckoutSubtitle}>Returning customer</h5>
              <FormCustomerReturning />
            </div>
            <div>
              <h5 className={classNameMerchiCheckoutSubtitle}>New customer</h5>
              <FormCustomerNew />
            </div>
          </div>
        </div>
      )}
      {client && client.id && !client.hasStore && includeDomainSignup && (
        <FormDomainNew />
      )}
      <FooterButtons
        forceDisabled={!isRegisteredAndHasStore(client)}
        isActive={isActive}
      />
    </TabPane>
  );
}

export default TabPaneCustomer;
