import config from 'config';
import { Response } from 'express';
import FormData from 'form-data';
import _ from 'lodash';

import { getCaseApi } from '../../../app/case/CaseApi';
import { UploadDocumentContext } from '../../../app/case/definition';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject } from '../../../app/controller/PostController';
import { FormError } from '../../../app/form/Form';
import { fileMimeType } from '../../../steps/common/constants/commonConstants';
import { parseUrl } from '../../../steps/common/url-parser';
import { ADDITIONAL_DOCUMENTS_UPLOAD, UPLOAD_YOUR_DOCUMENTS } from '../../../steps/urls';

const sizeValidation = (fileSize: number): boolean => {
  return fileSize <= Number(config.get('documentUpload.validation.sizeInKB'));
};

const formatValidation = (mimeType: string): boolean => {
  return Object.values(fileMimeType).filter(aMimeType => aMimeType === mimeType).length > 0;
};

const getPropertyName = (context: UploadDocumentContext): string => {
  return context === UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS
    ? 'additionalApplicationUpload'
    : 'applicationUpload';
};

const getDocumentType = (context: UploadDocumentContext): string => {
  return context === UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS
    ? 'applicantAdditionalDocuments'
    : 'applicantApplicationFormDocuments';
};

const getUploadedDocumentError = (
  errorPropertyName: string,
  files:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[]
    | undefined,
  uploadedDocumentCount: number,
  context: UploadDocumentContext
): FormError | null => {
  let errorType;
  if (_.isNull(files)) {
    errorType = 'noFileUploadError';
  } else if (
    uploadedDocumentCount >=
    Number(
      config.get(
        context === UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS
          ? 'documentUpload.validation.totalAdditionalDocuments'
          : 'documentUpload.validation.totaldocuments'
      )
    )
  ) {
    errorType = 'totalFilesExceededError';
  } else if (!formatValidation(files?.[errorPropertyName].mimetype)) {
    errorType = 'formatError';
  } else if (!sizeValidation(files?.[errorPropertyName].size)) {
    errorType = 'sizeError';
  } else {
    return null;
  }

  return { errorType, propertyName: errorPropertyName };
};

export const handleDocumentUpload = async (
  req: AppRequest,
  res: Response,
  context: UploadDocumentContext
): Promise<void> => {
  const { files }: AppRequest<AnyObject> = req;
  const redirectUrl =
    context === UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS
      ? parseUrl(ADDITIONAL_DOCUMENTS_UPLOAD).url
      : parseUrl(UPLOAD_YOUR_DOCUMENTS).url;
  const uploadPropertyName = getPropertyName(context);
  const documentType = getDocumentType(context);

  const uploadDocumentError = getUploadedDocumentError(
    uploadPropertyName,
    files,
    req.session.userCase[documentType].length,
    context
  );
  if (!_.isEmpty(uploadDocumentError)) {
    req.session.errors?.push(uploadDocumentError);
    req.session.save(() => res.redirect(redirectUrl));
  } else {
    const documents: any = files?.[uploadPropertyName];
    if (!_.isArray(documents)) {
      const formData: FormData = new FormData();
      formData.append('file', documents.data, {
        contentType: documents.mimetype,
        filename: documents.name,
      });

      try {
        const requestDocument = await getCaseApi(req.session.user, req.locals.logger).uploadDocument(formData);
        req.session.userCase[documentType].push(requestDocument.document);
        req.session['errors'] = [];
        req.session.save(() => res.redirect(redirectUrl));
      } catch (error) {
        req.session.errors?.push({
          errorType: 'uploadError',
          propertyName: uploadPropertyName,
        });
        req.locals.logger.error(error);
        req.session.save(() => res.redirect(redirectUrl));
      }
    }
  }
};

export const deleteDocumentAndRedirect = async (
  req: AppRequest,
  res: Response,
  removeId: string,
  context: UploadDocumentContext
): Promise<void> => {
  const documentType = getDocumentType(context);
  let documentToDelete;
  req.session.errors = [];

  if (req.session.userCase[documentType]) {
    documentToDelete = req.session.userCase[documentType].find(
      document => document.document_url.split('/')[document.document_url.split('/').length - 1] === removeId
    );
  }

  if (documentToDelete) {
    try {
      await getCaseApi(req?.session?.user, req.locals.logger).deleteDocument(removeId.toString());
      req.session.userCase[documentType] = req.session.userCase?.[documentType]?.filter(
        document => document.document_url.split('/')[document.document_url.split('/').length - 1] !== removeId
      );
    } catch (error) {
      req.session.errors.push({
        errorType: 'deleteError',
        propertyName: getPropertyName(context),
      });
    } finally {
      const redirectUrl =
        context === UploadDocumentContext.UPLOAD_ADDITIONAL_DOCUMENTS
          ? parseUrl(ADDITIONAL_DOCUMENTS_UPLOAD).url
          : parseUrl(UPLOAD_YOUR_DOCUMENTS).url;
      req.session.save(() => {
        res.redirect(redirectUrl);
      });
    }
  }
};
