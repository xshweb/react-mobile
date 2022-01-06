import React, { useEffect, useContext, useState, useCallback } from "react";
import "./style.less";
function useClientRect() {
  const [rectwidth, setRectwidth] = useState(0);
  const ref = useCallback((node) => {
    if (node !== null) {
      setRectwidth(node.getBoundingClientRect().width);
    }
  }, []);
  return [rectwidth, ref];
}

const HrItem = ({ data }) => {
  let [rectwidth, ref] = useClientRect();
  let [defwidth, setDefwidth] = useState(0);
  let [sucwidth, setSucwidth] = useState(0);
  let [savwidth, setSavwidth] = useState(0);
  let [needwidth, setNeedwidth] = useState(0);

  useEffect(() => {
    function init() {
      setDefwidth(rectwidth);
      const sucscale = (data.current / data.target).toFixed(2);
      const savscale = (data.offers / data.target).toFixed(2);
      const needscale = data.needs ? 1 - savscale - sucscale : 0;
      const tempscale = 0.2;
      let tempwidth = rectwidth;
      const temp_sucwidth =
        sucscale < tempscale
          ? sucscale <= 0
            ? 0
            : tempwidth * tempscale
          : sucscale >= 1
          ? rectwidth
          : tempwidth * sucscale;
      setSucwidth(temp_sucwidth);

      const temp_savwidth =
        savscale < tempscale
          ? savscale <= 0
            ? 0
            : tempwidth * tempscale
          : savscale >= 1
          ? rectwidth
          : tempwidth * savscale;
      setSavwidth(temp_savwidth);

      const temp_needwidth =
        needscale < tempscale
          ? needscale <= 0
            ? 0
            : tempwidth * tempscale
          : needscale >= 1
          ? rectwidth
          : tempwidth * needscale;
      setNeedwidth(temp_needwidth);
    }
    init();
  }, [rectwidth, data]);
  return (
    <div className="hrline-li">
      <div className="hrline-title">{data.description}</div>
      <div className="hrline-box" ref={ref}>
        <div className="hrline-default" style={{ width: defwidth + "px" }}>
          {data.needs > 0 && (
            <div
              className="hrline-item"
              style={{
                width: needwidth + "px",
              }}
            >
              <div className="hrstatus hrstatus-need">
                <div className="hrstatus-value">{data.needs}</div>
              </div>
              {/* {data.offers > 0 && <div className="hrstatus-line"></div>} */}
            </div>
          )}

          {data.offers > 0 && (
            <div
              className="hrline-item"
              style={{
                width: savwidth + "px",
              }}
            >
              <div className="hrstatus hrstatus-saved">
                <div className="hrstatus-value andriod-flex">{data.offers}</div>
              </div>
              {/* {data.current > 0 && <div className="hrstatus-line"></div>} */}
            </div>
          )}
          {data.current > 0 && (
            <div
              className="hrline-item"
              style={{
                width: sucwidth + "px",
              }}
            >
              <div className="hrstatus hrstatus-success">
                <div className="hrstatus-value andriod-flex">
                  {data.current}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="title-num">{data.target}</div>
    </div>
  );
};

export default HrItem;
