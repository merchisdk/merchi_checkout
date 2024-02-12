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
| `classNameMerchiCheckoutAlertsContainer`      | `string?`                        | `"d-flex justify-content-center flex-column alerts-container-sm"`           | `Class for the alerts container`   |
| `classNameMerchiCheckoutAlert`                | `string?`                        | `"alert alert-dismissible alert-notify"`                                    | `Class for the alert element`      |
| `classNameMerchiCheckoutAlertError`           | `string?`                        | `"alert-danger"`                                                            | `Class for the danger/error alert` |
| `classNameMerchiCheckoutAlertSuccess`         | `string?`                        | `"alert-success"`                                                           | `Class for the success alert`      |
| `classNameMerchiCheckoutButtonPrimary`        | `string?`                        | `"btn btn-md btn-primary d-flex align-items-center justify-content-center"` | `Class for the primary button`     |
| `classNameMerchiCheckoutButtonPrimaryBlock`   | `string?`                        | `"btn btn-lg btn-primary btn-block"`                                        | `Class for the primary block button`|
| `classNameMerchiCheckoutButtonSecondary`      | `string?`                        | `"btn btn-lg btn-secondary"`                                                | `Class for the secondary button`   |
| `classNameMerchiCheckoutButtonSecondaryBlock` | `string?`                        | `"btn btn-lg btn-secondary btn-block"`                                      | `Class for the secondary block button`|
| `classNameMerchiCheckoutButtonDownloadInvoice`| `string?`                        | `"btn btn-lg btn-primary"`                                                  | `Class for the download invoice button`|
| `classNameMerchiCheckoutFormCheckbox`         | `string?`                        | `"form-check-input"`                                                        | `Class for input checkbox or radio`|
| `classNameMerchiCheckoutFormGroup`            | `string?`                        | `"form-group"`                                                              | `Class for the form group: label, input, checkbox, radio...`|
| `classNameMerchiCheckoutFormGroupCheckbox`    | `string?`                        | `"form-check"`                                                              | `Class for the checkbox/radio container`|
| `classNameMerchiCheckoutFormInput`            | `string?`                        | `"form-control"`                                                            | `Class for input fields`           |
| `classNameMerchiCheckoutGoogleSuggestList`    | `string?`                        | `"list-group m-b-0"`                                                        | `Class for a list group`           |
| `classNameMerchiCheckoutGoogleSuggestListItem`| `string?`                        | `"list-group-item cursor-pointer"`                                          | `Class for the list item geo suggest`|
| `classNameMerchiCheckoutListGroupItemLoader`  | `string?`                        | `"list-group-item modal_merchi-checkout-shipment-option"`                   | `Class for the list item loader`   |
| `classNameMerchiCheckoutFormLabelCheckbox`    | `string?`                        | None                                                                        | `Class for the checkbox/radio label`|
| `classNameMerchiCheckoutInputError`           | `string?`                        | `"text-danger"`                                                             | `Class for the input error`        |
| `classNameMerchiCheckoutListGroup`            | `string?`                        | `"modal_merchi-checkout-shipment-option"`                                   | `Class for the checkout list group`|
| `classNameMerchiCheckoutListGroupItem`        | `string?`                        | `"list-group-item"`                                                         | `Class for the checkout list group item`|
| `classNameMerchiCheckoutRow`                  | `string?`                        | `"merchi-row"`                                                              | `Class for a row element`          |
| `classNameMerchiCheckoutRowColumn`            | `string?`                        | `"merchi-column"`                                                           | `Class for a column element`       |
| `classNameMerchiCheckoutTabsContainer`        | `string?`                        | `"merchi-checkout-tabs-container"`                                          | `Class for the tabs container`     |
| `classNameMerchiCheckoutTab`                  | `string?`                        | `"merchi-checkout-tab"`                                                     | `Class for the checkout tab element`|
| `classNameMerchiCheckoutTabPane`              | `string?`                        | `"tab-pane"`                                                                | `Class for the tab pane`           |
| `classNameMerchiCheckoutTabPaneButton`        | `string?`                        | `"btn merchi-checkout-tab-btn"`                                             | `Class for the tab pane button`    |
| `classNameMerchiCheckoutTabPaneContainer`     | `string?`                        | `"tab-content"`                                                             | `Class for the tab content`        |
| `classNameMerchiCheckoutTabButton`            | `string?`                        | `"btn merchi-checkout-tab-btn"`                                             | `Class for the merchi checkout tab button`|
| `classNameMerchiInvoiceButtonPayInvoice`      | `string?`                        | `"btn btn-lg btn-primary btn-block"`                                        | `Class for the invoice pay button` |
| `currentUser`                                 | `MerchiUserJson?`                | None                                                                        | `Merchi user entity`               |
| `googlePlacesApiKey`                          | `string?`                        | None                                                                        | `API key for Google places`        |
| `hideDrafting`                                | `boolean?`                       | `true`                                                                      | `Tells the checkout to hide the customisation tab`|
| `includeDomainSignup`                         | `boolean?`                       | `false`                                                                     | `Tells the checkout to hide the domain sign up tab `|
| `invoice`                                     | `MerchiInvoiceJson?`             | None                                                                        | `A Merchi invoice json object`     |
| `redirectAfterSuccessUrl`                     | `string?`                        | None                                                                        | `On checkout or job creation this url will be redirected to. Typically used for third party conversion tracking`|
| `redirectAfterQuoteSuccessUrl`                | `string?`                        | None                                                                        | `On checkout or job creation "quote request", this url will be redirected to. Typically used for third party conversion tracking`|
| `redirectWithValue`                           | `boolean?`                       | `true`                                                                      | `On redirect the value of the sale will be appended onto the "redirectAfterSuccessUrl" orredirectAfterQuoteSuccessUrl. For this to work correctly make sure you add "?" or "&" to the end of the redirect urls depending on if they already include query parameters or not.`|
| `isBuyRequest`                                | `boolean?`                       | None                                                                        | `Tells the checkout to dsiplay payment gateway` |
| `isOpen`                                      | `boolean?`                       | None                                                                        | `Used if the checkout is active`   |
| `isProductEmbedForm`                          | `boolean?`                       | `false`                                                                     | `Tells the checkout that it's a child of the Product emebd form` |
| `job`                                         | `MerchiJobJson?`                 | None                                                                        | `A Merchi job json object`         |
| `messageSuccessBuyRequest`                    | `string?`                        | None                                                                        | `A success message shown on completion of a buy request` |
| `messageSuccessQuoteRequest`                  | `string?`                        | None                                                                        | `A success message shown on completion of a quote request`|
| `product`                                     | `MerchiProductJson?`             | None                                                                        | `A Merchi product json object`     |
| `setInvoice`                                  | `(i: MerchiInvoiceJson) => void?`| None                                                                        | `A setter function for the Merchi invoice`|
| `setJob`                                      | `(j: MerchiJobJson) => void?`    | None                                                                        | `A setter function for the Merchi job`|
| `showUserTermsAndConditions`                  | `boolean?`                       | `true`                                                                      | `Show user terms and conditions`   |
| `toggleMerchiCheckout`                        | `() => void`                     | None                                                                        | `A toggle function whcih sets the "isOpen" prop`|
| `urlApi`                                      | `string?`                        | `'https://api.merchi.co/v6/'`                                               | `URL to connect to the Merchi API`|
| `urlFrontend`                                 | `string?`                        | `'https://merchi.co/'`                                                      | `URL to redirect users to a frontend`|
