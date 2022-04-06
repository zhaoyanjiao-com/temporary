/**
 * 二次封装
 */
import api, {baseGet, basePost} from "./api";

export function get(method, data) {
  return baseGet(api.BASE_URL,method,data)
}

export function post(method, data) {
  return basePost(api.BASE_URL,method,data)
}