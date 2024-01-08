/* eslint-disable no-undef */
import { useRef } from 'react';
import '@pqina/pintura/pintura.css';
import pintura from '@pqina/pintura/pintura.module.css';
// react-pintura
import { PinturaEditor } from '@pqina/react-pintura';
// pintura
import {
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,

  // plugins
  setPlugins,
  plugin_annotate,
  // plugin_decorate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
} from '@pqina/pintura';
import {
  uploadFileToServerAndChangeName,
  uploadShapeBackgroundImage,
} from './actions/file';
import { templateFileUrl } from './utils';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';

setPlugins(plugin_annotate);

const editorDefaults = {
  imageReader: createDefaultImageReader({
    // Fix image orientation
    orientImage: true,

    // Disable output prop filter
    outputProps: [],

    // Set request properties
    request: {
      credentials: 'omit',
    },
  }),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...markup_editor_defaults,
  locale: {
    ...locale_en_gb,
    ...markup_editor_locale_en_gb,
    ...plugin_annotate_locale_en_gb,
  },
};

interface ClientFileAndObjectId {
  file: any;
  objectId: string;
}

interface Props {
  clientFiles: any[];
  draftTemplate: any;
  editDraftTemplate: (merchiFile: any) => void;
  isActive: boolean;
  setClientFiles: (clientFileAndObjectId: ClientFileAndObjectId[]) => void;
}

export default function ImageEditor({
  clientFiles,
  draftTemplate,
  editDraftTemplate,
  isActive,
  setClientFiles,
}: Props) {
  const { urlApi } = useMerchiCheckboutContext();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const { file, name } = draftTemplate;
  const handleButtonClick = async () => {
    (editorRef as any).current.editor
      .processImage()
      .then(async (imageWriterResult: any) => {
        const { dest } = imageWriterResult;
        const r = await uploadFileToServerAndChangeName((urlApi as string), dest, name);
        const fileJson = await r.json();
        editDraftTemplate(fileJson.file);
      });
  };
  return (
    <>
      {isActive && (
        <>
          <div style={{ height: '70vh' }}>
            <PinturaEditor
              ref={editorRef}
              {...editorDefaults}
              annotateEnableSelectImagePreset={true}
              annotateEnableButtonFlipVertical={true}
              className={pintura.pintura}
              enableDropImage={true}
              enableButtonExport={false}
              enableButtonRevert={false}
              enablePasteImage={true}
              enableBrowseImage={true}
              enableZoom={false}
              src={templateFileUrl(draftTemplate)}
              handleEvent={async (type, detail) => {
                if (type === 'addshape' && detail.backgroundImage) {
                  // When files are added to the canvas we save them to
                  // client files which will be saved to job.clientFiles
                  const r = await uploadShapeBackgroundImage((urlApi as string), detail);
                  const fileJson = await r.json();
                  clientFiles.push({
                    file: fileJson.file,
                    objectId: detail.id,
                  });
                  setClientFiles([...clientFiles]);
                }
                if (type === 'removeshape') {
                  const cF: ClientFileAndObjectId[] = clientFiles.filter(
                    (f: ClientFileAndObjectId) => f.objectId !== detail.id
                  );
                  setClientFiles(cF);
                }
              }}
              onProcess={async ({ dest }: any) => {
                const r = await uploadFileToServerAndChangeName((urlApi as string), dest, name);
                const fileJson = await r.json();
                editDraftTemplate(fileJson.file);
              }}
              imageCropMaxSize={{ height: file.height, width: file.width }}
            />
          </div>
          <div
            style={{
              borderRadius: '0.5rem',
              background: '#f1f3ff',
              padding: '1rem',
            }}
          >
            <div
              className='w-100'
              style={{
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              👋 Remember to save your changes before hitting the next arrow.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                style={{ display: 'none' }}
                ref={fileInputRef}
                type='file'
                onChange={(e: any) => {
                  const file: any = e.target.files && e.target.files[0];
                  const sticker = {
                    x: 400,
                    y: 200,
                    width: 400,
                    height: 400,
                    backgroundSize: 'contain',
                    backgroundImage: URL.createObjectURL(file),
                  };

                  (editorRef as any).current.editor.imageAnnotation = [
                    ...(editorRef as any).current.editor.imageAnnotation,
                    sticker,
                  ];
                }}
              />
              <button
                className='btn btn-primary btn-lg mt-0 mb-4'
                onClick={() => (fileInputRef as any).current.click()}
                style={buttonStyle}
              >
                Add Image
              </button>
              <button
                className='btn btn-primary btn-lg mt-0 mb-4'
                onClick={handleButtonClick}
                style={buttonStyle}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const buttonStyle = {
  marginTop: '35px',
  paddingTop: '0.76rem',
  paddingBottom: '0.76rem',
};
