import api from "./api";
import {get, post} from './http';

//获取站点列表
export const getTagInfoSiteAll = params => {
  return get(api.GET_GETTAGINFOSITEALL, params)
}
//获取站点所有数据
export const getData = params => {
  return get(api.GET_DATA, params)
}

export const post_a = params =>{
  return post(api.GET_DATA, params)
}

