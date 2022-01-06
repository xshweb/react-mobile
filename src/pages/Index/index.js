/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import NP from "number-precision";
import { useHistory } from "react-router-dom";
import HrCharts from "@/components/HrCharts";
import EchartRingList from "@/components/EchartRingList";
import moment from "moment";
import powericon from "./power.png";
import { clearUserToken } from "@/libs/gotToken";
import * as api from "@/api/user";
import { companyConfig } from "@/config";
import "./style.less";
const Index = () => {
  const nowdate = moment().format("YYYY/MM/DD");
  let history = useHistory();
  // 是否请求
  const [isload, setIsload] = useState(false);
  // 权限管理
  const [powerlist, setPowerList] = useState([]);
  // 财务
  const [totalfinance, setTotalfinance] = useState("0亿");
  // 财务截止时间
  const [financetime, setFinanceTime] = useState('');
  // hr数据
  const [hrdata, setHrData] = useState([]);
  // hr截止时间
  const [hrtime, setHrTime] = useState('');
  // 项目数据
  const [projectdata, setProjectData] = useState([]);
  const [projectdatalist, setProjectDataList] = useState([]);
  const [ismore, setIsmore] = useState(false);
  // 项目截止时间
  const [projecttime, setProjectTime] = useState('');
  // 销售数据
  const [saledata, setSaleData] = useState({});
  // 销售截止时间
  const [saletime, setSaleTime] = useState('');
  // 纯销数据
  const [statisticsdata, setStatisticsData] = useState({});
  // 纯销截止时间
  const [statisticstime, setStatisticsTime] = useState('');

  // 库存
  const [stock, setTotalStock] = useState("--");
  const [yearstock, setYearStock] = useState("--");
  const [halfstock, setHalfStock] = useState("--");

  // 库存截止时间
  const [stocktime, setStockTime] = useState('');

  // 纯销监测
  const [lists_cxh, setListsCxh] = useState([]);
  const [cxhtime, setCxhTime] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const result = await api.checklogin();
        if (result.resultCode === 0) {
          // getFinanceData();
          getSaleData();
          getProjectsData();
          getHrData();
          // getStatistics();
          getCXHData();
          getStock()
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLogin();
  }, []);

  // hr
  const getHrData = async () => {
    try {
      const result = await api.hrinfo();
      if (result.resultCode === 0) {
        addPower("hr");
        const data = result.data;
        let list = Array.isArray(data.list) ? data.list : [];

        /*
        list.map((item) => {
          item.scale = item.target
            ? parseFloat(
                (
                  ((item.current + item.offers) / item.target).toFixed(4) * 100
                ).toFixed(2)
              )
            : 0;
        });
        */

        const computedList = list.map((item) => {
          const needs = item.target - item.current - item.offers;
          return {
            ...item,
            needs: needs < 0 ? 0 : needs,
          };
        });

        setHrData(computedList);

        const lastUpdate = data.lastUpdate
          ? data.lastUpdate.replace(/-/g, "/")
          : '';
        setHrTime(lastUpdate);
      }
    } catch (error) {
      error.status === 403 && reducePower("hr");
    }
    setIsload(true);
  };

  // 财务
  const getFinanceData = async () => {
    try {
      const result = await api.financeinfo();
      if (result.resultCode === 0) {
        addPower("finance");
        const data = result.data;
        // let base = data.current > 1000 * 1e4 ? 1e8 : 1e4;
        // const current = parseFloat((data.current / base).toFixed(2));
        // const currentunit = base === 1e8 ? '亿' : '万'
        // setTotalfinance(`${current}${currentunit}`);
        const current = parseFloat((data.current / 1e8).toFixed(2));
        setTotalfinance(`${current}亿`);
        const lastUpdate = data.lastUpdate
          ? data.lastUpdate.replace(/-/g, "/")
          : '';
        setFinanceTime(lastUpdate);
      }
    } catch (error) {
      error.status === 403 && reducePower("finance");
    }
  };

  // 项目
  const getProjectsData = async () => {
    try {
      const result = await api.projectsinfo();
      if (result.resultCode === 0) {
        addPower("project");
        const data = result.data;
        const projectsArr = Array.isArray(data.projects) ? data.projects : [];
        let projects = projectsArr.filter((item, index) => index < 6);
        setProjectData([...projects]);
        setProjectDataList([...projectsArr]);
        const lastUpdate = data.lastUpdate
          ? data.lastUpdate.replace(/-/g, "/").split(" ")[0]
          : '';
        setProjectTime(lastUpdate);
      }
    } catch (error) {
      error.status === 403 && reducePower("project");
    }
  };

  // 销售
  const getSaleData = async () => {
    try {
      const result = await api.salesinfo();
      if (result.resultCode === 0) {
        addPower("sales");
        const data = result.data;
        const value = {
          curMonthSaleBoxes: formatNum(data.curMonthSaleBoxes),
          curMonthSaleFunds: parseFloat(
            (data.curMonthSaleFunds / 1e4).toFixed(2)
          ),
          curMonthReturnBoxes: formatNum(data.curMonthReturnBoxes),
          curMonthReturnFunds: parseFloat(
            (data.curMonthReturnFunds / 1e4).toFixed(2)
          ),
          curYearSaleBoxes: formatNum(data.curYearSaleBoxes),
          curYearSaleFunds: parseFloat(
            (data.curYearSaleFunds / 1e4).toFixed(2)
          ),
          curYearReturnBoxes: formatNum(data.curYearReturnBoxes),
          curYearReturnFunds: parseFloat(
            (data.curYearReturnFunds / 1e4).toFixed(2)
          ),
        };
        setSaleData(value);
        const lastUpdate = data.lastUpdate
          ? data.lastUpdate.replace(/-/g, "/")
          : '';
        setSaleTime(lastUpdate);
      }
    } catch (error) {
      error.status === 403 && reducePower("sales");
    }
  };

  // 纯销监测
  const getCXHData = async () => {
    try {
      const result = await api.largescreenSales();

      if (result.resultCode === 0) {
        addPower("cxhsales");
        const data = result.data;
        // 纯销达成率
        let data_cxh = [];
        data_cxh[0] = {
          name: "年度",
          target: data.targetYearSales,
          current: data.yearSales,
        };
        data_cxh[1] = {
          name: "季度",
          target: data.targetQuarterSales,
          current: data.quarterSales,
        };
        data_cxh[2] = {
          name: parseInt(data.monthData) + "月",
          target: data.targetlastMonthSales,
          current: data.lastMonthSales,
        };
        const temp_lists_cxh = data_cxh.map((item) => {
          let base = item.target > 9999 ? 1e4 : 1;
          let currentbase = item.target > 9999 ? 1e4 : 1;
          let scale = item.target
            ? NP.strip(
              ((item.current / item.target).toFixed(4) * 100).toFixed(0)
            )
            : 0;
          return {
            ...item,
            current:
              currentbase === 1e4
                ? NP.strip(parseFloat((item.current / base).toFixed(2)))
                : item.current,
            target:
              base === 1e4
                ? NP.strip(parseFloat((item.target / currentbase).toFixed(2)))
                : item.target,
            scale: scale,
            type: base === 1e4 ? 1 : 2,
            currenttype: currentbase === 1e4 ? 1 : 2,
          };
        });

        setListsCxh([...temp_lists_cxh]);

        // 截至日期
        if (data.effectiveDataMonth) {
          let effectiveDataMonth = data.effectiveDataMonth
            .replace(/-/g, "/")
            .split(" ")[0];
          setCxhTime(effectiveDataMonth);
        }
      }
    } catch (error) {
      if (error.status === 403) {
        reducePower("cxhsales");
      }
    }
  };


  // 库存监控
  const getStock = async () => {
    try {
      const result = await api.stockList();
      if (result.resultCode === 0) {
        addPower("stock");
        const data = result.data;
        const total = data.total ? data.total : '--'
        const halfYearDeadLine = data.halfYearDeadLine ? data.halfYearDeadLine : '--'
        const yearDeadLine = data.yearDeadLine ? data.yearDeadLine : '--'
        const deadLineDate = data.deadLineDate
        // 当前库存
        setTotalStock(total);
        setYearStock(yearDeadLine);
        setHalfStock(halfYearDeadLine);
        const lastUpdate = deadLineDate
          ? deadLineDate.split(' ')[0].replace(/-/g, "/")
          : '';
        setStockTime(lastUpdate);
      }
    } catch (error) {
      error.status === 403 && reducePower("stock");;
    }
  };

  // 全国纯销统计
  const getStatistics = async () => {
    try {
      const result = await api.getStatistics();
      if (result.resultCode === 0) {
        addPower("statistics");
        const data = result.data;
        const statisticsData = data ? data : [];

        setStatisticsData({
          ...statisticsData,
        });
        const lastUpdate = statisticsData.date
          ? statisticsData.date.replace(/-/g, "/")
          : '';
        setStatisticsTime(lastUpdate);
      }
    } catch (error) {
      error.status === 403 && reducePower("statistics");
    }
  };

  const formatNum = (num) => {
    let c = num;
    if (num) {
      c =
        num.toString().indexOf(".") !== -1
          ? num.toLocaleString()
          : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    }
    return c;
  };

  const addPower = (value) => {
    let list = powerlist;
    const index = list.findIndex((item) => item === value);
    if (index === -1) {
      list.push(value);
    }
    setPowerList([...list]);
  };

  const reducePower = (value) => {
    let list = powerlist;
    const index = list.findIndex((item) => item === value);
    if (index > -1) {
      list.splice(index, 1);
    }
    setPowerList([...list]);
  };

  const goPage = (page, param) => {
    switch (page) {
      case 1:
        history.push("/finance");
        break;
      case 2:
        history.push("/sale");
        break;
      case 3:
        history.push("/market");
        break;
      case 4:
        history.push(`/thingdetail?id=${param}`);
        break;
      case 5:
        history.push("/thinglist");
        break;
      case 6:
        history.push("/alltotal");
        break;
      case 7:
        history.push("/salemonitor");
        break;
      case 8:
        history.push("/stocklist");
        break;
      default:
    }
  };

  useEffect(() => {
    let projects = [];
    if (!ismore) {
      projects = projectdatalist.filter((item, index) => index < 6);
    } else {
      projects = projectdatalist;
    }
    setProjectData([...projects]);
  }, [ismore]);

  const handleMore = () => {
    setIsmore(!ismore);
  };

  const handleBack = () => {
    clearUserToken();
    const config = companyConfig();
    window.location.replace(config.redirecturl)
  }

  return (
    <div className="page index-page">
      <Helmet>
        <title>绿谷大数据</title>
      </Helmet>
      {(powerlist.length > 0 || !isload) && (
        <ul className="index-ul">
          {/* 财务资金 */}
          {powerlist.includes("finance") && (
            <li className="index-li index-li-padding">
              <div className="title">
                <div className="title-item">
                  <span className="icon">
                    <i className="iconfont icon-finance"></i>
                  </span>
                  <span className="text">财务资金</span>
                  <span className="time">截至{financetime}</span>
                </div>
                <div className="title-item" onClick={() => goPage(1)}>
                  <span className="btn">详情</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div>
              </div>
              <div className="content">
                <div className="content-item-li content-item-noborder">
                  <div className="content-item">
                    <span className="label">今日资金：</span>
                    <span className="text">{totalfinance}</span>
                  </div>
                </div>
              </div>
            </li>
          )}

          {/* 销售发货回款 */}
          {powerlist.includes("sales") && (
            <li className="index-li">
              <div className="title title-noborder">
                <div className="title-item">
                  <span className="icon">
                    <i className="iconfont icon-xiaoshoubaobiao-01"></i>
                  </span>
                  <span className="text">发货回款</span>
                  <span className="time">截至{saletime}</span>
                </div>
                <div
                  className="title-item title-item-right"
                  onClick={() => goPage(2)}
                >
                  <span className="btn">详情</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div>
              </div>
              <div className="content">
                <table className="table-ui">
                  <thead>
                    <tr>
                      <th>统计周期</th>
                      <th>当月</th>
                      <th>当年</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="td-div">发货盒数</div>
                        <div className="td-unit">(盒)</div>
                      </td>
                      <td>{saledata.curMonthSaleBoxes}</td>
                      <td>{saledata.curYearSaleBoxes}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="td-div">发货金额</div>
                        <div className="td-unit">(万元)</div>
                      </td>
                      <td>{saledata.curMonthSaleFunds}</td>
                      <td>{saledata.curYearSaleFunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="td-div">回款盒数</div>
                        <div className="td-unit">(盒)</div>
                      </td>
                      <td>{saledata.curMonthReturnBoxes}</td>
                      <td>{saledata.curYearReturnBoxes}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="td-div">回款金额</div>
                        <div className="td-unit">(万元)</div>
                      </td>
                      <td>{saledata.curMonthReturnFunds}</td>
                      <td>{saledata.curYearReturnFunds}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          )}

          {/* 纯销监测 */}
          {powerlist.includes("cxhsales") && (
            <li className="index-li">
              <div className="title title-noborder">
                <div className="title-item">
                  <span className="icon cxjc-font">
                    <i className="iconfont icon-quanguohuizongzhi"></i>
                  </span>
                  <span className="text">纯销监测</span>
                  <span className="time">截至{cxhtime}</span>
                </div>
                <div
                  className="title-item title-item-right"
                  onClick={() => goPage(7)}
                >
                  <span className="btn">详情</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div>
              </div>
              <div className="content">
                <div className="ring-list">
                  {lists_cxh.map((item, index) => (
                    <EchartRingList key={String(index)} data={item} />
                  ))}
                </div>
              </div>
            </li>
          )}

          {/* 库存监测 */}
          {powerlist.includes("stock") && (
            <li className="index-li">
              <div className="title title-noborder">
                <div className="title-item">
                  <span className="icon kcjc-font">
                    <i className="iconfont icon-kucunjiance"></i>
                  </span>
                  <span className="text">库存监测</span>
                  <span className="time">截至{stocktime}</span>
                </div>
                <div className="title-item title-item-right" onClick={() => goPage(8)}>
                  <span className="btn">详情</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div>
              </div>
              <div className="content">
                <table className="table-stock">
                  <tbody>
                    <tr>
                      <td>
                        当前生产库存
                      </td>
                      <td>{stock}盒</td>
                    </tr>
                    <tr>
                      <td>
                        半年内到期
                      </td>
                      <td>{halfstock}盒</td>
                    </tr>
                    <tr>
                      <td>
                        一年内到期
                      </td>
                      <td>{yearstock}盒</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          )}

          {/* 全国汇总值 */}
          {powerlist.includes("statistics") && (
            <li className="index-li">
              <div className="title">
                <div className="title-item">
                  <span className="icon">
                    <i className="iconfont icon-quanguohuizongzhi"></i>
                  </span>
                  <span className="text">纯销汇总</span>
                  <span className="time">截至{statisticstime}</span>
                </div>
                <div
                  className="title-item title-item-right"
                  onClick={() => goPage(6)}
                >
                  <span className="btn">详情</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div>
              </div>
              <div className="content">
                <div className="content-item-li">
                  <div className="content-item content-item-between">
                    <span className="label">当日处方患者数：</span>
                    <span className="text">
                      {statisticsdata.dailyNewPatients}人
                    </span>
                  </div>
                </div>
                <div className="content-item-li">
                  <div className="content-item content-item-between">
                    <span className="label">当日新患者数：</span>
                    <span className="text">
                      {statisticsdata.dailyPrescriptionPatients}人
                    </span>
                  </div>
                </div>
                <div className="content-item-li">
                  <div className="content-item content-item-between">
                    <span className="label">当日销售盒数：</span>
                    <span className="text">
                      {statisticsdata.dailySaleBoxes}盒
                    </span>
                  </div>
                </div>
                <div className="content-item-li">
                  <div className="content-item content-item-between">
                    <span className="label">当月累计处方患者数：</span>
                    <span className="text">
                      {statisticsdata.monthlyNewPatients}人
                    </span>
                  </div>
                </div>
                {/* <div className="content-item-li">
                  <div className="content-item content-item-between">
                    <span className="label">当月累计新患者数：</span>
                    <span className="text">
                      {statisticsdata.monthlyPrescriptionPatients}盒
                    </span>
                  </div>
                </div> */}
                <div className="content-item-li">
                  <div className="content-item content-item-between">
                    <span className="label">当月累计销售盒数：</span>
                    <span className="text">
                      {statisticsdata.monthlySaleBoxes}盒
                    </span>
                  </div>
                </div>
              </div>
            </li>
          )}

          {/* 待招人数 */}
          {powerlist.includes("hr") && (
            <li className="index-li">
              <div className="title">
                <div className="title-item">
                  <span className="icon">
                    <i className="iconfont icon-zhaopinpeizhi1"></i>
                  </span>
                  <span className="text">营销招聘</span>
                  <span className="time">截至{hrtime}</span>
                </div>
                {/* <div className="title-item title-item-right" onClick={() => goPage(3)}>
                  <span className="btn">详情</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div> */}
              </div>
              <div className="content">
                <HrCharts position="mid" lists={hrdata} />
              </div>
            </li>
          )}

          {/* 重点项目 */}
          {powerlist.includes("project") && (
            <li className="index-li index-li-padding">
              <div className="title">
                <div className="title-item">
                  <span className="icon">
                    <i className="iconfont icon-xiangmu"></i>
                  </span>
                  <span className="text">重点项目</span>
                  <span className="time">更新{projecttime}</span>
                </div>
                {/* <div className="title-item" onClick={() => goPage(5)}>
                  <span className="btn">更多</span>
                  <span className="arrow">
                    <i className="iconfont icon-fanhui"></i>
                  </span>
                </div> */}
              </div>
              <div className="content">
                {projectdata.map((item) => (
                  <div
                    className="content-item-list"
                    key={item.id}
                    onClick={() => goPage(4, item.id)}
                  >
                    <div className="list-item">
                      <span
                        className={`list-status ${parseInt(item.status) === 1
                          ? "success"
                          : parseInt(item.status) === 0
                            ? "wait"
                            : ""
                          }`}
                      ></span>
                      <span className="list-name">{item.projectName}</span>
                    </div>
                    <div className="list-icon">
                      <i className="iconfont icon-fanhui"></i>
                    </div>
                  </div>
                ))}
              </div>
              <div className="more-btn" onClick={handleMore}>
                <span className="more-btn-txt">{ismore ? "收起" : "更多"}</span>
                <span className={`more-btn-icon ${ismore ? "rotate" : ""}`}>
                  <i className="iconfont icon-xiala"></i>
                </span>
              </div>
            </li>
          )}
        </ul>
      )}
      {powerlist.length === 0 && isload && (
        <div className="power-wrapper">
          <img src={powericon} alt="powericon" className="powericon" />
          <div className="tips">
            <div className="tips-title">抱歉，您暂无操作权限</div>
            <div className="tips-des">请联系管理员授权，授权后需要重新登录</div>
          </div>
          <div className="back-btn" onClick={handleBack}>重新登录</div>
        </div>
      )}
    </div>
  );
};

export default Index;
