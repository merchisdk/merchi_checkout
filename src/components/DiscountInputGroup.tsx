import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Merchi } from 'merchi_sdk_ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

export default function DiscountInputGroup() {
  const {
    discountButtonText = 'Apply',
    discountCallbackError,
    discountCallbackSuccess,
    discountClassName = 'd-flex align-items-end',
    discountClassNameButton = 'btn btn-primary',
    discountClassNameButtonContainer = '',
    discountClassNameButtonItemRemove = 'btn btn-sm btn-link',
    discountClassNameErrorMessage = 'text-danger',
    discountClassNameInput = 'form-control',
    discountClassNameInputContainer,
    discountClassNameListItem = 'list-group-item d-flex align-items-center justify-content-between mt-2',
    discountClassNameListItems = 'list-group',
    discountClassNameMainContainer,
    discountShowAppliedItems,
    invoice,
    job,
    product,
    setInvoice,
    setJob,
  } = useMerchiCheckboutContext();
  const merchi = new Merchi();
  const hookForm = useForm({
    defaultValues: { codes: '' },
  });
  const {
    getValues,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = hookForm;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(({} as any));

  const onSubmit = async (data: { codes: string }) => {
    const validate = await trigger();
    if (validate) {
      await validateCodes(data.codes);
    }
  };

  async function validateCodes(codes: string) {
    const query: Array<any> = [['codes', codes]];
    setLoading(true);
    setError({});
    try {
      let url = '';
      if (product) {
        url = `/products/${product.id}/check_discount_code/`;
      }
      const r = await merchi.authenticatedFetch(url, { query });
      const items = r.items || [];
      setItems(items);
      setJob({...job, items});
      if (invoice) {
        setInvoice({...invoice, items});
      }
      discountCallbackSuccess(r);
    } catch (e: any) {
      setError({message: `Error: ${e.errorMessage || e.message || 'Unexpected error.'}`});
      discountCallbackError();
    } finally {
      setLoading(false);
    }
  }
  async function handleClick() {
    const { codes } = getValues();
    await onSubmit({ codes });
  }

  const [items, setItems] = React.useState([]);

  async function removeItem(index: number) {
    const item: any = {...(items[index] as any)};
    const codes = getValues('codes');
    const newValues = codes.replace(item.code, "");
    setValue('codes', newValues);
    await validateCodes(newValues);
  }
  return (
    <div className={discountClassNameMainContainer}>
      <div className={discountClassName}>
        <div className={discountClassNameInputContainer}>
          <input
            type="text"
            className={discountClassNameInput}
            placeholder='discount20,dicoount10'
            {...register('codes', {required: 'Codes must be provided.'})}
          />
        </div>
        <div className={discountClassNameButtonContainer}>
          <button
            className={discountClassNameButton}
            disabled={loading}
            onClick={handleClick}
          >
            {loading ? (
              <FontAwesomeIcon icon={faCircleNotch} />
            ) : discountButtonText}
          </button>
        </div>
      </div>
      {error.message && (
        <div className={discountClassNameErrorMessage}>
          {error.message}
        </div>
      )}
      {errors.codes && (
        <div className={discountClassNameErrorMessage}>
          {errors.codes.message}
        </div>
      )}
      {discountShowAppliedItems && (
        <div className={discountClassNameListItems}>
          {items.map((item: any, index: number) =>
            <div
              className={discountClassNameListItem}
              key={index}
            >
              <div>{item.code} {item.description}</div>
              <div>
                <button
                  className={discountClassNameButtonItemRemove}
                  onClick={() => removeItem(index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
