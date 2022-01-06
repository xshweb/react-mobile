import request from "@/libs/requestfill";
import { companyConfig } from "@/config";
const baseURL = companyConfig().http;
/**
 * 纯销
 * @param {} data
 * @returns
 */
// 纯销录入
export function salesmanAdd(data) {
  return request.post(`${baseURL}/mobile/salesman/add`, data);
}

// 销售移动端展示信息
export function salesmanArea(data) {
  return request.get(`${baseURL}/mobile/salesman/getArea`, data);
}

// 获取销售纯销一周内的输入数据
export function salesmanHistory(data) {
  return request.get(`${baseURL}/mobile/salesman/history`, data);
}

// 根据销售大区获取统计信息
export function getStatistics(data) {
  return request.get(`${baseURL}/mobile/salesman/getStatistics`, data);
}