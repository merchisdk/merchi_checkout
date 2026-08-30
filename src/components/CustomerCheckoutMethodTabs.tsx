'use client';
import React, { useState } from 'react';
import { BiCheck, BiUser } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormCustomerNew, FormCustomerReturning, FormWhatsappCustomer } from './forms';

type CheckoutMethod = 'new' | 'returning' | 'whatsapp';

interface CustomerCheckoutMethodTabsProps {
  whatsappEnabled?: boolean;
}

const userIcon = <BiUser className="merchi-customer-checkout-option__icon-svg" />;
const whatsappIcon = (
  <FaWhatsapp className="merchi-customer-checkout-option__icon-svg merchi-customer-checkout-option__icon-svg--whatsapp" />
);

export default function CustomerCheckoutMethodTabs({
  whatsappEnabled = false,
}: CustomerCheckoutMethodTabsProps) {
  const [activeMethod, setActiveMethod] = useState<CheckoutMethod | null>(null);

  const sections: Array<{
    id: CheckoutMethod;
    label: string;
    icon: React.ReactNode;
    form: React.ReactNode;
  }> = [
    {
      id: 'returning',
      label: 'Returning customer',
      icon: userIcon,
      form: <FormCustomerReturning />,
    },
    {
      id: 'new',
      label: 'New customer',
      icon: userIcon,
      form: <FormCustomerNew />,
    },
  ];

  if (whatsappEnabled) {
    sections.push({
      id: 'whatsapp',
      label: 'WhatsApp checkout',
      icon: whatsappIcon,
      form: <FormWhatsappCustomer />,
    });
  }

  return (
    <>
      <p className="merchi-customer-checkout__heading">Choose a checkout option</p>
      <div
        className="merchi-customer-checkout-options"
        role="radiogroup"
        aria-label="Choose a checkout option"
      >
        {sections.map((section) => {
          const isSelected = activeMethod === section.id;
          return (
            <div
              key={section.id}
              className={`merchi-customer-checkout-option${isSelected ? ' is-selected' : ''}`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-expanded={isSelected}
                className="merchi-customer-checkout-option__header"
                onClick={() => setActiveMethod(section.id)}
              >
                <span className="merchi-customer-checkout-option__title">
                  <span className="merchi-customer-checkout-option__icon">
                    {section.icon}
                  </span>
                  <span className="merchi-customer-checkout-option__label">
                    {section.label}
                  </span>
                </span>
                <span className="merchi-customer-checkout-option__checkbox" aria-hidden>
                  {isSelected && <BiCheck />}
                </span>
              </button>
              {isSelected && (
                <div className="merchi-customer-checkout-option__body">
                  {section.form}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
