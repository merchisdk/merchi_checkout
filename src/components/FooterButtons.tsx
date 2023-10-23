import { ButtonNext, ButtonPrevious } from './buttons';

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
  return (
    <div className='d-flex justify-content-between mt-4'>
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
