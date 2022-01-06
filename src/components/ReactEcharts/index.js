import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./style.less";
const ReactEcharts = (props) => {
  const main = useRef(null);
  useEffect(() => {
    let echartInstance =
      echarts.getInstanceByDom(main.current) || echarts.init(main.current);
    const defaultOption = {};
    const option = { ...props.option, defaultOption };
    option && echartInstance.setOption(option);
  }, [props.option]);
  return <div className="mychart" ref={main}></div>;
};

export default ReactEcharts;
