/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import "./style.less";
import * as api from "@/api/fill";
const AllTotal = () => {
  const nowdate = moment().format("YYYY/MM/DD");
  const [lists, setList] = useState([]);
  const [lastTime, setLastTime] = useState("");
  useEffect(() => {
    const getData = async () => {
      const result = await api.getStatistics();
      if (result.resultCode === 0) {
        const data = result.data;
        const lists = Array.isArray(data.depts) ? data.depts : [];
        setList([...lists]);
        const lastUpdate = data.lastUpdate
        ? data.lastUpdate.replace(/-/g, "/")
        : nowdate;
        setLastTime(lastUpdate);
      }
    };
    getData();
  }, []);
  return (
    <div className="page alltotal-page">
      <Helmet>
        <title>纯销上报大区查看</title>
      </Helmet>
      <div className="alltotal-wrapper">
        <div className="alltotal-content">
          <div className="header-title">
            <div className="title">纯销上报大区合计查看</div>
            <div className="title-time">注：截止{lastTime}</div>
          </div>
          <div className="tabel-wrapper">
            <ul className="table-head">
              <li className="td td-flex">
                <span className="head-title">大区</span>
              </li>
              <li className="td td-last">
                <span className="td-name">当日数量</span>
                <ul className="td-ul">
                  <li className="td-li">
                    <span className="td-li-name">处方患者</span>
                  </li>
                  <li className="td-li">
                    <span className="td-li-name">新患者数</span>
                  </li>
                  <li className="td-li">
                    <span className="td-li-name">销售盒数</span>
                  </li>
                </ul>
              </li>
              <li className="td td-last">
                <span className="td-name">当月累计</span>
                <ul className="td-ul">
                  <li className="td-li">
                    <span className="td-li-name">处方患者</span>
                  </li>
                  <li className="td-li">
                    <span className="td-li-name">销售盒数</span>
                  </li>
                </ul>
              </li>
            </ul>
            {lists.map((list, index) => (
              <ul className="table-body" key={String(index)}>
                <li className="td td-flex">
                  <span className="body-value">{list.areaName}</span>
                </li>
                <li className="td">
                  <span className="body-value body-value-color">{list.dailyNewPatients}</span>
                </li>
                <li className="td">
                  <span className="body-value body-value-color">{list.dailyPrescriptionPatients}</span>
                </li>
                <li className="td">
                  <span className="body-value body-value-color">{list.dailySaleBoxes}</span>
                </li>
                <li className="td">
                  <span className="body-value body-value-color">{list.monthlyNewPatients}</span>
                </li>
                <li className="td">
                  <span className="body-value body-value-color">{list.monthlySaleBoxes}</span>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTotal;
