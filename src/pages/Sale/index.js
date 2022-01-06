import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import EchartLineList from "@/components/EchartLineList";
import EchartBarList from "@/components/EchartBarList";
import * as api from "@/api/user";
import { Toast } from "antd-mobile";
import "./style.less";
import moment from "moment";
import { mockdata } from "./data";

const Sale = () => {
  
  const nowyear = new Date().getFullYear();
  const nowdate = moment().format("YYYY/MM/DD");
  const [year, setYear] = useState(nowyear);
  // 发货盒数
  const [mSaleBoxes, setMSaleBoxes] = useState([]);
  const [ySaleBoxes, setYSaleBoxes] = useState([]);

  // 发货金额
  const [mSaleFunds, setMSaleFunds] = useState([]);
  const [ySaleFunds, setYSaleFunds] = useState([]);

  // 回款盒数
  const [mReturnBoxes, setMReturnBoxes] = useState([]);
  const [yReturnBoxes, setYReturnBoxes] = useState([]);

  // 回款金额
  const [mReturnFunds, setMReturnFunds] = useState([]);
  const [yReturnFunds, setYReturnFunds] = useState([]);

  // 销售截止时间
  const [saletime, setSaleTime] = useState(nowdate);

  useEffect(() => {
    const getSaleData = async () => {
      const result = await api.salesinfo();
      if (result.resultCode === 0) {
        const data = result.data;
        let monthlySaleBoxesList = handleDateMonth(data.monthlySaleBoxesList);

        let yearlySaleBoxesList = handleDataYear(data.yearlySaleBoxesList);

        let monthlySaleFundsList = handleDateMonth2(data.monthlySaleFundsList);

        let yearlySaleFundsList = handleDataYear(data.yearlySaleFundsList);

        let monthlyReturnBoxesList = handleDateMonth(
          data.monthlyReturnBoxesList
        );

        let yearlyReturnBoxesList = handleDataYear(data.yearlyReturnBoxesList);

        // let yearlyReturnBoxesList = handleDataYear(mockdata);

        let monthlyReturnFundsList = handleDateMonth2(
          data.monthlyReturnFundsList
        );

        let yearlyReturnFundsList = handleDataYear(data.yearlyReturnFundsList);

        setMSaleBoxes([...monthlySaleBoxesList]);
        setYSaleBoxes([...yearlySaleBoxesList]);

        setMSaleFunds([...monthlySaleFundsList]);
        setYSaleFunds([...yearlySaleFundsList]);

        setMReturnBoxes([...monthlyReturnBoxesList]);
        setYReturnBoxes([...yearlyReturnBoxesList]);

        setMReturnFunds([...monthlyReturnFundsList]);
        setYReturnFunds([...yearlyReturnFundsList]);
        if (data.lastUpdate) {
          setSaleTime(data.lastUpdate.replace(/-/g, "/"));
          setYear(data.lastUpdate.split('-')[0])
        }
      } else {
        Toast(result.errorMsg);
      }
    };
    getSaleData();
  }, []);

  // 销售
  const handleDateMonth = (res) => {
    let data = Array.isArray(res) ? res : [];
    if (data.length) {
      const echartdata = data.map((item) => {
        return {
          value: item.counts,
          datestr: `${item.date.split("-")[1]}/${item.date.split("-")[2]}`,
        };
      });
      return echartdata;
    }
    return data;
  };

  const handleDateMonth2 = (res) => {
    let data = Array.isArray(res) ? res : [];
    if (data.length) {
      const echartdata = data.map((item) => {
        return {
          value: Math.abs(item.counts / 1e4) < 100 ? parseFloat((item.counts / 1e4).toFixed(2)) : parseInt(item.counts / 1e4),
          datestr: `${item.date.split("-")[1]}/${item.date.split("-")[2]}`,
        };
      });
      return echartdata;
    }
    return data;
  };

  const handleDataYear = (res) => {
    let data = Array.isArray(res) ? res : [];
    if (data.length) {
      const echartdata = data.map((item) => {
        return {
          value: Math.abs(item.volume / 1e4) < 100 ? parseFloat((item.volume / 1e4).toFixed(2)) : parseInt(item.volume / 1e4),
          datestr: `${item.date.split("-")[0]}/${item.date.split("-")[1]}`,
          monthstr: `${parseInt(item.date.split("-")[1])}月`,
          month: `${item.date.split("-")[1]}`,
        };
      });
      return echartdata;
    }
    return data;
  };

  return (
    <div className="page detail-page">
      <Helmet>
        <title>发货回款</title>
      </Helmet>
      <div>
        {/* 月度发货 */}
        <EchartBarList
          result={ySaleBoxes}
          title="月度发货"
          unit="万盒"
          stitle="发货盒数"
          nowyear={year}
          endtime={saletime}
        />
        {/* 本月发货盒数 */}
        {/* <EchartLineList
          result={mSaleBoxes}
          title="本月发货盒数"
          stitle="发货盒数"
          unit="盒"
          nowyear={year}
          endtime={saletime}
        /> */}

        {/* 月度发货金额 */}
        <EchartBarList
          result={ySaleFunds}
          title="月度发货金额"
          stitle="发货金额"
          unit="万元"
          nowyear={year}
          endtime={saletime}
        />
        {/* 本月发货金额 */}
        {/* <EchartLineList
          result={mSaleFunds}
          title="本月发货金额"
          stitle="发货金额"
          unit="万元"
          nowyear={nowyear}
          endtime={saletime}
        /> */}

        {/* 月度回款 */}
        <EchartBarList
          result={yReturnBoxes}
          title="月度回款"
          stitle="回款盒数"
          unit="万盒"
          nowyear={year}
          endtime={saletime}
        />
        {/* 本月回款盒数 */}
        {/* <EchartLineList
          result={mReturnBoxes}
          title="本月回款盒数"
          stitle="回款盒数"
          unit="盒"
          nowyear={year}
          endtime={saletime}
        /> */}

        {/* 月度回款金额 */}
        <EchartBarList
          result={yReturnFunds}
          title="月度回款金额"
          stitle="回款金额"
          unit="万元"
          nowyear={year}
          endtime={saletime}
        />
        {/* 本月回款金额 */}
        {/* <EchartLineList
          result={mReturnFunds}
          title="本月回款金额"
          stitle="回款金额"
          unit="万元"
          nowyear={year}
          endtime={saletime}
        /> */}
      </div>
    </div>
  );
};

export default Sale;
