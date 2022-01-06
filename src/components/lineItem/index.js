/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";

function useClientRect() {
  const [rectwidth, setRectwidth] = useState(0);
  const ref = useCallback((node) => {
    if (node !== null) {
      setRectwidth(node.getBoundingClientRect().width);
    }
  }, []);
  return [rectwidth, ref];
}

const ReactLineItem = (props) => {
  
  let [rectwidth, ref] = useClientRect();
  let [defwidth, setDefwidth] = useState(0);
  let [sucwidth, setSucwidth] = useState(0);
  let [savwidth, setSavwidth] = useState(0);
  // 总需求人数
  let [defvalue, setDefvalue] = useState(0);
  // 收到的offter人数
  let [sucvalue, setSucvalue] = useState(0);
  // 在岗人数
  let [savvalue, setSavvalue] = useState(0);
  let [name, setName] = useState("");
  useEffect(() => {
    setName(props.data.description);
    // console.log(rectwidth)
    setDefwidth(rectwidth);
    const sucscale = (props.data.offers / props.data.target).toFixed(2);
    const sucwidth =
      sucscale < 0.2
        ? sucscale <= 0
          ? 0
          : rectwidth * 0.2
        : sucscale >= 1
        ? rectwidth
        : rectwidth * sucscale;
    setSucwidth(sucwidth);
    const savscale = (
      (props.data.current + props.data.offers) /
      props.data.target
    ).toFixed(2);
    const savwidth =
      savscale < 0.2
        ? savscale <= 0
          ? 0
          : rectwidth * 0.2
        : savscale >= 1
        ? rectwidth
        : rectwidth * savscale;
    setSavwidth(savwidth);
    setDefvalue(props.data.target);
    setSucvalue(props.data.offers);
    setSavvalue(props.data.current);
  });

  return (
    <div className="line-li">
      <span className="line-title">{name}</span>
      <div className="line-box" ref={ref}>
        {props.data.offers > 0 && (
          <div
            className="status status-success"
            style={{
              width: sucwidth + "px",
              zIndex: 3
            }}
          >
            <span className="status-value">{sucvalue}</span>
          </div>
        )}
        {(props.data.offers > 0 || props.data.current > 0) && (
          <div
            className="status status-saved"
            style={{
              width: savwidth + "px",
              zIndex: 2
            }}
          >
            <span className="status-value">{savvalue}</span>
          </div>
        )}

        <div
          className="status status-default"
          style={{ width: defwidth + "px" }}
        ></div>
      </div>
      <span className="line-num">{defvalue}</span>
    </div>
  );
};

export default ReactLineItem;
