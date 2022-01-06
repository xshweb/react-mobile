import React from "react";
import "./style.less";
const TableList = (props) => {
  return (
    <div className="li-shadow">
      <div className="table-title">
        <div className="title">
          <span className="txt">{props.title}</span>
        </div>
        <span className="remark">截至{props.endtime}</span>
      </div>
      <div className="tablelist-content">
        <div className="list-charts-wrapper list-charts-left">
          <ul className="list-charts-ul list-charts-head">
            {props.columns.map((item, index) => (
              <li className="list-charts-li" key={String(index)}>
                {item.title}
              </li>
            ))}
          </ul>
          <div className="list-charts-body-wrapper">
            {props.lists.map((list, index) => (
              <ul
                className="list-charts-ul list-charts-body"
                key={String(index)}
              >
                {props.columns.map((column) => (
                  <li className="list-charts-li" key={column.key}>
                    {list[column.key]}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableList;
