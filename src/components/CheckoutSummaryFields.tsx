'use client';
import React from 'react';

export function SummaryFieldRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className='merchi-checkout-summary-variation-row'>
      <div className='merchi-checkout-summary-variation-label'>{label}</div>
      <div className='merchi-checkout-summary-variation-value'>{value}</div>
    </div>
  );
}

export function SummaryAmountRow({
  label,
  amount,
  labelExtra,
  className = '',
}: {
  label: string;
  amount: React.ReactNode;
  labelExtra?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`merchi-checkout-summary-amount ${className}`.trim()}>
      <div className='merchi-checkout-summary-total-label'>
        <small>{label}</small>
        {labelExtra}
      </div>
      <strong className='merchi-checkout-summary-total-amount'>{amount}</strong>
    </div>
  );
}
