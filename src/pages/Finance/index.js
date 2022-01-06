import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "./style.less";
import EchartLineList from "@/components/EchartLineList";
import * as api from "@/api/user";
import { Toast } from "antd-mobile";
import moment from "moment";
const Finance = () => {
  const nowyear = new Date().getFullYear();
  const nowdate = moment().format("YYYY/MM/DD");
  const [data, setData] = useState([]);
  // 财务截止时间
  const [financetime, setFinanceTime] = useState(nowdate);
  useEffect(() => {
    // 财务
    const getFinanceData = async () => {
      const result = await api.financeinfo();
      if (result.resultCode === 0) {
        const data = result.data;
        let lists = Array.isArray(data.lists) ? data.lists : [];
        const echartdata = lists.map((item) => {
          return {
            value: parseFloat((item.total / 1e8).toFixed(2)),
            datestr: `${item.date.split("-")[1]}/${item.date.split("-")[2]}`,
          };
        });
        setData([...echartdata]);
        const lastUpdate = data.lastUpdate
          ? data.lastUpdate.replace(/-/g, "/")
          : nowdate;
        setFinanceTime(lastUpdate);
      } else {
        Toast(result.errorMsg);
      }
    };
    getFinanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page detail-page">
      <Helmet>
        <title>财务资金</title>
      </Helmet>
      <div>
        {/* 本月发货盒数 */}
        <EchartLineList
          result={data}
          title="公司整体资金"
          unit="亿"
          stitle="公司整体资金"
          endtime={financetime}
          nowyear={nowyear}
        />
      </div>
    </div>
  );
};

export default Finance;
