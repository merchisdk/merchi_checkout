'use client';
import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
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

function isPdf(file: any) {
  const mimetype = file?.mimetype || '';
  return mimetype === 'application/pdf' || mimetype === 'application/x-pdf';
}

function isImageFile(file: any) {
  const mimetype = file?.mimetype || '';
  if (mimetype.startsWith('image/')) return true;
  const name = (file?.name || '').toLowerCase();
  return /\.(jpe?g|png|gif|webp|svg|bmp)$/.test(name);
}

function optionImageUrl(option: any) {
  return option?.linkedFile?.viewUrl || '';
}

function findMatchingOption(option: any, options: any[] = []) {
  return options.find((o) => String(o.optionId) === String(option?.optionId));
}

function resolveOptionColour(
  option: any,
  selectableOptions: any[] = [],
  fieldOptions: any[] = []
) {
  const direct = option?.colour?.trim();
  if (direct) return direct;
  const fromSelectable = findMatchingOption(option, selectableOptions)?.colour?.trim();
  if (fromSelectable) return fromSelectable;
  return findMatchingOption(option, fieldOptions)?.colour?.trim() || '';
}

function resolveOptionImageUrl(
  option: any,
  selectableOptions: any[] = [],
  fieldOptions: any[] = []
) {
  const direct = optionImageUrl(option);
  if (direct) return direct;
  const fromSelectable = optionImageUrl(
    findMatchingOption(option, selectableOptions)
  );
  if (fromSelectable) return fromSelectable;
  return optionImageUrl(findMatchingOption(option, fieldOptions));
}

function formatOptionCost(
  product: any,
  option: any,
  sellerProductEditable: boolean
) {
  if (!option?.totalCost || sellerProductEditable) return null;
  return ` + ${formatCost(product, option.totalCost)}`;
}

function VariationFilePreview({ file }: { file: any }) {
  const fileUrl = file?.viewUrl || file?.downloadUrl || '';
  const fileName = file?.name || 'File';

  if (isPdf(file)) {
    return (
      <a
        className='merchi-checkout-summary-file-link'
        href={fileUrl}
        target='_blank'
        rel='noopener noreferrer'
        title={fileName}
      >
        <FaFilePdf aria-hidden />
        <span>{fileName}</span>
      </a>
    );
  }

  if (isImageFile(file) && fileUrl) {
    return (
      <img
        className='modal-merchi-checkout-job-info-content-img'
        src={fileUrl}
        alt={fileName}
        title={fileName}
      />
    );
  }

  if (fileUrl) {
    return (
      <a
        className='merchi-checkout-summary-file-link'
        href={fileUrl}
        target='_blank'
        rel='noopener noreferrer'
        title={fileName}
      >
        {fileName}
      </a>
    );
  }

  return <span>{fileName}</span>;
}

function VariationInfoBody({ cost, name, product, value, files, type }: any) {
  const isColourPicker = type === FieldType.COLOUR_PICKER;
  const isFileUpload = type === FieldType.FILE_UPLOAD;
  const hasFiles = Boolean(files?.length);
  const displayValue = isColourPicker || (isFileUpload && hasFiles) ? null : value;

  return (
    <div className='merchi-checkout-summary-variation-row'>
      <div className='merchi-checkout-summary-variation-label'>{name}</div>
      <div className='merchi-checkout-summary-variation-value'>
        {hasFiles && (
          <div className='merchi-checkout-summary-file-previews'>
            {files.map((file: any, index: number) => (
              <VariationFilePreview
                key={file.viewUrl || file.id || `${name}-file-${index}`}
                file={file}
              />
            ))}
          </div>
        )}
        {isColourPicker && value && (
          <div className='merchi-checkout-summary-colour-value'>
            <span
              style={{ backgroundColor: value }}
              className='color-indicator'
            />
            <span>{value}</span>
          </div>
        )}
        {displayValue && displayValue}
        {cost ? ` + ${formatCost(product, cost)}` : ''}
        {!hasFiles && !value && '-'}
      </div>
    </div>
  );
}

