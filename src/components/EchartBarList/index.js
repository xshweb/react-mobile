/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./style.less";
import ReactEcharts from "@/components/ReactEcharts";
import { fontSize } from "@/libs";
const EchartLineList = (props) => {
  let defaultoption = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "",
        data: [],
        type: "bar",
      },
    ],
  };

  const [option, setOption] = useState(defaultoption);

  useEffect(() => {
    // console.log(props);
    let optiondata = {
      tooltip: {
        show: true,
        trigger: "axis",
        textStyle: {
          color: "#fff",
          fontSize: fontSize(24),
        },
        formatter: function (para) {
          const target = filterData(props.result, para[0].name);
          if (target) {
            return `${target.datestr} <br/>${target.value}${props.unit}`;
          } else {
            return `暂无数据`;
          }
        },
        backgroundColor: "rgba(72, 160, 255, 1)",
        borderColor: "#48A0FF",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        show: true,
      },
      xAxis: {
        type: "category",
        data: converAxisData(props.result),
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          fontSize: fontSize(22),
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          fontSize: fontSize(22),
        },
      },
      series: [
        {
          name: props.title,
          data: convertData(props.result),
          type: "bar",
          barWidth: fontSize(30),
          // smooth: true,
          lineStyle: {
            color: "#48A0FF",
          },
          //   areaStyle: {
          //     color: "#5FCB6D",
          //   },
          itemStyle: {
            color: "#48A0FF",
          },
          label: {
            show: true,
            position: "top",
            distance: 8,
            align: "center",
            verticalAlign: "middle",
            rotate: 0,
            formatter: "{c}",
            fontSize: fontSize(20),
            color: "#48A0FF",
          },
        },
      ],
    };
    setOption(optiondata);
  }, [props]);

  const converAxisData = (res) => {
    let data = res.length ? res.map((item) => item.monthstr) : [];
    return data;
  };

  const convertData = (res) => {
    let data = res.length ? res.map((item) => item.value) : [];
    return data;
  };

  const filterData = (lists, name) => {
    const target = lists.filter((item) => item.monthstr === name);
    return target.length > 0 ? target[0] : "";
  };

  return (
    <div className="li-shadow">
      <div className="table-title">
        <div className="title">
          <span className="txt">{props.title}</span>
          <span className="tips">({props.unit})</span>
        </div>
        <span className="remark">截至{props.endtime}</span>
      </div>
      <div className="table-content">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default EchartLineList;
