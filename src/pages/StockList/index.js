import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import * as api from "@/api/user";
import "./style.less";

const StockList = () => {
  const [lists, setLists] = useState([]);
  const [stocktime, setStockTime] = useState('');
  useEffect(() => {
    // 项目
    const getData = async () => {
      const result = await api.stockList();
      if (result.resultCode === 0) {
        const data = result.data;
        const stocks = Array.isArray(data.stocks) ? data.stocks : [];
        const deadLineDate = data.deadLineDate
        const lastUpdate = deadLineDate
          ? deadLineDate.split(' ')[0].replace(/-/g, "/")
          : '';
        setStockTime(lastUpdate);
        setLists([...stocks]);
      }
    };
    getData();
  }, []);


  return (
    <div className="page stocklist-page">
      <Helmet>
        <title>库存监测</title>
      </Helmet>
      <div className="stocklist-wrapper">
        <div className="stocklist-title">
          <div className="title-txt">生产库存有效期统计</div>
          <div className="title-time">截止 {stocktime}</div>
        </div>
        <div className="stocklist-content">
          <div
            className="list-item first"
          >
            <span className="list-item-td">到期年月</span>
            <span className="list-item-td">库存盒数(盒)</span>
          </div>
          {lists.map((item, index) => (
            <div
              className="list-item"
              key={index}
            >
              <span className="list-item-td">{item.month ? item.month.replace('-', '年') + '月' : ''}</span>
              <span className="list-item-td">{item.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockList;
