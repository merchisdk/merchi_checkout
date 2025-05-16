import React from 'react';
import { ButtonNext, ButtonPrevious } from './buttons';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

interface Props {
  formId?: string;
  forceDisabled?: boolean;
  isActive?: boolean;
  loading?: boolean;
  onClickBack?: () => void;
  onClickNext?: () => void;
}

function FooterButtons({
  formId,
  forceDisabled,
  isActive = true,
  loading,
  onClickBack,
  onClickNext,
}: Props) {
  const { classNameMerchiCheckoutFooterActionsContainer } = useMerchiCheckboutContext();
  return (
    <div className={classNameMerchiCheckoutFooterActionsContainer}>
      <ButtonPrevious onClick={onClickBack} />
      {isActive && (
        <ButtonNext
          formId={formId}
          forceDisabled={forceDisabled}
          loading={loading}
          onClick={onClickNext}
        />
      )}
    </div>
  );
}

export default FooterButtons;
