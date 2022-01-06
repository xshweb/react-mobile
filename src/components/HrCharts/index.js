import React from "react";
import "./style.less";
import HrItem from "@/components/HrItem";
const HrCharts = React.memo(({ lists }) => {
  return (
    <div className="hrcharts-page">
      <div className="hrcharts-wrapper">
        {lists.map((item, index) => (
          <HrItem key={String(index)} data={item} />
        ))}
        <ul className="legend-ul">
          <li className="legend-li">
            <div className="icon"></div>
            <div className="text">待招</div>
          </li>
          <li className="legend-li">
            <div className="icon"></div>
            <div className="text">offer中</div>
          </li>
          <li className="legend-li">
            <div className="icon"></div>
            <div className="text">在岗</div>
          </li>
        </ul>
      </div>
    </div>
  );
});

export default HrCharts;
