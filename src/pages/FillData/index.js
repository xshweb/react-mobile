/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import * as api from "@/api/fill";
import { Modal, Toast  } from "antd-mobile";
import "./style.less";
import powericon from "./power.png";
import moment from "moment";
import InputItem from "@/components/InputItem";
import useInput from "@/components/InputItem/useInput";

import { useHistory } from "react-router-dom";
import { clearUserToken } from "@/libs/gotTokenFill";
import { companyConfig } from "@/config";

const alert = Modal.alert;

const weeks = [
  { name: "一", id: 1 },
  { name: "二", id: 2 },
  { name: "三", id: 3 },
  { name: "四", id: 4 },
  { name: "五", id: 5 },
  { name: "六", id: 6 },
  { name: "日", id: 0 },
];

const IptAllTotal = () => {
  let history = useHistory();
  const [ispower, setIsPower] = useState(1);
  // 项目数据
  const firstload = useRef(1);

  const nowdatestamp = moment().format("YYYY-MM-DD");
  const nowquerymonth = moment().format("YYYY-MM");
  const lastdatestamp = moment().subtract(7, "d").format("YYYY-MM-DD");
  const lastdatestamp30 = moment().subtract(90, "d").format("YYYY-MM-DD");
  const [lists, setLists] = useState([]);
  const [placeholders, setPlaceholders] = useState([]);
  const [dateLists, setDateLists] = useState([]);
  const [current, setCurrent] = useState("");
  const [queryMonth, setQueryMonth] = useState("");
  const [isfocus, setIsfocus] = useState(false);
  // 刷新
  const [isrefresh, setRefresh] = useState(false);
  // 0 可编辑 1 可新增 2 不显示按钮
  const [btnstatus, setBtnStatus] = useState(0);
  // 判断是否能向前切换日期
  const [prevstatus, setPrevStatus] = useState(false);
  const [area, setArea] = useState({
    newPatients: "",
    id: "",
  });
  // 当前数据id
  const [rowid, setRowId] = useState(0);

  //获取一个月多少天
  const getDays = (year, month) => {
    let day = new Date(year, month, 0);
    return day.getDate();
  };

  // 当月第一天星期几
  const getWeeks = (year, month) => {
    let date = new Date();
    date.setYear(year);
    date.setMonth(month - 1);
    date.setDate(1);
    return date.getDay();
  };

  // 判断是否能新增编辑
  const judgeIsEdit = (date) => {
    const nowtimestamp = moment(nowdatestamp, "YYYY-MM-DD").unix();
    const timestamp = moment(date, "YYYY-MM-DD").unix();
    if (
      nowtimestamp - 7 * 24 * 60 * 60 <= timestamp &&
      timestamp <= nowtimestamp
    ) {
      return true;
    }
    return false;
  };

  // 判断是否能操作
  const judgeIsDisable = (date) => {
    const nowtimestamp = moment(nowdatestamp, "YYYY-MM-DD").unix();
    const timestamp = moment(date, "YYYY-MM-DD").unix();
    if (timestamp > nowtimestamp) {
      return true;
    }
    return false;
  };

  const handleDateTitle = (str, type) => {
    if (str) {
      if (type === 1) {
        return `${str.split("-")[0]}年${str.split("-")[1]}月`;
      } else {
        return str.replace(/-/g, "/");
      }
    }
    return str;
  };

  const fillZero = (num) => {
    return parseInt(num) < 10 ? "0" + num : num;
  };

  // 获取地区数据
  useEffect(() => {
    const getArea = async () => {
      try {
        const result = await api.salesmanArea();
        if (result.resultCode === 0) {
          setIsPower(1);
          const data = result.data;
          setArea({
            ...data,
          });
        }
      } catch (error) {
        error.status === 403 && setIsPower(2);
      }
    };
    getArea();
  }, []);

  // 获取当月数据
  useEffect(() => {
    const getData = async () => {
      try {
        const params = {
          queryMonth: queryMonth,
        };
        const result = await api.salesmanHistory(params);
        if (result.resultCode === 0) {
          setIsPower(1);
          const data = result.data;
          let records = Array.isArray(data.records) ? data.records : [];
          if (records.length > 0 && firstload.current === 1) {
            // 首次调用接口执行  默认显示已填写日期是最后一个
            let target = records[records.length - 1];
            setCurrent(target.date);
          } else if (records.length === 0 && firstload.current === 1) {
            setCurrent(nowdatestamp);
          }
          setLists([...records]);
          firstload.current = 2;
        }
      } catch (error) {
        error.status === 403 && setIsPower(2);
      }
    };
    getData();
    // eslint-disable-next-line
  }, [queryMonth, isrefresh]);

  // 填充数据
  useEffect(() => {
    const filterList = lists.filter((list) => list.date === current);
    if (filterList.length > 0) {
      const target = filterList[0];
      setRowId(target.id);
      medicine.setIptValue(target.newPatients);
      sale.setIptValue(target.saleBoxes);
      people.setIptValue(target.prescriptionPatients);
      if (judgeIsEdit(target.date)) {
        setBtnStatus(0);
      } else {
        setBtnStatus(2);
      }
    } else {
      if (judgeIsEdit(current)) {
        setBtnStatus(1);
      } else {
        setBtnStatus(2);
      }
      handleCancle();
    }
  }, [lists, current]);

  // 创建月份天数
  useEffect(() => {
    const calendarFactory = (date) => {
      const year = date.split("-")[0];
      const month = parseInt(date.split("-")[1]);
      let daysCount = getDays(year, month);
      let startWeek = getWeeks(year, month);
      let datelists = [];
      Array.from(new Array(daysCount), (val, index) => {
        const dateitem = `${year}-${fillZero(month)}-${fillZero(index + 1)}`;
        // 是否能操作
        let disabled = judgeIsDisable(dateitem);
        // 是否能新增编辑
        let isedit = judgeIsEdit(dateitem);
        // 当前选中
        const isselect = date === dateitem ? true : false;
        // 当前日期是否有值
        let isipt = false;
        let newPatients = "";
        let saleBoxes = "";
        let prescriptionPatients = "";
        let rowid = "";
        const filterList = lists.filter((list) => list.date === dateitem);
        if (filterList.length > 0) {
          isipt = true;
          newPatients = filterList[0].newPatients;
          saleBoxes = filterList[0].saleBoxes;
          prescriptionPatients = filterList[0].prescriptionPatients;
          rowid = filterList[0].id;
        }
        const item = {
          value: fillZero(index + 1),
          disabled: disabled,
          date: dateitem,
          isselect: isselect,
          isipt: isipt,
          isedit: isedit,
          rowid: rowid,
          prescriptionPatients: prescriptionPatients,
          saleBoxes: saleBoxes,
          newPatients: newPatients,
        };
        datelists.push(item);
      });
      let placeholders = [];
      switch (startWeek) {
        case 0:
          placeholders = Array.from(new Array(6), (val, index) => index);
          break;
        default:
          placeholders = Array.from(
            new Array(startWeek - 1),
            (val, index) => index
          );
      }
      return {
        datelists,
        placeholders,
      };
    };
    if (current) {
      let value = calendarFactory(current);
      setPlaceholders([...value.placeholders]);
      setDateLists([...value.datelists]);
    }
  }, [current, lists, nowdatestamp]);

  // 判断当前时间
  const judgeNowDate = () => {
    let year = current.split("-")[0];
    let month = parseInt(current.split("-")[1]);
    const nowyear = moment().get("year");
    const nowmonth = moment().get("month") + 1;
    if (parseInt(year) === nowyear && month === nowmonth) {
      return true;
    }
    return false;
  };

  const EMAIL_REG = /^([1-9]\d*|0)$/;
  const defalut = {
    helperText: "输入不合法！",
    validator: (value) => EMAIL_REG.test(value),
    validateTriggers: ["onInput"],
  };

  // 所属大区
  const curarea = useInput({
    initValue: area.areaName,
    ...defalut,
  });
  // 当日处方患者数：
  const medicine = useInput({
    initValue: "",
    ...defalut,
  });

  // 当日新患者数：
  let people = useInput({
    initValue: "",
    ...defalut,
  });

  // 当日销售盒数：
  const sale = useInput({
    initValue: "",
    ...defalut,
  });

  // 点击当前时间
  const clickDateLi = (item) => {
    if (item.disabled) {
      return;
    }
    if (!item.isedit && !item.isipt) {
      return;
    }
    setCurrent(item.date);
    if (item.isipt) {
      setRowId(item.rowid);
      medicine.setIptValue(item.newPatients);
      sale.setIptValue(item.saleBoxes);
      people.setIptValue(item.prescriptionPatients);
      if (item.isedit) {
        // 编辑
        setBtnStatus(0);
      } else {
        // 查看
        setBtnStatus(2);
      }
    } else {
      setBtnStatus(1);
      handleCancle();
      setIsfocus(!isfocus);
    }
  };

  // 切换月份
  const changeDate = (type) => {
    let year = current.split("-")[0];
    let month = parseInt(current.split("-")[1]);
    let currentdate = "";
    let currentmonth = "";
    switch (type) {
      case 1:
        if (month === 1) {
          year = parseInt(year) - 1;
          month = 12;
        } else {
          month--;
        }
        currentdate = `${year}-${fillZero(month)}-01`;
        currentmonth = `${year}-${fillZero(month)}`;
        break;
      case 2:
        if (!judgeNowDate()) {
          if (month === 12) {
            year = parseInt(year) + 1;
            month = 1;
          } else {
            month++;
          }
          currentdate = `${year}-${fillZero(month)}-01`;
          currentmonth = `${year}-${fillZero(month)}`;
        }
        break;
      default:
        break;
    }
    setQueryMonth(currentmonth);
    setCurrent(currentdate);
  };

  const handleEdit = () => {
    alert("提示", "确定要修改数据?", [
      { text: "取消", onPress: () => console.log("cancel") },
      { text: "确定", onPress: () => setBtnStatus(1) },
    ]);
  };

  const handleAdd = () => {
    if (sale.attr.error || people.attr.error || medicine.attr.error) {
      return;
    }
    const valuesale = sale.attr.value;
    const valuepeople = people.attr.value;
    const valuemedicine = medicine.attr.value;
    if (!EMAIL_REG.test(valuemedicine)) {
      medicine.setIptError(true);
      return;
    }
    if (!EMAIL_REG.test(valuepeople)) {
      people.setIptError(true);
      return;
    }
    if (!EMAIL_REG.test(valuesale)) {
      sale.setIptError(true);
      return;
    }
    let param = {
      areaId: area.id,
      date: current,
      newPatients: valuemedicine,
      prescriptionPatients: valuepeople,
      saleBoxes: valuesale,
    };
    rowid && (param.id = rowid);
    submitData(param);
  };

  const handleCancle = () => {
    medicine.setIptValue("");
    sale.setIptValue("");
    people.setIptValue("");
    medicine.setIptError(false);
    sale.setIptError(false);
    people.setIptError(false);
    setRowId(0);
  };

  const goPage = () => {
    history.push("/fillalltotal");
  };

  const submitData = async (param) => {
    const params = {
      ...param,
    };
    try {
      const result = await api.salesmanAdd(params);
      if (result.resultCode === 0) {
        Toast.info("操作成功");
        setTimeout(() => {
          setRefresh(!isrefresh);
        }, 1000);
      } else {
        Toast.info(result.errorMsg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    clearUserToken();
    const config = companyConfig();
    window.location.replace(config.redirecturl2)
  }

  return (
    <div className="page iptdata-page">
      <Helmet>
        <title>纯销填报</title>
      </Helmet>
      {ispower === 1 && (
        <div className="iptdata-wrapper">
          <div className="iptdata-bg"></div>
          <div className="content-wrapper">
            <div className="content-bg">
              <div className="iptdata-content">
                <div className="calendar-wrapper">
                  <div className="calendar-header">
                    <span
                      className={`calendar-btn ${prevstatus ? "disabled" : ""}`}
                      onClick={() => changeDate(1)}
                    >
                      <i className="iconfont icon-fanhui1"></i>
                    </span>
                    <div className="calendar-date">
                      {handleDateTitle(current, 1)}
                    </div>
                    <span
                      className={`calendar-btn ${
                        judgeNowDate() ? "disabled" : ""
                      }`}
                      onClick={() => changeDate(2)}
                    >
                      <i className="iconfont icon-fanhui1 right"></i>
                    </span>
                  </div>
                  <div className="calendar-content">
                    <ul className="week-ul">
                      {weeks.map((week, index) => (
                        <li className="week-li-item" key={String(index)}>
                          <span className="week-li">{week.name}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="date-ul">
                      {placeholders.map((item, index) => (
                        <li className="date-li-item" key={String(index)}></li>
                      ))}
                      {dateLists.map((item, index) => (
                        <li
                          className={`date-li-item ${
                            item.isedit ? "isedit" : ""
                          } ${item.date === nowdatestamp ? "radius" : ""} ${
                            item.date === lastdatestamp ? "left-radius" : ""
                          }`}
                          key={String(index)}
                          onClick={() => clickDateLi(item)}
                        >
                          <div
                            className={`date-li ${
                              item.disabled ? "disabled" : ""
                            } ${item.isselect ? "isselect" : ""} ${
                              item.isipt ? "isipt" : ""
                            }`}
                          >
                            {item.value}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="form-wrapper">
                  <div className="form-li form-li-title">
                    <span className="title">填报数据如下：</span>
                    <span className="date">
                      所选日期 {handleDateTitle(current, 2)}
                    </span>
                  </div>
                  <ul className="form-ul">
                    <li className="form-li">
                      <InputItem
                        {...curarea.attr}
                        label="所属大区："
                        type="text"
                        name="area"
                        disabled={true}
                      />
                    </li>
                    <li className="form-li">
                      <InputItem
                        {...medicine.attr}
                        label="当日处方患者数："
                        type="number"
                        name="medicine"
                        disabled={btnstatus !== 1 ? true : false}
                        isfocus={btnstatus === 1 ? true : false}
                        statusfocus={isfocus}
                      />
                    </li>
                    <li className="form-li">
                      <InputItem
                        {...people.attr}
                        label="当日新患者数："
                        type="number"
                        name="people"
                        disabled={btnstatus !== 1 ? true : false}
                      />
                    </li>
                    <li className="form-li">
                      <InputItem
                        {...sale.attr}
                        label="当日销售盒数："
                        type="number"
                        name="sale"
                        disabled={btnstatus !== 1 ? true : false}
                      />
                    </li>
                  </ul>
                </div>
              </div>

              {btnstatus === 1 && (
                <div className="iptdata-btns">
                  <div className="btn cancle-btn" onClick={goPage}>
                    取消
                  </div>
                  <div
                    className="btn"
                    onClick={() => {
                      handleAdd();
                    }}
                  >
                    确定
                  </div>
                </div>
              )}
              {btnstatus === 0 && (
                <div className="iptdata-btns">
                  <div
                    className="edit-btn"
                    onClick={() => {
                      handleEdit();
                    }}
                  >
                    修改
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {ispower === 2 && (
        <div className="iptpower-wrapper">
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

export default IptAllTotal;
