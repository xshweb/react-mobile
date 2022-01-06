import axios from "axios";
import qs from "qs";
import configureStore from "@/store";
import { gotUserToken, clearUserToken } from "./gotToken";
import { Toast } from "antd-mobile";
import { createHashHistory } from "history";
import { AddPower, ReducePower } from "@/store/actions";
import { powerlist } from "@/config/power";
import { weixinurl } from "@/config";
const history = createHashHistory();
const store = configureStore();

//请求的公共参数
let arg = {};
//定义全部http
let http = {};

http.get = function (api, params = {}) {
  // let token = "Bearer cafebabe";
  let token = gotUserToken() ? JSON.parse(gotUserToken()).token : "";

  const data = Object.assign({}, arg, params);
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: api,
      params: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token,
      },
    })
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          const data = response.data;
          if (data.resultCode === 401) {
            // token过期
            // Toast.info(data.errorMsg);
            // 清除缓存token
            clearUserToken();
            // history.push("/login");
            window.location.replace(weixinurl);
          }
          // 增加权限
          // powerlist.map((item) => {
          //   if (api.indexOf(item) > -1) {
          //     store.dispatch(AddPower(item));
          //   }
          // });
          resolve(response.data);
        } else if (response.status === 403) {
          // 解除权限
          // powerlist.map((item) => {
          //   if (api.indexOf(item) > -1) {
          //     store.dispatch(ReducePower(item));
          //   }
          // });
          const value = {
            resultCode: 403,
            errorMsg: "Forbidden",
          };
          resolve(value);
        }
      })
      .catch((error) => {
        if (error && error.response) {
          if (error.response.status === 403) {
            reject(error);
          } else {
            Toast.info(error.message);
          }
        } else {
          Toast.info(error.message);
          console.log("error", JSON.stringify(error));
        }
      });
  });
};

function startLoading() {
  //使用Element loading-start 方法
  // console.log('startLoading')
  Toast.loading("数据加载中...");
}

function endLoading() {
  //使用Element loading-close 方法
  // console.log('endLoading')
  Toast.hide();
}

//showFullScreenLoading() tryHideFullScreenLoading() 用于将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1   needLoadingRequestCount为 0 时，结束 loading

let needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    showFullScreenLoading();
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    tryHideFullScreenLoading();
    return response;
  },
  (error) => {
    tryHideFullScreenLoading();
    if (error && error.response) {
      if (error.response.status === 403) {
        return Promise.reject(error);
      } else {
        switch (error.response.status) {
          case 400:
            error.message = "请求错误(400)";
            break;
          case 403:
            error.message = "拒绝访问(403)";
            break;
          case 404:
            error.message = "请求出错(404)";
            break;
          case 408:
            error.message = "请求超时(408)";
            break;
          case 500:
            error.message = "服务器错误(500)";
            break;
          case 501:
            error.message = "服务未实现(501)";
            break;
          case 502:
            error.message = "网络错误(502)";
            break;
          case 503:
            error.message = "服务不可用(503)";
            break;
          case 504:
            error.message = "网络超时(504)";
            break;
          case 505:
            error.message = "HTTP版本不受支持(505)";
            break;
          default:
            error.message = `连接出错(${error.response.status})!`;
            return Promise.reject(error);
        }
      }
    } else {
      error.message = "网络出错, 请稍后重试";
      return Promise.reject(error);
    }
  }
);

export default http;
