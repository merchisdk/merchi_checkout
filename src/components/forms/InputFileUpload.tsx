'use client';
import { useState } from 'react';
import { useController } from 'react-hook-form';
import { uploadFileToServer } from '../../actions/files';
import { useDropzone } from 'react-dropzone';
import { CgSpinner } from 'react-icons/cg';
import { FaRegImage, FaPlus } from 'react-icons/fa';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider'; 

interface Props {
  accept?: any;
  control: any; // added control prop
  name: string; // added name prop
  onFileUploaded?: (file: any) => void;
  disabled?: boolean;
  placeholder?: string;
  rules?: Record<string, any>;
}

function InputFileUpload({
  accept = '.jpg,.jpeg,.png',
  control,
  name,
  onFileUploaded,
  disabled = false,
  placeholder = 'Drop files:',
  rules,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]); // State to store uploaded file URLs
  const { urlApi } = useMerchiCheckboutContext();

  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    defaultValue: '',
    rules,
  });

  const handleFileChange = async (acceptedFiles: File[]) => {
    setError(null);
    let newFiles: any[] = [];
    for (const file of acceptedFiles) {
      try {
        setLoading(true);
        const response = await uploadFileToServer((urlApi as string), file);
        const data = await response.json();
        newFiles.push(data.file);
        field.onChange(data.file.id);
        if (onFileUploaded) {
          onFileUploaded(data.file);
        }
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    }
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const spinnerStyleFix = {
    marginLeft: '-12px',
    top: '13px',
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept,
    disabled,
  });
  return (
    <>
      <div {...getRootProps()} className='merchi-dropzone-sign-up'>
        <input {...getInputProps()} disabled={disabled} name={name} />
        <div className='modal-merchi-checkout_dropzone-text-container'>
          <div className='modal-merchi-checkout_dropzone-icon-container'>
            {loading ? (
              <CgSpinner
                style={spinnerStyleFix}
                className='modal-merchi-checkout_dropzone-icon animate_spin'
                fontSize='1.5rem'
              />
            ) : (
              <FaRegImage
                className='modal-merchi-checkout_dropzone-icon'
                fontSize='1.75rem'
              />
            )}
            <FaPlus className='modal-merchi-checkout_dropzone-icon-plus' />
          </div>
          <div>
            <div className='text-left'>
              {loading ? 'Uploading...' : placeholder}
            </div>
            {accept && <div>{accept.replace(/,/g, ', ')}</div>}
          </div>
        </div>
      </div>
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className='modal-merchi-checkout_dropzone-image-preview'>
          {uploadedFiles.map((file, index) => (
            <img
              key={index}
              src={file.viewUrl}
              alt='Uploaded preview'
              className='modal-merchi-checkout_dropzone-image-preview-item'
            />
          ))}
        </div>
      )}
      {error && (
        <div className='text-danger'>
          {(error as any).message || 'Error Uploading File.'}
        </div>
      )}
      {fieldError && (
        <div className='text-danger'>{(fieldError as any).message}</div>
      )}
    </>
  );
}

export default InputFileUpload;
