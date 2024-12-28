export enum FILE_CATEGORY {
  FOLDER = 'folder',
  FILE = 'file',
}

export enum SSE_EVENT {
  START_PARSE = 'startParse',
  NEED_PHONE = 'needPhone',
  NEED_SMS_CODE = 'needSmsCode',
  PROCESSING = 'processing',
  FINISH = 'finish',
}

export enum VALID_INFO_TYPE {
  PHONE = 'phone',
  SMS_CODE = 'smsCode',
}