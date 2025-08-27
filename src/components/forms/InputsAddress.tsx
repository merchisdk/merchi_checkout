'use client';
import React from 'react';
import { useEffect } from 'react';
import { debounce } from 'lodash';
import { Merchi } from 'merchi_sdk_ts';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Controller } from 'react-hook-form';
import InputText from './InputText';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { addressInOneLine, googlePlacesResultAsNewAddress } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes, faEdit, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Collapse from '../Collapse';

const merchi = new Merchi();

interface Suggestion {
  placeId: string;
  description: string;
  structuredFormatting: any;
  types: string[];
  matchedSubstrings: any[];
}

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
  const {
    classNameMerchiCheckoutFormGroup,
    classNameMerchiCheckoutFormInput,
    classNameMerchiCheckoutFormSelect,
    classNameMerchiCheckoutRow,
    classNameMerchiCheckoutRowColumn,
    classNameMerchiCheckoutGoogleSuggestList,
    classNameMerchiCheckoutGoogleSuggestListItem,
  } = useMerchiCheckboutContext();

  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [addressLocal, setAddressLocal] = React.useState({...defaultAddress});

  const inputRef = React.useRef<HTMLInputElement>(null);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  const {
    control,
    formState: { errors, isValid, submitCount },
    setValue,
    getValues,
  } = hookForm;
  const inputName = (_name: string) => `${name ? `${name}.` : ''}${_name}`;

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
  // Initialize input value from address
  React.useEffect(() => {
    if (addressLocal) {
      setInputValue(addressInOneLine(addressLocal));
    }
  }, [addressLocal]);

  async function searchAddresses(query: string) {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await merchi.authenticatedFetch('/addresses/place-search/', {
        method: 'GET',
        query: [['q', query]]
      });

      if (response.status === 'success') {
        setSuggestions(response.results || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  }

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce(searchAddresses, 500),
    []
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    debouncedSearch(value);
  }

  async function handleSuggestionSelect(suggestion: Suggestion) {
    setLoading(true);
    try {
      // Fetch detailed place information using the place ID
      const response = await merchi.authenticatedFetch('/addresses/place-details/', {
        method: 'GET',
        query: [['place_id', suggestion.placeId]]
      });

      if (response.status === 'success') {
        // Parse the Google Places result into address components
        const parsedAddress = googlePlacesResultAsNewAddress(response.result);
        
        if (parsedAddress) {
          setInputValue(addressInOneLine(parsedAddress));
          updateAddress(parsedAddress);
          setAddressLocal(parsedAddress);
        } else {
          // Fallback to using the description if parsing fails
          const fallbackAddress = {
            city: '',
            country: '',
            lineOne: suggestion.description,
            lineTwo: '',
            postcode: '',
            state: '',
          };
          setInputValue(suggestion.description);
          updateAddress(fallbackAddress);
          setAddressLocal(fallbackAddress);
        }
      } else {
        // Fallback to using the description if API call fails
        const fallbackAddress = {
          city: '',
          country: '',
          lineOne: suggestion.description,
          lineTwo: '',
          postcode: '',
          state: '',
        };
        setInputValue(suggestion.description);
        updateAddress(fallbackAddress);
        setAddressLocal(fallbackAddress);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      // Fallback to using the description if there's an error
      const fallbackAddress = {
        city: '',
        country: '',
        lineOne: suggestion.description,
        lineTwo: '',
        postcode: '',
        state: '',
      };
      setInputValue(suggestion.description);
      updateAddress(fallbackAddress);
      setAddressLocal(fallbackAddress);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }

  function handleInputBlur(event: React.FocusEvent<HTMLInputElement>) {
    // Delay hiding suggestions to allow click events on suggestions
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 200);
  }

  function handleInputFocus() {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }

  function clearInput(e: any) {
    e.preventDefault();
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    updateAddress({
      city: '',
      country: '',
      lineOne: '',
      lineTwo: '',
      postcode: '',
      state: '',
    });
  }

  const hasErrors = !!Object.keys(errors).length;

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
                  classes={classNameMerchiCheckoutFormSelect}
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
                  classes={classNameMerchiCheckoutFormSelect}
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
      <div className={classNameMerchiCheckoutFormGroup}>
        <label>{labelGeoSuggest}</label>
        <div className="position-relative" style={{position: 'relative'}}>
          <input
            autoComplete='new-password'
            ref={inputRef}
            type="text"
            name='address-suggestion'
            className={classNameMerchiCheckoutFormInput}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            style={{ paddingRight: loading ? '40px' : '20px' }}
          />
          {loading && (
            <div
              className="position-absolute"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )}
          {inputValue && !loading && (
            <button
              type="button"
              className="btn btn-sm position-absolute"
              style={{ 
                right: '5px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                padding: '2px 5px',
                position: 'absolute',
              }}
              onClick={clearInput}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className={classNameMerchiCheckoutGoogleSuggestList}
            style={{ 
              zIndex: 1000, 
              top: '100%',
              overflowY: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.placeId}
                className={`${classNameMerchiCheckoutGoogleSuggestListItem} ${index === selectedIndex ? 'active' : ''}`}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleSuggestionSelect(suggestion);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <strong>
                  {suggestion.structuredFormatting?.main_text || suggestion.description}
                </strong>
                {suggestion.structuredFormatting?.secondary_text && (
                  <div className="text-muted small">
                    {suggestion.structuredFormatting.secondary_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Collapse isOpen={addressFieldsOpen}>
        {addressForm}
      </Collapse>
      <div className='d-flex align-items-center'>
        {hasErrors &&
          <div className='text-danger'>
            <FontAwesomeIcon icon={faExclamationTriangle} /> Invalid address!
          </div>}
        <a
          className={`ml-auto btn btn-sm btn-link ${hasErrors && 'text-danger'}`}
          onClick={toggleAddressFieldsOpen}
        >
          <FontAwesomeIcon
            icon={addressFieldsOpen ? faTimes : faEdit}
          /> {addressFieldsOpen ? 'Close' : 'Edit fields'}
        </a>
      </div>
    </>
  );
}

export default InputsAddress;
