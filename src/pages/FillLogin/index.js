import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as api from "@/api/user";
import { Modal, Toast } from "antd-mobile";
import logo from "./logo.png";
import "./style.less";
import { gotUserToken, setUserToken } from "@/libs/gotTokenFill";
import { companyConfig } from "@/config";
import { useHistory } from "react-router-dom";
function getQueryString(name) {
  //encodeURI decodeURI encodeURIComponent decodeURIComponent
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return r[2];
  } else {
    return null;
  }
}

const FillLogin = () => {
  const config = companyConfig();
  const history = useHistory();
  const [name, setName] = useState(config.companyName);
  useEffect(() => {
    function isToken() {
      let token = gotUserToken() ? JSON.parse(gotUserToken()).token : "";
      if (token) {
        history.replace("/filldata");
        return;
      }
    }
    isToken()
    const urlcode = getQueryString("code");
    if (!urlcode) {
      window.location.replace(config.redirectur2);
    }
    // eslint-disable-next-line
  }, []);

  const submitLogin = () => {
    const urlcode = getQueryString("code");
    if (!urlcode) {
      window.location.replace(config.redirectur2);
    } else {
      submitData(urlcode);
    }
  };

  const submitData = async (urlcode) => {
    const param = {
      code: urlcode,
      source: "MOBILE",
    };
    const result = await api.login(param);
    if (result.resultCode === 0) {
      Toast.info("您好，登录成功");
      const data = result.data;
      const value = {
        userId: data.id,
        token: data.token,
        name: data.name,
        type: "logindata",
        corpCode: config.corpCode,
        appName: 'gvbi'
      };
      // 设置token
      setUserToken(JSON.stringify(value));
      // 登陆
      history.replace('/filldata');
    } else {
      // 登陆失败
      Modal.alert("提示", result.errorMsg, [
        { text: "确定", onPress: () => window.location.replace(config.redirectur2) },
      ]);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>绿谷大数据</title>
      </Helmet>
      <div className="login-content">
        <img src={logo} className="logo" alt="" />
        <div className="slogan">纯销数据录入</div>
        <div className="loginbtn" onClick={submitLogin}>
          企业微信一键登录
        </div>
      </div>
      <div className="login-footer">
        <div className="title">{name ? name : ''}</div>
      </div>
    </div>
  );
};

export default FillLogin;
