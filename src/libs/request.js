import axios from "axios";
import { gotUserToken, clearUserToken } from "./gotToken";
import { Modal, Toast  } from "antd-mobile";
import { companyConfig } from "@/config";

//请求的公共参数
let arg = {};
//定义全部http
let http = {};

let requestTimes = 0;

http.get = function (api, params = {}) {
  const data = Object.assign({}, arg, params);
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: api,
      params: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          if (data.resultCode === 401) {
            handleInvalidToken()
          } else {
            resolve(response.data);
          }
        }
      })
      .catch((error) => {
        if (error.status === 403) {
          reject(error);
        } else {
          Toast.info(error.message);
        }
      });
  });
};


http.post = function (api, params = {}) {
  const data = Object.assign({}, arg, params);
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: api,
      data: data,
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          if (data.resultCode === 401) {
            handleInvalidToken()
          } else {
            resolve(response.data);
          }
        }
      })
      .catch((error) => {
        if (error.status === 403) {
          reject(error);
        } else {
          Toast.info(error.message);
        }
      });
  });
};

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    showFullScreenLoading();
    //  const token = "Bearer cafebabe";
    let token = gotUserToken() ? JSON.parse(gotUserToken()).token : "";
    config.headers['Authorization'] = token;
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
      const status = error.response.status;
      let message = "";
      switch (status) {
        case 400:
          message = "请求错误(400)";
          break;
        case 403:
          message = "拒绝访问(403)";
          break;
        case 404:
          message = "请求出错(404)";
          break;
        case 408:
          message = "请求超时(408)";
          break;
        case 500:
          message = "服务器错误(500)";
          break;
        case 501:
          message = "服务未实现(501)";
          break;
        case 502:
          message = "网络错误(502)";
          break;
        case 503:
          message = "服务不可用(503)";
          break;
        case 504:
          message = "网络超时(504)";
          break;
        case 505:
          message = "HTTP版本不受支持(505)";
          break;
        default:
          message = `连接出错(${status})!`;
      }
      const value = {
        message: message,
        status: status,
      };
      return Promise.reject(value);
    } else {
      const value = {
        message: "网络出错, 请稍后重试",
        status: 999,
      };
      return Promise.reject(value);
    }
  }
);


// 处理token失效
function handleInvalidToken() {
  if(requestTimes === 0) {
    Modal.alert("系统提示", '您的登录状态已过期，请重新登录', [
      {text: "重新登录", onPress: () => {
        requestTimes = 0
        clearUserToken();
        const config = companyConfig();
        window.location.replace(config.redirecturl)
      }},
    ]);
  }
  requestTimes++
}


function startLoading() {
  Toast.loading("数据加载中...");
}

function endLoading() {
  Toast.hide();
}


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

export default http;
