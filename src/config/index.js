/* eslint-disable no-undef */
const gvAppId = process.env.REACT_APP_GVAPPID
export const gvUrl = process.env.REACT_APP_GVURL
export const baseURL = process.env.REACT_APP_BASEURL
const WXAPPID = gvAppId;
const WXURL = `${gvUrl}/#/login`;
export const weixinurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WXAPPID}&redirect_uri=${encodeURIComponent(
    WXURL
)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;

const WXURL2 = `${gvUrl}/#/filllogin`;
export const weixinurl2 = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WXAPPID}&redirect_uri=${encodeURIComponent(
    WXURL2
)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;


function getRedirect(appid, origin, pathname) {
  const url = `${origin}/web/mobile/#/${pathname}`
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
    url
)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
}

export const companyConfig = () => {
    const url = window.location.origin;
    let appid = ''
    switch (url) {
        case 'https://test-bi.green-valley.com':
            appid = 'wx05b038f10791705d'
            return {
                agentid: '1000041',
                corpCode: 'gv0001',
                companyName: '*绿谷制药',
                appid: appid,
                http: '/api/gvbi',
                origin: url,
                weburl: '/web/mobile',
                redirecturl: getRedirect(appid, url, 'login'),
                redirecturl2: getRedirect(appid, url, 'filllogin')
            };
        case 'https://bi.green-valley.com':
             appid = 'wx05b038f10791705d'
            return {
                agentid: '1000046',
                corpCode: 'gv0001',
                companyName: '绿谷制药',
                appid: appid,
                http: '/api/gvbi',
                origin: url,
                weburl: '/web/mobile',
                redirecturl: getRedirect(appid, url, 'login'),
                redirecturl2: getRedirect(appid, url, 'filllogin')
            };
        case 'https://test-bi.greenvalleypharma.com':
            appid = 'ww4fbe1ef409109428'
            return {
                agentid: '1000012',
                corpCode: 'gv0002',
                companyName: '*绿谷医药科技',
                appid: appid,
                http: '/api/gvbi',
                origin: url,
                weburl: '/web/mobile',
                redirecturl: getRedirect(appid, url, 'login'),
                redirecturl2: getRedirect(appid, url, 'filllogin')
            };
        case 'https://bi.greenvalleypharma.com':
           appid = 'ww4fbe1ef409109428'
            return {
                agentid: '1000013',
                corpCode: 'gv0002',
                companyName: '绿谷医药科技',
                appid: appid,
                http: '/api/gvbi',
                origin: url,
                weburl: '/web/mobile',
                redirecturl: getRedirect(appid, url, 'login'),
                redirecturl2: getRedirect(appid, url, 'filllogin')
            };
        default:
            return {
                agentid: '',
                corpCode: '',
                companyName: '',
                appid: '',
                http: '',
                origin: '',
                weburl: '',
                redirecturl: '',
                redirecturl2: ''
            };
    }
};