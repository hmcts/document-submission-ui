export const EMPTY = '';
export const SPACE = ' ';
export const FORWARD_SLASH = '/';
export const TOGGLE_SWITCH = { ON: 'on', OFF: 'off' };

export const fileMimeType: Partial<Record<string, string>> = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  png: 'image/png',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  jpg: 'image/jpeg',
  txt: 'text/plain',
  rtf: 'application/rtf',
  rtf2: 'text/rtf',
  gif: 'image/gif',
};
