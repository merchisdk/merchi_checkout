
'use client';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

function isPdf(file: any) {
  return ['application/pdf', 'application/x-pdf'].includes(file.mimetype);
}

interface Props {
  doDelete?: () => void;
  image: any;
}

function DraftImageUploaded({ doDelete, image }: Props) {
  const { classNameMerchiCheckoutButtonPrimary } = useMerchiCheckboutContext();
  return (
    <div className='upload-draft-image-container'>
      <div className='text-center'>
        {isPdf(image) ?
          <i className='far fa-file-pdf' />
        :
          <div
            className='image-preview-div'
            style={{backgroundImage: `url(${image.viewUrl})`}}
          />
        }
      </div>
      {doDelete &&
        <button className={classNameMerchiCheckoutButtonPrimary} onClick={doDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
    }
    </div>
  );
}

export default DraftImageUploaded;

export function DraftImagesStatic({
  items,
  className = 'width-150 z-index-10000' }: any) {
  return (
    <div className='d-flex justify-content-center flex-wrap z-index-10000'>
      {items.map((image: any, i: number) =>
        <div className={className} key={`${i}-draft-image`}>
          <DraftImageUploaded image={image} />
        </div>
      )}
    </div>
  );
}
