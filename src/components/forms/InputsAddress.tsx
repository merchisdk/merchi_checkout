'use client';
import { useEffect, useRef } from 'react';
import Geosuggest from 'react-geosuggest';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Controller } from 'react-hook-form';
import InputText from './InputText';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { addressInOneLine, geoSuggestResultAsNewAddress } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Collapse from '../Collapse';

interface Props {
  defaultAddress?: any;
  labelGeoSuggest?: string;
  hookForm: any;
  name: string;
  placeholder?: string;
  updateAddress: (address: any) => void;
}

export function InputsAddress({
  defaultAddress = {},
  labelGeoSuggest = 'Address',
  hookForm,
  name,
  placeholder = 'Search your address',
  updateAddress
}: Props) {
  const geosuggestEl = useRef(null);
  const {
    googlePlacesLoaded,
    classNameMerchiCheckoutFormGroup,
    classNameMerchiCheckoutFormInput,
    classNameMerchiCheckoutRow,
    classNameMerchiCheckoutRowColumn,
    classNameMerchiCheckoutGoogleSuggestList,
    classNameMerchiCheckoutGoogleSuggestListItem,
  } = useMerchiCheckboutContext();

  const {
    control,
    formState: { errors, isValid, submitCount },
    setValue,
    getValues,
  } = hookForm;
  const inputName = (_name: string) => `${name ? `${name}.` : ''}${_name}`;
  function onSuggestSelect(suggest: any) {
    if (suggest) {
      updateAddress(geoSuggestResultAsNewAddress(suggest));
    } else {
      updateAddress({
        city: '',
        country: '',
        lineOne: '',
        lineTwo: '',
        postcode: '',
        state: '',
      });
    }
    (geosuggestEl as any).current.blur();
  }
  function onChangeCountryState() {
    const addr = getValues();
    updateAddress(addr[name]);
  }
  const [addressFieldsOpen, setAddressFieldsOpen] = useState(false);
  const toggleAddressFieldsOpen = () => setAddressFieldsOpen(!addressFieldsOpen);
  useEffect(() => {
    if (!isValid && !addressFieldsOpen && submitCount > 0) {
      toggleAddressFieldsOpen();
    }
  }, [isValid, submitCount]);
  const addressForm = (
    <>
      <InputText
        control={control}
        label="Address line one"
        name={inputName("lineOne")}
        placeholder="123 Fake st"
        rules={{ required: 'Address line one is required.' }}
      />
      <InputText
        control={control}
        label="Continue address"
        name={inputName("lineTwo")}
        placeholder="Continue address..."
      />
      <div className={classNameMerchiCheckoutRow}>
        <div className={classNameMerchiCheckoutRowColumn}>
          <InputText
            control={control}
            label="City / Province"
            name={inputName("city")}
            placeholder="City"
            rules={{ required: 'City / Province is required.' }}
          />
        </div>
        <div className={classNameMerchiCheckoutRowColumn}>
          <InputText
            control={control}
            label="Post / Zip code"
            name={inputName("postcode")}
            placeholder="90210"
          />
        </div>
      </div>
      <div className={classNameMerchiCheckoutRow}>
        <div className={classNameMerchiCheckoutRowColumn}>
          <div className={classNameMerchiCheckoutFormGroup}>
            <label>Country</label>
            <Controller
              name={inputName("country")}
              control={control}
              defaultValue={defaultAddress && defaultAddress.country}
              render={({ field }: any) => (
                <CountryDropdown
                  {...field}
                  // value={defaultAddress && defaultAddress.country}
                  classes={classNameMerchiCheckoutFormInput}
                  onChange={(val) => {
                    setValue(inputName("country"), val);
                    field.onChange(val);
                    onChangeCountryState();
                  }}
                  valueType='short'
                />
              )}
            />
          </div>
        </div>
        <div className={classNameMerchiCheckoutRowColumn}>
          <div className={classNameMerchiCheckoutFormGroup}>
            <label>State / Region</label>
            <Controller
              name={inputName("state")}
              control={control}
              defaultValue={defaultAddress && defaultAddress.state}
              render={({ field }: any) => (
                <RegionDropdown
                  {...field}
                  // value={defaultAddress && defaultAddress.state}
                  countryValueType="short"
                  country={getValues(inputName("country"))}
                  classes={classNameMerchiCheckoutFormInput}
                  onChange={(val) => {
                    setValue(inputName("state"), val);
                    field.onChange(val);
                    onChangeCountryState();
                  }}
                  valueType='short'
                />
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      {googlePlacesLoaded
        ? <>
            <div className={classNameMerchiCheckoutFormGroup}>
              <label>{labelGeoSuggest}</label>
              <Geosuggest
                ref={geosuggestEl}
                style={{input: {'::placeholder': {color: '#525f7f'}}}}
                initialValue={addressInOneLine(defaultAddress)}
                inputClassName={classNameMerchiCheckoutFormInput}
                onSuggestSelect={onSuggestSelect}
                placeholder={placeholder}
                suggestsClassName={classNameMerchiCheckoutGoogleSuggestList}
                suggestItemClassName={classNameMerchiCheckoutGoogleSuggestListItem}
                types={['establishment', 'geocode']}
              />
            </div>
            <Collapse isOpen={addressFieldsOpen}>
              {addressForm}
            </Collapse>
            <div className='d-flex align-items-center'>
              {!!errors.length &&
                <div className='text-danger'>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                  /> Invalid address!
                </div>
              }
              <a
                className={`ml-auto btn btn-sm btn-link ${!!errors.length && 'text-danger'}`}
                onClick={toggleAddressFieldsOpen}
              >
                <FontAwesomeIcon
                  icon={addressFieldsOpen ? faTimes : faEdit}
                /> {addressFieldsOpen ? 'Close' : 'Edit fields'}
              </a>
            </div>
          </>
        : addressForm
      } 
    </>
  );
}

export default InputsAddress;
