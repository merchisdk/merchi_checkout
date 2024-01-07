import React from 'react';

interface Draft {
  // Define the structure of draft here. I don't have the details so I've left it generic.
}

interface DraftTemplateThumbnailProps {
  draft: Draft;
}

const DraftTemplateThumbnail: React.FC<DraftTemplateThumbnailProps> = ({
  draft,
}: any) => {
  // Implement the DraftTemplateThumbnail here.
  // I don't have the details so I'm just rendering a placeholder.

  return (
    <img
      style={{ objectFit: 'cover' }}
      src={draft.file.viewUrl}
      height='100'
      width='100'
      alt='Draft Thumbnail'
    />
  );
};

interface Props {
  activeIndex: number;
  classNameEditorImagesContainer?: string;
  classNameEditorImagesImage?: string;
  draftTemplates: Draft[];
  setActiveTemplateIndex: (index: number) => void;
}

const EditorImages: React.FC<Props> = ({
  activeIndex,
  classNameEditorImagesContainer = 'd-flex mb-3',
  classNameEditorImagesImage = 'nav-item mr-2',
  draftTemplates,
  setActiveTemplateIndex,
}) => {
  function isActive(index: number) {
    return index === activeIndex;
  }
  const activeDraftTemplate: any = draftTemplates[activeIndex];
  return (
    <>
      <div className={classNameEditorImagesContainer}>
        {draftTemplates.map((d, index) => (
          <div
            key={`${index}-draft-image`}
            className={`${classNameEditorImagesImage} ${
              isActive(index) ? 'active' : ''
            }`}
            onClick={() => setActiveTemplateIndex(index)}
            style={{
              borderRadius: '0.75rem',
              border: isActive(index)
                ? '2px #888 dashed'
                : '2px rgb(213, 213, 213) dashed',
              height: 101,
              overflow: 'hidden',
              width: 101,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease-in-out',
            }}
          >
            <DraftTemplateThumbnail draft={d} />
          </div>
        ))}
      </div>
      {activeDraftTemplate ? (
        <div className='d-flex flex-column'>
          <h4 className='mb-0'>
            {activeDraftTemplate.name} {activeDraftTemplate.height} *{' '}
            {activeDraftTemplate.width}px
          </h4>
          <small className='mt-0'>{activeDraftTemplate.description}</small>
        </div>
      ) : (
        <div>
          <h5 className='mb-0'>Loading template...</h5>
        </div>
      )}
    </>
  );
};

export default EditorImages;
