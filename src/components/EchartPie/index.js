import React, { useState, useEffect } from "react";
import ReactEcharts from "@/components/ReactEcharts";
import { fontSize } from "@/libs";
import "./style.less";
const EchartPieItem = (props) => {
  let defaultoption = {
    series: [
      {
        name: "",
        type: "pie",
        radius: ["30%", "60%"],
        center: ["50%", "50%"],
        roseType: "radius",
        data: [],
      },
    ],
  };

  const [option, setOption] = useState(defaultoption);

  useEffect(() => {
    let optiondata = {
      title: {
        text: "大区占比",
        textStyle: {
          color: "#333",
          fontSize: fontSize(28),
          fontWeight: 400,
        },
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
        textStyle: {
          fontSize: fontSize(24),
          color: "#fff",
        },
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderColor: "rgba(0, 0, 0, 0.4)",
      },
      series: [
        {
          name: props.title,
          type: "pie",
          radius: ["30%", "55%"],
          center: ["50%", "50%"],
          roseType: "radius",
          data: props.lists,
          label: {
            show: true,
            position: "outside",
            formatter: "{d}%",
            color: "#333333",
            fontSize: fontSize(28),
          },
          labelLine: {
            smooth: 0.2,
            length: 5,
            length2: 5,
          },
          itemStyle: {
            color: function (params) {
              //自定义颜色
              var colorList = [
                "#0E6DE9",
                "#8085E9",
                "#EA3434",
                "#920783",
                "#00AF6D",
                "#E4D354",
                "#F7A35C",
                "#601986",
                "#0EE6E9"
              ];
              return colorList[params.dataIndex];
            },
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10,
          },
        },
      ],
    };
    setOption(optiondata);
  }, [props]);

  return (
    <div className="li-shadow">
      <div className="table-title">
        <div className="title">
          <span className="txt">{props.title}</span>
        </div>
        <span className="remark">截至{props.endtime}</span>
      </div>
      <div className="pie-content">
        <div className="piecharts-graph">
          <ReactEcharts option={option} />
        </div>
        <div className="piecharts-legends">
          {props.lists.map((item, index) => (
            <div className="piecharts-legend" key={String(index)}>
              <div className="legend-con">
                <span className={`legend-icon icon-bg${index}`}></span>
                <div className="legend-text">{item.name}</div>
              </div>
              <div className="legend-scale">{item.scale}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EchartPieItem;
