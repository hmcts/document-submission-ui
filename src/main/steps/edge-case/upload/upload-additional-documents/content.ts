import _ from 'lodash';

import { TranslationFn } from '../../../../app/controller/GetController';
import { FormContent } from '../../../../app/form/Form';
import { applyParms } from '../../../../steps/common/url-parser';
import { loadResources } from '../../../../steps/edge-case/util';
import { ADDITIONAL_DOCUMENTS_UPLOAD } from '../../../../steps/urls';

export * from './routeGuard';

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = loadResources('upload-additional-documents');
  const translations = resourceLoader.getFileContents().translations[content.language];
  const uploadedDocuments = content.userCase?.applicantAdditionalDocuments?.map(uploadedDocument => {
    return {
      filename: uploadedDocument.document_filename,
      fileremoveUrl: applyParms(ADDITIONAL_DOCUMENTS_UPLOAD, {
        removeFileId: _.toString(_.last(uploadedDocument.document_url.split('/'))),
      }),
    };
  });

  return {
    ...translations,
    form,
    fileUploadConfig: {
      labelText: translations.uploadFileHeading,
      hintText: translations.uplodFileHint,
      uploadButtonText: translations.uploadButton,
      uploadedFilesCaption: translations.filesUploadedLabel,
      removeFileText: translations.delete,
      uploadedFiles: uploadedDocuments,
      summaryText: translations.summaryText,
      uploadRequirement: translations.uploadRequirement,
    },
  };
};
