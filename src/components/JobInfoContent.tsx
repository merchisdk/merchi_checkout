'use client';
import React, { useState } from 'react';
import { FaFilePdf, FaRegImage } from 'react-icons/fa';
import { formatCurrency, currencyTotalCostShowIncTax } from './currency';
import {
  isInstructionsType,
  isProductSupplierMOD,
  isSelectable,
  FieldType,
} from '../utils';
import {
  estimateAreaCosts,
  formatAreaSummary,
  localePrefersImperial,
} from '../area';
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

function parseCostAmount(value: any): number {
  const amount = parseFloat(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

/** Match product-form wording: "+ $X once off" / "+ $Y per unit". */
function formatOnceOffUnitCostDetail(
  product: any,
  onceOffCost: any,
  unitCost: any
) {
  const currency = product?.currency || 'AUD';
  const parts: string[] = [];
  const onceOff = parseCostAmount(onceOffCost);
  const unit = parseCostAmount(unitCost);
  if (onceOff) {
    parts.push(
      ` + ${formatCurrency(onceOff, { currency, showCodeIfNoSymbol: false })} once off`
    );
  }
  if (unit) {
    parts.push(
      ` + ${formatCurrency(unit, { currency, showCodeIfNoSymbol: false })} per unit`
    );
  }
  return parts.join('');
}

function optionOnceOff(option: any): number {
  return (
    parseCostAmount(option?.onceOffCost) ||
    parseCostAmount(option?.variationCost) ||
    0
  );
}

function optionUnit(option: any): number {
  return (
    parseCostAmount(option?.unitCost) ||
    parseCostAmount(option?.variationUnitCost) ||
    0
  );
}

/** Product setup fee shown next to unit price, matching product-form wording. */
function productSetupSuffix(product: any) {
  const setupPrice = Number(product?.setupPrice);
  if (!setupPrice) return '';
  const label = product.setupPerGroup ? 'setup per group' : 'setup';
  return ` + ${formatCost(product, setupPrice)} ${label}`;
}

function formatUnitPriceWithSetup(product: any) {
  return `${formatCost(product, Number(product?.unitPrice) || 0)}${productSetupSuffix(product)}`;
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

function absolutizeFileUrl(raw: string, urlApi?: string) {
  const url = (raw || '').trim();
  if (!url || url === 'undefined' || url === 'null') return '';
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  if (!urlApi) return url;
  try {
    const base = new URL(urlApi);
    return new URL(url, `${base.origin}/`).href;
  } catch {
    return url;
  }
}

function resolveFileUrl(file: any, urlApi?: string) {
  return absolutizeFileUrl(
    file?.viewUrl || file?.downloadUrl || '',
    urlApi
  );
}

function optionImageUrl(option: any, urlApi?: string) {
  return absolutizeFileUrl(
    option?.linkedFile?.viewUrl || option?.linkedFile?.downloadUrl || '',
    urlApi
  );
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
  fieldOptions: any[] = [],
  urlApi?: string
) {
  const direct = optionImageUrl(option, urlApi);
  if (direct) return direct;
  const fromSelectable = optionImageUrl(
    findMatchingOption(option, selectableOptions),
    urlApi
  );
  if (fromSelectable) return fromSelectable;
  return optionImageUrl(findMatchingOption(option, fieldOptions), urlApi);
}

function formatOptionCost(
  product: any,
  option: any,
  sellerProductEditable: boolean
) {
  if (sellerProductEditable || !option) return null;
  const onceOffUnit = formatOnceOffUnitCostDetail(
    product,
    optionOnceOff(option),
    optionUnit(option)
  );
  if (onceOffUnit) return onceOffUnit;
  if (option.totalCost) {
    return ` + ${formatCost(product, option.totalCost)}`;
  }
  return null;
}

function variationCostDetail(
  product: any,
  variation: any,
  sellerProductEditable: boolean,
  {
    includeSelectedOptionCosts = true,
    fieldCostsOnly = false,
  }: {
    includeSelectedOptionCosts?: boolean;
    fieldCostsOnly?: boolean;
  } = {}
) {
  if (sellerProductEditable) return '';

  const field = variation?.variationField || {};
  const fieldType = Number(field.fieldType);

  if (fieldType === FieldType.AREA) {
    const areaCosts = estimateAreaCosts(field, variation?.value);
    if (areaCosts) {
      return formatOnceOffUnitCostDetail(
        product,
        areaCosts.onceOffCost,
        areaCosts.unitCost
      );
    }
  }

  if (fieldCostsOnly) {
    return formatOnceOffUnitCostDetail(
      product,
      field.variationCost,
      field.variationUnitCost
    );
  }

  const selected = Array.isArray(variation?.selectedOptions)
    ? variation.selectedOptions
    : [];
  if (includeSelectedOptionCosts && selected.length) {
    const fieldOnce =
      fieldType === FieldType.COLOUR_EXTRACT
        ? parseCostAmount(field.variationCost)
        : 0;
    const fieldUnit =
      fieldType === FieldType.COLOUR_EXTRACT
        ? parseCostAmount(field.variationUnitCost)
        : 0;
    return formatOnceOffUnitCostDetail(
      product,
      fieldOnce +
        selected.reduce(
          (sum: number, option: any) => sum + optionOnceOff(option),
          0
        ),
      fieldUnit +
        selected.reduce(
          (sum: number, option: any) => sum + optionUnit(option),
          0
        )
    );
  }

  const onceOffUnit = formatOnceOffUnitCostDetail(
    product,
    variation?.onceOffCost ?? field.variationCost,
    variation?.unitCost ?? field.variationUnitCost
  );
  if (onceOffUnit) return onceOffUnit;
  if (variation?.cost) {
    return ` + ${formatCost(product, variation.cost)}`;
  }
  return '';
}

function VariationFilePreview({
  file,
  urlApi,
}: {
  file: any;
  urlApi?: string;
}) {
  const fileUrl = resolveFileUrl(file, urlApi);
  const fileName = file?.name || 'File';
  const [imageFailed, setImageFailed] = useState(false);

  if (isPdf(file)) {
    return (
      <a
        className='merchi-checkout-summary-file-link'
        href={fileUrl || undefined}
        target='_blank'
        rel='noopener noreferrer'
        title={fileName}
      >
        <FaFilePdf aria-hidden />
        <span>{fileName}</span>
      </a>
    );
  }

  if (isImageFile(file) && fileUrl && !imageFailed) {
    return (
      <img
        className='modal-merchi-checkout-job-info-content-img'
        src={fileUrl}
        alt={fileName}
        title={fileName}
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (isImageFile(file)) {
    return (
      <span
        className='merchi-checkout-summary-file-fallback'
        title={fileName}
      >
        <FaRegImage aria-hidden />
        <span>{fileName}</span>
      </span>
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

function VariationInfoBody({
  costDetail,
  name,
  product,
  value,
  files,
  type,
  urlApi,
}: any) {
  const isColourPicker = type === FieldType.COLOUR_PICKER;
  const isFileUpload =
    type === FieldType.FILE_UPLOAD || type === FieldType.COLOUR_EXTRACT;
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
                urlApi={urlApi}
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
        {costDetail || ''}
        {!hasFiles && !value && !costDetail && '-'}
      </div>
    </div>
  );
}

function VariationInfo({ product, variation }: any) {
  const { urlApi } = useMerchiCheckboutContext();
  const { variationField, variationFiles, selectableOptions } = variation;
  const { fieldType, sellerProductEditable, options: fieldOptions = [] } =
    variationField;
  const isVariationSelectable = isSelectable(fieldType);
  const isTurnaroundTime = fieldType === FieldType.TURNAROUND_TIME;
  const isColourExtract = fieldType === FieldType.COLOUR_EXTRACT;
  const options = resolveSelectableSelectedOptions(
    variation,
    selectableOptions,
    fieldOptions
  );
  const useSelectableDisplay =
    isVariationSelectable &&
    (Boolean(options?.length) || (isTurnaroundTime && variation.value));
  return (
    <div className='merchi-checkout-summary-variation'>
      {isColourExtract ? (
        <>
          <VariationInfoBody
            name={variationField.name}
            type={fieldType}
            value={null}
            files={variationFiles}
            product={product}
            urlApi={urlApi}
            costDetail={variationCostDetail(
              product,
              variation,
              sellerProductEditable,
              // Options list shows each colour cost; keep field base cost here.
              options?.length
                ? { fieldCostsOnly: true }
                : { includeSelectedOptionCosts: false }
            )}
          />
          {options?.length ? (
            <VariationOptionsInfoBody
              name={`${variationField.name} colours`}
              fieldType={fieldType}
              value={variation.value}
              product={product}
              selectedOptions={options}
              variation={variation}
              selectableOptions={selectableOptions}
              fieldOptions={fieldOptions}
              sellerProductEditable={sellerProductEditable}
            />
          ) : null}
        </>
      ) : useSelectableDisplay ? (
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
          value={
            fieldType === FieldType.AREA && variation.value
              ? formatAreaSummary(
                  variation.value,
                  localePrefersImperial() ? 'imperial' : 'metric',
                  variationField.areaUnit || 'mm'
                ) || variation.value
              : variation.value
          }
          files={variationFiles}
          product={product}
          urlApi={urlApi}
          costDetail={variationCostDetail(
            product,
            variation,
            sellerProductEditable,
            { includeSelectedOptionCosts: false }
          )}
        />
      )}
    </div>
  );
}

function ColourSelectOption({
  option,
  selectableOptions,
  fieldOptions,
  product,
  sellerProductEditable,
}: {
  option: any;
  selectableOptions?: any[];
  fieldOptions?: any[];
  product?: any;
  sellerProductEditable?: boolean;
}) {
  const label = option?.value?.trim() || '';
  const hex = resolveOptionColour(option, selectableOptions, fieldOptions);
  const cost = formatOptionCost(
    product,
    option,
    Boolean(sellerProductEditable)
  );
  return (
    <span className='merchi-checkout-summary-colour-option'>
      {hex && (
        <span
          style={{ backgroundColor: hex }}
          className='color-indicator'
        />
      )}
      <span>
        {label || hex || '–'}
        {cost || ''}
      </span>
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
  const { urlApi } = useMerchiCheckboutContext();
  const imageUrl = resolveOptionImageUrl(
    option,
    selectableOptions,
    fieldOptions,
    urlApi
  );
  const label = option?.value?.trim() || '';
  const cost = formatOptionCost(product, option, sellerProductEditable);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className='merchi-checkout-summary-image-select-option'>
      {imageUrl && !imageFailed ? (
        <img
          className='modal-merchi-checkout-job-info-content-img'
          src={imageUrl}
          alt={label || 'Selected option'}
          title={label || undefined}
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <span>
        {label || '–'}
        {cost || ''}
      </span>
    </span>
  );
}

function getOptionId(option: any) {
  return option?.optionId ?? option?.id;
}

function splitSelectedOptionIds(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (value == null || value === '') return [];
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveSelectableSelectedOptions(
  variation: any,
  selectableOptions: any[] = [],
  fieldOptions: any[] = []
): any[] {
  const fieldType = variation?.variationField?.fieldType;
  if (fieldType === FieldType.COLOUR_EXTRACT) {
    return variation?.selectedOptions || [];
  }

  const selectedIds = splitSelectedOptionIds(variation?.value);
  if (selectedIds.length > 0) {
    const pools = [selectableOptions, fieldOptions];
    const resolved: any[] = [];
    for (const id of selectedIds) {
      for (const pool of pools) {
        const match = pool.find((option: any) => String(getOptionId(option)) === id);
        if (match) {
          resolved.push(match);
          break;
        }
      }
    }
    if (resolved.length > 0) {
      return resolved;
    }
  }

  return variation?.selectedOptions || [];
}

function resolveTurnaroundSelectedOption(
  variation: any,
  selectableOptions: any[] = [],
  fieldOptions: any[] = []
) {
  const resolved = resolveSelectableSelectedOptions(
    variation,
    selectableOptions,
    fieldOptions
  );
  if (resolved.length > 0) {
    return resolved[0];
  }

  const valueStr =
    variation?.value != null && variation?.value !== ''
      ? String(variation.value).trim()
      : '';
  if (!valueStr) return null;

  const pools = [selectableOptions, fieldOptions];
  for (const pool of pools) {
    const byValue = pool.find(
      (option: any) => String(option.value ?? '') === valueStr
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
  const isColourSelect =
    fieldType === FieldType.COLOUR_SELECT ||
    fieldType === FieldType.COLOUR_EXTRACT;
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
          product={product}
          sellerProductEditable={sellerProductEditable}
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

function VariationGroupInfo({
  group,
  index,
  product,
  showSetupOnUnitPrice,
}: any) {
  const isResell = isProductSupplierMOD(product);
  const { quantity, variations } = group;
  const visibleVariations = (variations ?? []).filter(
    (v: any) => !isInstructionsType(v?.variationField?.fieldType)
  );
  const costLabel = isResell ? 'Unit Cost' : 'Group Cost';
  const unitPriceValue = showSetupOnUnitPrice
    ? formatUnitPriceWithSetup(product)
    : formatCost(product, Number(product?.unitPrice) || 0);

  return (
    <section className='merchi-checkout-summary-group'>
      <strong className='merchi-checkout-summary-order-detail-title'>
        Group {index + 1} Information
      </strong>
      {!isResell && quantity > 0 && (
        <SummaryFieldRow label='Quantity' value={quantity} />
      )}
      <SummaryFieldRow label='Unit Price' value={unitPriceValue} />
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
  const setupPerGroup = Boolean(product?.setupPerGroup);
  const hasSetupPrice = Number(product?.setupPrice) > 0;

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
                showSetupOnUnitPrice={setupPerGroup}
              />
            ) : null
          )}
        </div>
      )}
      {!hasGroups && (
        <div className='merchi-checkout-summary-standalone'>
          <strong className='merchi-checkout-summary-order-detail-title'>
            Order Information
          </strong>
          {quantity > 0 && (
            <SummaryFieldRow label='Quantity' value={quantity} />
          )}
          <SummaryFieldRow
            label='Unit Price'
            value={formatUnitPriceWithSetup(product)}
          />
          {jobLevelVariations.length > 0 && (
            <VariationsInfo
              quantity={quantity}
              variations={variations}
              product={product}
            />
          )}
        </div>
      )}
      {hasGroups && jobLevelVariations.length > 0 && (
        <div className='merchi-checkout-summary-standalone'>
          <strong className='merchi-checkout-summary-order-detail-title'>
            Order Information
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
          {hasGroups && hasSetupPrice && !setupPerGroup && (
            <SummaryAmountRow
              label='Setup'
              amount={formatCost(product, Number(product.setupPrice))}
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
