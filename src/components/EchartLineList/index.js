import React, { useState, useEffect } from "react";
import "./style.less";
import ReactEcharts from "@/components/ReactEcharts";
import { fontSize } from "@/libs";
const EchartLineList = (props) => {
  var labelOption = {
    show: true,
    position: "bottom",
    distance: 15,
    align: "center",
    verticalAlign: "middle",
    rotate: 0,
    formatter: "{b}",
    fontSize: fontSize(20),
  };

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
        type: "line",
      },
    ],
  };

  const [option, setOption] = useState(defaultoption);

  useEffect(() => {
    let optiondata = {
      tooltip: {
        show: true,
        trigger: "axis",
        textStyle: {
          color: "#fff",
          fontSize: fontSize(24),
        },
        formatter:
          "日期:" +
          props.nowyear +
          "/{b}<br/>" +
          props.stitle +
          ":{c}" +
          props.unit,
        backgroundColor: "rgba(72, 160, 255, 1)",
        borderColor: "#48A0FF",
      },
      toolbox: {
        show: false,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: converAxisData(props.result),
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          fontSize: fontSize(20),
          rotate: 45
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: props.title,
          data: convertData(props.result),
          type: "line",
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
          // markPoint: {
          //   label: {
          //     color: "#fff",
          //     fontSize: 10
          //   },
          //   data: [
          //     { type: "max", name: "最大值" },
          //     { type: "min", name: "最小值" },
          //   ],
          // },
          // markLine: {
          //   label: {
          //     color: "#48A0FF",
          //     fontSize: 10
          //   },
          //   data: [{ type: "average", name: "平均值" }],
          // },
          // label: labelOption,
        },
      ],
    };
    setOption(optiondata);
  }, [props]);

  const converAxisData = (res) => {
    let data = []
    if (res.length) {
      data = res.map((item) => item.datestr);
    }
    return data;
  };

  const convertData = (res) => {
    let data = []
    if (res.length) {
      data = res.map((item) => item.value);
    }
    return data;
  };

  return (
    <div className="li-shadow">
      <div className="table-title">
        <div className="title">
          <span className="txt">{props.title}</span>
          <span className="tips">({props.unit})</span>
        </div>
        <span className="remark">截止{props.endtime}</span>
      </div>
      <div className="table-content">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default EchartLineList;
