import {review} from "./ReviewerResponse.js";
import {responseType} from "../index.js";

export const response = (data, type) => {
  let result = '------ NOTICE -------'
  switch (type) {
    case responseType.REVIEW:
      result += review(data);
      break;
    case responseType.FEEDBACK:
      result += review(data);
      break;
    case responseType.CUSTOM:
      result += review(data);
      break;
    default:
      result += '\n error response: not select type'
  }
  return result
}
