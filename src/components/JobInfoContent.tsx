'use client';
import React from 'react';
import { formatCurrency, currencyTotalCostShowIncTax } from './currency';
import {
  isInstructionsType,
  isProductSupplierMOD,
  isSelectable,
  FieldType,
} from '../utils';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import {
  SummaryAmountRow,
  SummaryFieldRow,
} from './CheckoutSummaryFields';

function formatCost(product: any, cost: number) {
  const currency = product.currency ? product.currency : 'AUD';
  return formatCurrency(cost, {
    currency,
    showCodeIfNoSymbol: false,
  });
}

function VariationInfoBody({ cost, name, product, value, files, type }: any) {
  const isColourPicker = type === FieldType.COLOUR_PICKER;
  const displayValue = isColourPicker
    ? null
    : value;
  return (
    <div className='merchi-checkout-summary-variation-row'>
      <div className='merchi-checkout-summary-variation-label'>{name}</div>
      <div className='merchi-checkout-summary-variation-value'>
        <div className='d-flex' style={{ gap: '0.5rem' }}>
          {files &&
            files.map((file: any) => (
              <img
                key={file.viewUrl}
                className='modal-merchi-checkout-job-info-content-img'
                src={file.viewUrl}
                alt={file.name}
              />
            ))}
        </div>
        {isColourPicker && value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{ backgroundColor: value }}
              className='color-indicator'
            />
            <span>{value}</span>
          </div>
        )}
        {displayValue && displayValue} {cost ? `+ ${formatCost(product, cost)}` : ''}
        {!(files?.length) && !value && '-'}
      </div>
    </div>
  );
}

function VariationInfo({ product, variation }: any) {
  const { selectedOptions, variationField, variationFiles } = variation;
  const { fieldType, sellerProductEditable } = variationField;
  const isVariationSelectable = isSelectable(fieldType);
  const options = selectedOptions;
  return (
    <div className='merchi-checkout-summary-variation'>
      {isVariationSelectable && options ? (
        <VariationOptionsInfoBody
          name={variationField.name}
          fieldType={fieldType}
          value={variation.value}
          product={product}
          files={variationFiles}
          selectedOptions={options}
          sellerProductEditable={sellerProductEditable}
        />
      ) : (
        <VariationInfoBody
          name={variationField.name}
          type={variationField.fieldType}
          value={variation.value}
          files={variationFiles}
          product={product}
          cost={sellerProductEditable ? 0 : variation.cost}
        />
      )}
    </div>
  );
}

