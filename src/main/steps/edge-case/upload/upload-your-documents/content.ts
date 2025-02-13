import _ from 'lodash';

import { TranslationFn } from '../../../../app/controller/GetController';
import { FormContent } from '../../../../app/form/Form';
import { applyParms } from '../../../../steps/common/url-parser';
import { loadResources } from '../../../../steps/edge-case/util';
import { UPLOAD_YOUR_DOCUMENTS } from '../../../../steps/urls';

export * from './routeGuard';

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.continue,
  },
};

export const generateContent: TranslationFn = content => {
  const resourceLoader = loadResources('upload-your-documents');
  const translations = resourceLoader.getFileContents().translations[content.language];
  const uploadedDocuments = content.userCase?.applicantApplicationFormDocuments?.map(uploadedDocument => {
    return {
      filename: uploadedDocument.document_filename,
      fileremoveUrl: applyParms(UPLOAD_YOUR_DOCUMENTS, {
        removeFileId: _.toString(_.last(uploadedDocument.document_url.split('/'))),
      }),
    };
  });

  return {
    ...translations,
    edgeCaseTypeOfApplication: content.userCase?.edgeCaseTypeOfApplication,
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