function VariationInfo({ product, variation }: any) {
  const { selectedOptions, variationField, variationFiles, selectableOptions } =
    variation;
  const { fieldType, sellerProductEditable, options: fieldOptions = [] } =
    variationField;
  const isVariationSelectable = isSelectable(fieldType);
  const isTurnaroundTime = fieldType === FieldType.TURNAROUND_TIME;
  const options = selectedOptions;
  const useSelectableDisplay =
    isVariationSelectable &&
    (Boolean(options?.length) || (isTurnaroundTime && variation.value));
  return (
    <div className='merchi-checkout-summary-variation'>
      {useSelectableDisplay ? (
        <VariationOptionsInfoBody
          name={variationField.name}
          fieldType={fieldType}
          value={variation.value}
          product={product}
          files={variationFiles}
          selectedOptions={options}
          variation={variation}
          selectableOptions={selectableOptions}
          fieldOptions={fieldOptions}
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

function ColourSelectOption({
  option,
  selectableOptions,
  fieldOptions,
}: {
  option: any;
  selectableOptions?: any[];
  fieldOptions?: any[];
}) {
  const label = option?.value?.trim() || '';
  const hex = resolveOptionColour(option, selectableOptions, fieldOptions);
  return (
    <span className='merchi-checkout-summary-colour-option'>
      {hex && (
        <span
          style={{ backgroundColor: hex }}
          className='color-indicator'
        />
      )}
      <span>{label || hex || '–'}</span>
    </span>
  );
}

function ImageSelectOption({
  option,
  selectableOptions,
  fieldOptions,
  product,
  sellerProductEditable,
}: {
  option: any;
  selectableOptions?: any[];
  fieldOptions?: any[];
  product: any;
  sellerProductEditable: boolean;
}) {
  const imageUrl = resolveOptionImageUrl(option, selectableOptions, fieldOptions);
  const label = option?.value?.trim() || '';
  const cost = formatOptionCost(product, option, sellerProductEditable);

  return (
    <span className='merchi-checkout-summary-image-select-option'>
      {imageUrl ? (
        <img
          className='modal-merchi-checkout-job-info-content-img'
          src={imageUrl}
          alt={label || 'Selected option'}
          title={label || undefined}
        />
      ) : null}
      <span>{label || '–'}{cost || ''}</span>
    </span>
  );
}

function getOptionId(option: any) {
  return option?.optionId ?? option?.id;
}

function resolveTurnaroundSelectedOption(
  variation: any,
  selectableOptions: any[] = [],
  fieldOptions: any[] = []
) {
  const { selectedOptions = [], value } = variation;
  if (selectedOptions.length > 0) {
    return selectedOptions[0];
  }
  const valueStr = value != null && value !== '' ? String(value).trim() : '';
  if (!valueStr) return null;

  const pools = [selectableOptions, fieldOptions];
  for (const pool of pools) {
    const byId = pool.find(
      (o: any) => String(getOptionId(o)) === valueStr
    );
    if (byId) return byId;
    const byValue = pool.find(
      (o: any) => String(o.value ?? '') === valueStr
    );
    if (byValue) return byValue;
  }
  return null;
}

function formatTurnaroundDeadline(userDeadline: any) {
  if (!userDeadline) return null;
  const seconds = Number(userDeadline);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return new Date(seconds * 1000).toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function TurnaroundOptionLabel({
  option,
  variationField,
  product,
  sellerProductEditable,
}: {
  option: any;
  variationField: any;
  product: any;
  sellerProductEditable: boolean;
}) {
  const days = parseInt(String(option?.value ?? ''), 10) || 0;
  const deadline = formatTurnaroundDeadline(option?.userDeadline);
  const shippingTimeIncluded = Boolean(variationField?.shippingTimeIncluded);
  const deadlineLabel = shippingTimeIncluded ? 'Delivery by' : 'Produced by';
  const cost = formatOptionCost(product, option, sellerProductEditable);

  return (
    <span className='merchi-checkout-summary-turnaround-value'>
      <span className='merchi-checkout-summary-turnaround-days'>
        {days > 0
          ? `${days} business day${days !== 1 ? 's' : ''}`
          : (option?.value?.trim() || '–')}
      </span>
      {deadline && (
        <span className='merchi-checkout-summary-turnaround-deadline'>
          {deadlineLabel} {deadline}
        </span>
      )}
      {cost || ''}
    </span>
  );
}

function VariationOptionsInfoBody({
  name,
  selectedOptions,
  sellerProductEditable,
  product,
  fieldType,
  variation,
  selectableOptions = [],
  fieldOptions = [],
}: any) {
  const isTurnaroundTime = fieldType === FieldType.TURNAROUND_TIME;
  const firstOption = isTurnaroundTime
    ? resolveTurnaroundSelectedOption(
        { selectedOptions, value: variation?.value },
        selectableOptions,
        fieldOptions
      )
    : selectedOptions[0];
  const isColourSelect = fieldType === FieldType.COLOUR_SELECT;
  const isImageSelect = fieldType === FieldType.IMAGE_SELECT;
  const variationField = variation?.variationField ?? {};

  function renderOptionLabel(o: any) {
    if (isTurnaroundTime) {
      return (
        <TurnaroundOptionLabel
          option={o}
          variationField={variationField}
          product={product}
          sellerProductEditable={sellerProductEditable}
        />
      );
    }
    if (isColourSelect) {
      return (
        <ColourSelectOption
          option={o}
          selectableOptions={selectableOptions}
          fieldOptions={fieldOptions}
        />
      );
    }
    if (isImageSelect) {
      return (
        <ImageSelectOption
          option={o}
          selectableOptions={selectableOptions}
          fieldOptions={fieldOptions}
          product={product}
          sellerProductEditable={sellerProductEditable}
        />
      );
    }
    return (
      <>
        {o.value?.trim() || '–'}
        {formatOptionCost(product, o, sellerProductEditable) || ''}
      </>
    );
  }

  return (
    <>
      {selectedOptions.length > 1 && !isTurnaroundTime ? (
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
