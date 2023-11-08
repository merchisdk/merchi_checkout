'use client';
import { useState } from 'react';
import TabPane from './TabPane';
import TitleStep from './TitleStep';
import FooterButtons from './FooterButtons';
import { tabIdDrafting } from '../tabs_utils';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import MerchiImageEditor from '../merchi_image_editor/MerchiImageEditor';
import InputFileUpload from './forms/InputFileUpload';
import { useForm } from 'react-hook-form';

function TabPaneDrafting() {
  const {
    editDraftTemplate,
    job,
    nextTab,
    product,
    setJob,
    toggleMerchiCheckout,
  } = useMerchiCheckboutContext();

  const { allowClientDraftContribution, draftTemplates = [] } = product;
  const clientFiles = job.clientFiles || [];
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const templates = draftTemplates.map((template: any, index: number) => {
    const ownDraftImages =
      (job.ownDrafts && job.ownDrafts[0] && job.ownDrafts[0].images) || [];
    const newTemplate = { ...template };
    newTemplate.file =
      (ownDraftImages && ownDraftImages[index]) || template.file;
    return newTemplate;
  });
  const setClientFiles = (clientFiles: any[]) => {
    setJob({ ...job, clientFiles });
  };
  function onClickNext() {
    if (allowClientDraftContribution && draftTemplates.length) {
      if (activeTemplateIndex === draftTemplates.length - 1) {
        nextTab();
      } else {
        setActiveTemplateIndex(activeTemplateIndex + 1);
      }
    } else {
      nextTab();
    }
  }
  function onClickBack() {
    if (activeTemplateIndex) {
      setActiveTemplateIndex(activeTemplateIndex - 1);
    } else {
      toggleMerchiCheckout();
    }
  }
  const { control } = useForm({ defaultValues: { clientFiles: '' } });
  return (
    <TabPane tabId={tabIdDrafting}>
      {allowClientDraftContribution && draftTemplates.length ? (
        <>
          <TitleStep title='Customise' />
          <MerchiImageEditor
            activeTemplateIndex={activeTemplateIndex}
            clientFiles={job.clientFiles || []}
            draftTemplates={templates}
            editDraftTemplate={editDraftTemplate}
            setClientFiles={setClientFiles}
            setActiveTemplateIndex={setActiveTemplateIndex}
          />
        </>
      ) : (
        <>
          <TitleStep title='Customise - Upload Files' />
          <InputFileUpload
            control={control}
            name='clientFiles'
            onFileUploaded={(clientFile: any) =>
              setClientFiles([...clientFiles, { file: clientFile, id: 'id' }])
            }
          />
        </>
      )}
      <FooterButtons
        forceDisabled={false}
        isActive={true}
        onClickBack={onClickBack}
        onClickNext={onClickNext}
      />
    </TabPane>
  );
}

export default TabPaneDrafting;