function ColourSelectOption({ option }: { option: any }) {
  const label = option?.value?.trim() || '';
  const hex = option?.colour?.trim() || '';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
      {hex && (
        <span
          style={{
            display: 'inline-block',
            width: '0.875rem',
            height: '0.875rem',
            borderRadius: '50%',
            backgroundColor: hex,
            border: '1px solid rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}
        />
      )}
      {label || hex || '–'}
    </span>
  );
}

function VariationOptionsInfoBody({
  name,
  selectedOptions,
  sellerProductEditable,
  product,
  fieldType,
}: any) {
  const firstOption = selectedOptions[0];
  const isColourSelect = fieldType === FieldType.COLOUR_SELECT;

  function renderOptionLabel(o: any) {
    if (isColourSelect) return <ColourSelectOption option={o} />;
    return (
      <>
        {o.value?.trim() || '–'}
        {Boolean(o.totalCost && !sellerProductEditable)
          ? ` + ${formatCost(product, o.totalCost)}`
          : ''}
      </>
    );
  }

  return (
    <>
      {selectedOptions.length > 1 ? (
        <div className='merchi-checkout-summary-variation-row'>
          <div className='merchi-checkout-summary-variation-label'>{name}</div>
          <ul className='merchi-checkout-summary-variation-value list-unstyled m-0'>
            {selectedOptions.map((o: any, i: number) => (
              <li key={`${i}-option-key-${o.optionId ?? i}`}>
                {renderOptionLabel(o)}
              </li>
            ))}
          </ul>
        </div>
      ) : firstOption ? (
        <div className='merchi-checkout-summary-variation-row'>
          <div className='merchi-checkout-summary-variation-label'>{name}</div>
          <div className='merchi-checkout-summary-variation-value'>
            {renderOptionLabel(firstOption)}
          </div>
        </div>
      ) : (
        <div className='merchi-checkout-summary-variation-row'>
          <div className='merchi-checkout-summary-variation-label'>{name}</div>
          <div className='merchi-checkout-summary-variation-value'>-</div>
        </div>
      )}
    </>
  );
}

function VariationsInfo({ product, quantity, variations = [] }: any) {
  return (
    <div className='merchi-checkout-summary-variations'>
      {variations.map((v: any, i: number) =>
        !isInstructionsType(v.variationField.fieldType) ? (
          <VariationInfo
            quantity={quantity}
            variation={v}
            product={product}
            key={i}
          />
        ) : null
      )}
    </div>
  );
}

function VariationGroupInfo({ group, index, product }: any) {
  const isResell = isProductSupplierMOD(product);
  const { quantity, variations } = group;
  const visibleVariations = (variations ?? []).filter(
    (v: any) => !isInstructionsType(v?.variationField?.fieldType)
  );
  const costLabel = isResell ? 'Unit Cost' : 'Group Cost';

  return (
    <section className='merchi-checkout-summary-group'>
      <strong className='merchi-checkout-summary-order-detail-title'>
        Group {index + 1} Detail
      </strong>
      {!isResell && quantity > 0 && (
        <SummaryFieldRow label='Quantity' value={quantity} />
      )}
      {visibleVariations.length > 0 && (
        <VariationsInfo
          quantity={quantity}
          variations={variations}
          product={product}
        />
      )}
      <strong className='merchi-checkout-summary-group-cost'>
        {costLabel}: {formatCost(product, group.groupCost)}
      </strong>
    </section>
  );
}

export default function JobInfoContent() {
  const { job } = useMerchiCheckboutContext();
  const { product, quantity = 0, variations = [], variationsGroups = [] } = job;
  const { needsShipping } = product;
  const totalCost = currencyTotalCostShowIncTax(job);
  const isResell = isProductSupplierMOD(product);
  const hasGroups = variationsGroups.length > 0;
  const jobLevelVariations = (variations ?? []).filter(
    (v: any) => !isInstructionsType(v?.variationField?.fieldType)
  );
  const totalQuantity = hasGroups
    ? variationsGroups.reduce(
        (sum: number, g: any) => sum + (Number(g.quantity) || 0),
        0
      )
    : Number(quantity) || 0;

  return (
    <div className='modal-merchi-checkout-job-info-content merchi-checkout-summary'>
      <div className='merchi-checkout-summary-section-title'>{product.name}</div>
      {hasGroups && (
        <div className='merchi-checkout-summary-groups'>
          {variationsGroups.map((g: any, i: number) =>
            g.quantity ? (
              <VariationGroupInfo
                group={g}
                key={`${i}-job-info-content`}
                index={i}
                product={product}
              />
            ) : null
          )}
        </div>
      )}
      {!hasGroups && (
        <div className='merchi-checkout-summary-standalone'>
          {jobLevelVariations.length > 0 && (
            <>
              <strong className='merchi-checkout-summary-order-detail-title'>
                Order Detail
              </strong>
              <VariationsInfo
                quantity={quantity}
                variations={variations}
                product={product}
              />
            </>
          )}
        </div>
      )}
      {hasGroups && jobLevelVariations.length > 0 && (
        <div className='merchi-checkout-summary-standalone'>
          <strong className='merchi-checkout-summary-order-detail-title'>
            Order Detail
          </strong>
          <VariationsInfo
            quantity={quantity}
            variations={variations}
            product={product}
          />
        </div>
      )}
      {!isResell && (
        <div className='merchi-checkout-summary-total'>
          {totalQuantity > 0 && (
            <SummaryAmountRow
              className='merchi-checkout-summary-total-quantity'
              label='Total Quantity'
              amount={totalQuantity}
            />
          )}
          <SummaryAmountRow
            label='Total Order Cost'
            labelExtra={
              needsShipping ? (
                <small className='merchi-checkout-summary-total-note'> ex Shipment</small>
              ) : undefined
            }
            amount={totalCost}
          />
        </div>
      )}
      {!!(isResell && !hasGroups) && (
        <div>
          <strong className='mb-0'>
            {isResell ? 'Approximate Unit' : 'Total'} Cost
          </strong>{' '}
          <strong className='mb-0 d-block'>{totalCost}</strong>
        </div>
      )}
    </div>
  );
}
