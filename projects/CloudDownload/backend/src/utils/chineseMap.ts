import { SSE_EVENT } from '../enums/sse';

export const sseEventMap = (event: SSE_EVENT) => {
  switch (event) {
    case SSE_EVENT.START_PARSE:
      return '开始解析';
    case SSE_EVENT.NEED_PHONE:
      return '请输入手机号码';
    case SSE_EVENT.NEED_SMS_CODE:
      return '请输入验证码';
    case SSE_EVENT.PROCESSING:
      return '正在下载中';
    case SSE_EVENT.FINISH:
      return '下载完成';
  }
};
