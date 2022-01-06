import React, { useEffect, useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import ReactLineItem from "@/components/lineItem";
import * as api from "@/api/user";
import { Toast } from "antd-mobile";
import "./style.less";
const Market = () => {
  const nowdate = moment().format("YYYY/MM/DD");
  let [data, setData] = useState([]);
   // hr截止时间
  const [hrtime, setHrTime] = useState(nowdate);
  useEffect(() => {
    getHrData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHrData = async () => {
    const result = await api.hrinfo();
    if (result.resultCode === 0) {
      const data = result.data;
      const list = Array.isArray(data.list) ? data.list : [];
      setData([...list]);
      const lastUpdate = data.lastUpdate ? data.lastUpdate.replace(/-/g, '/') : nowdate
      setHrTime(lastUpdate);
    } else {
      Toast(result.errorMsg);
    }
  };

  return (
    <div className="page detail-page">
      <Helmet>
        <title>营销人力</title>
      </Helmet>
      <ul>
        <li className="li-shadow">
          <div className="table-title">
            <div className="title">
              <span className="txt">营销人力</span>
              <span className="tips">(单位：人)</span>
            </div>
            <span className="remark">注：截止{hrtime}</span>
          </div>
          <div className="market-content">
            <ul className="example-ul">
              <li className="example-li">
                <span className="example-li-status status-default"></span>
                <span className="example-li-txt">总需求人数</span>
              </li>
              <li className="example-li">
                <span className="example-li-status status-success"></span>
                <span className="example-li-txt">收到的offter人数</span>
              </li>
              <li className="example-li">
                <span className="example-li-status status-saved"></span>
                <span className="example-li-txt">在岗人数</span>
              </li>
            </ul>
            <div className="line-ul">
              {/* <div className="line-li">
                  <span className="line-title">大区总监</span>
                  <div className="line-box" ref={ref}>
                     <div className="status status-success" style={{'width': sucwidth + 'px'}}>
                        <span className="status-value">20</span>
                     </div>
                     <div className="status status-saved" style={{'width': savwidth + 'px'}}>
                        <span className="status-value">30</span>
                     </div>
                     <div className="status status-default" style={{'width': defwidth + 'px'}}></div>
                  </div>
                  <span className="line-num">100</span>
               </div> */}
              {data.map((item, index) => (
                <ReactLineItem data={item} key={String(index)} />
              ))}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Market;
