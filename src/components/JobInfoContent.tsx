'use client';
import { formatCurrency, currencyTotalCostShowIncTax } from './currency';
import {
  isInstructionsType,
  isProductSupplierMOD,
  isSelectable,
} from '../utils';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

function formatCost(product: any, cost: number) {
  const currency = product.currency ? product.currency : 'AUD';
  return formatCurrency(cost, {
    currency,
    showCodeIfNoSymbol: false,
  });
}

function ProductCostRow({ job }: any) {
  const quantity = job ? job.quantity : 0;
  return <p className='d-block mt-4 mb-0'>Total Quantity: {quantity}</p>;
}

function VariationInfoBody({ cost, name, product, value, files, type }: any) {
  return (
    <div>
      <small className='mb-1'>{name}</small>
      <div className='mb-0'>
        <div className='d-flex' style={{ gap: '0.5rem' }}>
          {files &&
            files.map((file: any) => (
              <img
                key={file.viewUrl}
                className='modal_merchi-checkout-job-info-content-img'
                src={file.viewUrl}
                alt={file.name}
              />
            ))}
        </div>
        {type === 10 && (
          <div
            style={{ backgroundColor: `${value}` }}
            className='color-indicator'
          />
        )}
        {value && value} {cost ? `+ ${formatCost(product, cost)}` : ''}
        {files.length == 0 && !value && '-'}
      </div>
    </div>
  );
}

function VariationOptionsInfoBody({
  name,
  selectedOptions,
  sellerProductEditable,
  product,
}: any) {
  const firstOption = selectedOptions[0];
  return (
    <>
      {selectedOptions.length > 1 ? (
        <div>
          <small className='mb-1'>{name}</small>
          <ul className='list-unstyled m-0 m-b-5'>
            {selectedOptions.map((o: any, i: number) => (
              <li key={`${i}-option-key-${o.optionId}`}>
                {o.value}{' '}
                {Boolean(o.totalCost && !sellerProductEditable)
                  ? ` + ${formatCost(product, o.totalCost)}`
                  : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : firstOption ? (
        <div>
          <small className='mb-1'>{name}</small>
          <p className='mb-0'>
            {firstOption.value}
            {Boolean(firstOption.totalCost)
              ? ` + ${formatCost(product, firstOption.totalCost)}`
              : ''}
          </p>
        </div>
      ) : (
        <div>
          <small className='mb-1'>{name}</small>
          <p className='mb-0'>-</p>
        </div>
      )}
    </>
  );
}

function VariationInfo({ product, variation }: any) {
  const { selectedOptions, variationField, variationFiles } = variation;
  const { fieldType, sellerProductEditable } = variationField;
  const isVariationSelectable = isSelectable(fieldType);
  const options = selectedOptions;
  return (
    <div>
      {isVariationSelectable && options ? (
        <>
          <VariationOptionsInfoBody
            name={variationField.name}
            type={variationField.fieldType}
            value={variation.value}
            product={product}
            files={variationFiles}
            selectedOptions={options}
            sellerProductEditable={sellerProductEditable}
          />
        </>
      ) : (
        <>
          <VariationInfoBody
            name={variationField.name}
            type={variationField.fieldType}
            value={variation.value}
            files={variationFiles}
            product={product}
            cost={sellerProductEditable ? 0 : variation.cost}
          />
        </>
      )}
    </div>
  );
}

function VariationsInfo({ product, quantity, variations = [] }: any) {
  return (
    <div className='d-flex flex-column' style={{ gap: '1rem' }}>
      {variations.map((v: any, i: number) =>
        !isInstructionsType(v.variationField.fieldType) ? (
          <VariationInfo
            quantity={quantity}
            variation={v}
            product={product}
            key={i}
          />
        ) : (
          ''
        )
      )}
    </div>
  );
}

function VariationGroupInfo({ group, index, product, groupArrayLength }: any) {
  const isResell = isProductSupplierMOD(product);
  const { quantity, variations } = group;
  return (
    <div className={`quote-summary-card ${groupArrayLength === 1 && ' w-100'}`}>
      <div className='mt-2 d-flex flex-column justify-content-between text-left h-100'>
        <div>
          <small className='text-muted'>Group {index + 1}</small>
          <small className='text-muted'>
            {!isResell && ` | Quantity: ${quantity}`}
          </small>
        </div>
        <div className='pt-2'>
          {!!(variations && variations.length) && (
            <div>
              <strong>Group {index + 1} Detail</strong>
            </div>
          )}
          <VariationsInfo
            quantity={quantity}
            variations={variations}
            product={product}
          />
        </div>
        <div className='pt-3'>
          <div
            className='pt-1'
            style={{
              borderTop: '1px solid #d7d7d7',
              height: '24px',
            }}
          >
            <strong className='mb-0 float-left float-start'>
              {isResell ? 'Unit' : `Group`} Cost
            </strong>
            <strong className='mb-0 ml-2 float-right float-end'>
              {formatCost(product, group.groupCost)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobInfoContent() {
  const { job } = useMerchiCheckboutContext();
  const { product, quantity = 0, variations = [], variationsGroups = [] } = job;
  const { needsShipping } = product;
  const totalCost = currencyTotalCostShowIncTax(job);
  const isResell = isProductSupplierMOD(product);
  const hasGroups = variationsGroups.length > 0;
  return (
    <div className='modal_merchi-checkout-job-info-content'>
      <strong>{product.name}</strong>
      {variationsGroups.length > 0 && (
        <div
          className='d-flex flex-wrap justify-content-between'
          style={{ gap: 30 }}
        >
          {variationsGroups.map((g: any, i: number) =>
            g.quantity ? (
              <div className='w-100' key={i + 'jonb-info-content'}>
                <VariationGroupInfo
                  groupArrayLength={variationsGroups.length}
                  group={g}
                  key={i}
                  index={i}
                  job={job}
                  product={product}
                />
              </div>
            ) : (
              ''
            )
          )}
        </div>
      )}
      <div className='d-flex justify-content-center parent-variation-card'>
        <div className='text-left mt-1 w-100'>
          <ProductCostRow job={job} product={product} quantity={quantity} />
          <div>
            {!!(variations && variations.length) && (
              <strong className='mb-0'>Order Detail</strong>
            )}
            <VariationsInfo
              quantity={quantity}
              variations={variations}
              product={product}
            />
          </div>
          {!isResell && (
            <div className='pt-2 mt-3 total-order-cost-container'>
              <small className='mb-0'>Total Order Cost</small>
              {needsShipping && (
                <small className='mb-0 ml-1 font-italic'>ex Shipment</small>
              )}
              <strong className='mb-0 d-block'>{totalCost}</strong>
            </div>
          )}
        </div>
      </div>
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
