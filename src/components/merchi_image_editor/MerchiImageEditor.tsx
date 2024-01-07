import ImageEditor from './ImageEditor';
import EditorImages from './EditorImages';

interface ClientFileAndObjectId {
  file: any;
  objectId: string;
}

interface Props {
  activeTemplateIndex: number;
  clientFiles: [];
  draftTemplates: any[];
  editDraftTemplate: (index: number, file: any) => void;
  setActiveTemplateIndex: (index: number) => void;
  setClientFiles: (clientFiles: ClientFileAndObjectId[]) => void;
}

export default function MerchiImageEditor({
  activeTemplateIndex,
  clientFiles,
  draftTemplates,
  editDraftTemplate,
  setActiveTemplateIndex,
  setClientFiles,
}: Props) {
  return (
    <>
      <EditorImages
        activeIndex={activeTemplateIndex}
        draftTemplates={draftTemplates}
        setActiveTemplateIndex={setActiveTemplateIndex}
      />
      <div
        style={{
          border: '1px solid f0f0f0',
          padding: 10,
          margin: '10px 0',
          borderRadius: 10,
          boxShadow: '0px 5px 20px rgba(0,0,0,0.05)',
        }}
      >
        {draftTemplates.map((t: any, index: number) => (
          <ImageEditor
            clientFiles={clientFiles}
            editDraftTemplate={(merchiFile: any) =>
              editDraftTemplate(index, merchiFile)
            }
            key={index}
            draftTemplate={t}
            isActive={activeTemplateIndex === index}
            setClientFiles={setClientFiles}
          />
        ))}
      </div>
    </>
  );
}
