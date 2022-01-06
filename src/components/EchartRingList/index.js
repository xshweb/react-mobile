import React, { useState, useEffect } from "react";
import "./style.less";
import ReactEcharts from "@/components/ReactEcharts";
import { fontSize } from "@/libs";
const EchartRingList = (props) => {
  let defaultoption = {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        data: [],
      },
    ],
  };

  const [option, setOption] = useState(defaultoption);

  useEffect(() => {
    let optiondata = {
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: "#48A0FF",
            },
          },
          axisLine: {
            lineStyle: {
              width: fontSize(12),
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 0,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          data: [
            {
              value: props.data.scale,
              detail: {
                offsetCenter: ["0", "0"],
                color: "#312D37",
                fontSize: fontSize(40),
                formatter: "{value}%",
              },
            },
          ],
        },
      ],
    };
    setOption(optiondata);
  }, [props]);

  return (
    <div className="ring-li">
      <div className="ring-li-title">{props.data.name}达成</div>
      <div className="ring-li-echart">
        <ReactEcharts option={option} />
      </div>
      <div className="ring-li-content">
        <div className="li-content-item">
          <div className="item-title">目标</div>
          <div className="item-value-wrapper">
            <span className="item-value">{props.data.target}</span>
            {props.data.type === 1 ? (
              <span className="item-unit">万</span>
            ) : null}
          </div>
        </div>
        <div className="li-content-item">
          <div className="item-title">实际</div>
          <div className="item-value-wrapper">
            <span className="item-value">{props.data.current}</span>
            {props.data.currenttype === 1 ? (
              <span className="item-unit">万</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchartRingList;
