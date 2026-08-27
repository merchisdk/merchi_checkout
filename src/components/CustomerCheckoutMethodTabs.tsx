'use client';
import React, { useState } from 'react';
import { BiChevronDown, BiUser } from 'react-icons/bi';
import WhatsappIcon from './WhatsappIcon';
import { FormCustomerNew, FormCustomerReturning, FormWhatsappCustomer } from './forms';

type CheckoutMethod = 'new' | 'returning' | 'whatsapp';

interface CustomerCheckoutMethodTabsProps {
  whatsappEnabled?: boolean;
}

export default function CustomerCheckoutMethodTabs({
  whatsappEnabled = false,
}: CustomerCheckoutMethodTabsProps) {
  const [activeMethod, setActiveMethod] = useState<CheckoutMethod | null>(null);

  const toggleMethod = (method: CheckoutMethod) => {
    setActiveMethod((current) => (current === method ? null : method));
  };

  const sections: Array<{
    id: CheckoutMethod;
    label: string;
    icon: React.ReactNode;
    form: React.ReactNode;
  }> = [
      {
        id: 'returning',
        label: 'Returning customer',
        icon: <BiUser fontSize="1.05rem" />,
        form: <FormCustomerReturning />,
      },
      {
        id: 'new',
        label: 'New customer',
        icon: <BiUser fontSize="1.05rem" />,
        form: <FormCustomerNew />,
      },
    ];

  if (whatsappEnabled) {
    sections.push({
      id: 'whatsapp',
      label: 'WhatsApp checkout',
      icon: <WhatsappIcon size={18} />,
      form: <FormWhatsappCustomer />,
    });
  }

  return (
    <div className="merchi-customer-checkout-tabs">
      {sections.map((section) => {
        const isOpen = activeMethod === section.id;
        return (
          <div
            key={section.id}
            className={`merchi-customer-checkout-tab${isOpen ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="merchi-customer-checkout-tab__header"
              onClick={() => toggleMethod(section.id)}
              aria-expanded={isOpen}
            >
              <span className="merchi-customer-checkout-tab__title">
                <span className="merchi-customer-checkout-tab__icon">
                  {section.icon}
                </span>
                <span>{section.label}</span>
              </span>
              <BiChevronDown className="merchi-customer-checkout-tab__chevron" />
            </button>
            {isOpen && (
              <div className="merchi-customer-checkout-tab__body">
                {section.form}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
