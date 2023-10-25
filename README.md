# merchi_checkout
Merchi's custom checkout step form


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

## Installation

```bash
npm install merchi_checkout

or

yarn add merchi_checkout
```

### Props

| Name                                          | Type                             | Default                                                                     | Description                        |
|-----------------------------------------------|----------------------------------|-----------------------------------------------------------------------------|------------------------------------|
| `classNameMerchiCheckoutAlertsContainer`      | `string?`                        | `"d-flex justify-content-center flex-column alerts-container-sm"`           |                                    |
| `classNameMerchiCheckoutAlert`                | `string?`                        | `"alert alert-dismissible alert-notify"`                                    |                                    |
| `classNameMerchiCheckoutAlertError`           | `string?`                        | `"alert-danger"`                                                            |                                    |
| `classNameMerchiCheckoutAlertSuccess`         | `string?`                        | `"alert-success"`                                                           |                                    |
| `classNameMerchiCheckoutButtonPrimary`        | `string?`                        | `"btn btn-lmd btn-primary d-flex align-items-center justify-content-center"`|                                    |
| `classNameMerchiCheckoutButtonPrimaryBlock`   | `string?`                        | `"btn btn-lg btn-primary btn-block"`                                        |                                    |
| `classNameMerchiCheckoutButtonPrimary`        | `string?`                        | `"btn btn-lmd btn-primary d-flex align-items-center justify-content-center"`|                                    |
| `classNameMerchiCheckoutButtonSecondary`      | `string?`                        | `"btn btn-lg btn-secondary"`                                                |                                    |
| `classNameMerchiCheckoutButtonSecondaryBlock` | `string?`                        | `"btn btn-lg btn-secondary btn-block"`                                      |                                    |
| `classNameMerchiCheckoutButtonDownloadInvoice`| `string?`                        | `"btn btn-lg btn-primary"`                                                  |                                    |
| `classNameMerchiCheckoutFormCheckbox`         | `string?`                        | `"form-check-input"`                                                        |                                    |
| `classNameMerchiCheckoutFormGroup`            | `string?`                        | `"form-group"`                                                              |                                    |
| `classNameMerchiCheckoutFormGroupCheckbox`    | `string?`                        | `"form-check"`                                                              |                                    |
| `classNameMerchiCheckoutFormInput`            | `string?`                        | `"form-control"`                                                            |                                    |
| `classNameMerchiCheckoutGoogleSuggestList`    | `string?`                        | `"list-group m-b-0"`                                                        |                                    |
| `classNameMerchiCheckoutGoogleSuggestListItem`| `string?`                        | `"list-group-item cursor-pointer"`                                          |                                    |
| `classNameMerchiCheckoutListGroupItemLoader`  | `string?`                        | `"list-group-item modal_merchi-checkout-shipment-option"`                   |                                    |
| `classNameMerchiCheckoutFormLabelCheckbox`    | `string?`                        | None                                                                        |                                    |
| `classNameMerchiCheckoutInputError`           | `string?`                        | `"text-danger"`                                                             |                                    |
| `classNameMerchiCheckoutListGroup`            | `string?`                        | `"modal_merchi-checkout-shipment-option"`                                   |                                    |
| `classNameMerchiCheckoutListGroupItem`        | `string?`                        | `"list-group-item"`                                                         |                                    |
| `classNameMerchiCheckoutRow`                  | `string?`                        | `"merchi-row"`                                                              |                                    |
| `classNameMerchiCheckoutRowColumn`            | `string?`                        | `"merchi-column"`                                                           |                                    |
| `classNameMerchiCheckoutTabsContainer`        | `string?`                        | `"merchi-checkout-tabs-container"`                                          |                                    |
| `classNameMerchiCheckoutTab`                  | `string?`                        | `"merchi-checkout-tab"`                                                     |                                    |
| `classNameMerchiCheckoutTabPane`              | `string?`                        | `"tab-pane"`                                                                |                                    |
| `classNameMerchiCheckoutTabPaneButton`        | `string?`                        | `"btn merchi-checkout-tab-btn"`                                             |                                    |
| `classNameMerchiCheckoutTabPaneContainer`     | `string?`                        | `"tab-content"`                                                             |                                    |
| `classNameMerchiCheckoutTabButton`            | `string?`                        | `"btn merchi-checkout-tab-btn"`                                             |                                    |
| `classNameMerchiInvoiceButtonPayInvoice`      | `string?`                        | `"btn btn-lg btn-primary btn-block"`                                        |                                    |
| `currentUser`                                 | `MerchiUserJson?`                | None                                                                        |                                    |
| `googlePlacesApiKey`                          | `string?`                        | None                                                                        |                                    |
| `hideDrafting`                                | `boolean?`                       | `true`                                                                      |                                    |
| `includeDomainSignup`                         | `boolean?`                       | `false`                                                                     |                                    |
| `invoice`                                     | `MerchiInvoiceJson?`             | None                                                                        |                                    |
| `isBuyRequest`                                | `boolean?`                       | None                                                                        |                                    |
| `isOpen`                                      | `boolean?`                       | None                                                                        |                                    |
| `isProductEmbedForm`                          | `boolean?`                       | `false`                                                                     |                                    |
| `job`                                         | `MerchiJobJson?`                 | None                                                                        |                                    |
| `messageSuccessBuyRequest`                    | `string?`                        | None                                                                        |                                    |
| `messageSuccessQuoteRequest`                  | `string?`                        | None                                                                        |                                    |
| `product`                                     | `MerchiProductJson?`             | None                                                                        |                                    |
| `setInvoice`                                  | `(i: MerchiInvoiceJson) => void?`| None                                                                        |                                    |
| `setJob`                                      | `(j: MerchiJobJson) => void?`    | None                                                                        |                                    |
| `showUserTermsAndConditions`                  | `boolean?`                       | `true`                                                                      |                                    |
| `toggleMerchiCheckout`                        | `() => void`                     | None                                                                        |                                    |
