'use client';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  classNameConfirmButton?: string;
  classNameDismissButton?: string;
}

function CancelOrderConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  classNameConfirmButton = 'btn btn-lg btn-primary',
  classNameDismissButton = 'btn btn-lg btn-secondary',
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className='merchi-checkout-confirm-overlay'
      role='presentation'
      onClick={onCancel}
    >
      <div
        className='merchi-checkout-confirm-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='merchi-checkout-cancel-order-title'
        onClick={(event) => event.stopPropagation()}
      >
        <h5
          id='merchi-checkout-cancel-order-title'
          className='merchi-checkout-confirm-dialog-title'
        >
          Cancel order?
        </h5>
        <p className='merchi-checkout-confirm-dialog-message'>
          Are you sure you want to cancel this order? You can return to the
          confirm step and place the order again.
        </p>
        <div className='merchi-checkout-confirm-dialog-actions'>
          <button
            type='button'
            className={classNameDismissButton}
            onClick={onCancel}
          >
            No, keep order
          </button>
          <button
            type='button'
            className={classNameConfirmButton}
            onClick={onConfirm}
          >
            Yes, cancel order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelOrderConfirmModal;
