import request from "@/libs/request";
import { companyConfig } from "@/config";
const baseURL = companyConfig().http;
// 校验登录
export function checklogin(data) {
  return request.get(`${baseURL}/ewechat/isLogin`, data);
}
// 登录
export function login(data) {
  return request.get(`${baseURL}/ewechat/loginbyewechat`, data);
}

// 人力资源展示信息
export function hrinfo(data) {
  return request.get(`${baseURL}/mobile/hr/info`, data);
}

// 财务展示信息
export function financeinfo(data) {
  return request.get(`${baseURL}/mobile/finance/info`, data);
}

// 销售展示信息
export function salesinfo(data) {
  return request.get(`${baseURL}/mobile/sales/info`, data);
}

// 项目展示信息
export function projectsinfo(data) {
  return request.get(`${baseURL}/mobile/project/info`, data);
}

// 项目展示信息详情
export function projectsdetail(data) {
  return request.get(`${baseURL}/mobile/project/detail`, data);
}


// 获取全国纯销统计信息
export function getStatistics(data) {
  return request.get(`${baseURL}/mobile/statistics/getStatistics`, data);
}


// 根据销售大区获取统计信息
export function getStatisticsByDept(data) {
  return request.get(`${baseURL}/mobile/statistics/getStatisticsByDept`, data);
}



// 地区,月,年销售蓝图数据
export function largescreenSales(data) {
  return request.get(`${baseURL}/screen/backstage/salesDataInfo`, data);
}

// 库存总数和详情
export function stockList(data) {
  return request.get(`${baseURL}/screen/add/stockDetail`, data);
}
