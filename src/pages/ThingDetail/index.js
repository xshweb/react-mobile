import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as api from "@/api/user";
import { Toast } from "antd-mobile";
import "./style.less";
function getQueryString(name) {
  //encodeURI decodeURI encodeURIComponent decodeURIComponent
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var index = window.location.hash.indexOf("?");
  var r = window.location.hash.substr(index + 1).match(reg);
  if (r != null) {
    return r[2];
  } else {
    return null;
  }
}
// console.log(window.location.hash);
const Detail = () => {
  const [detaildata, setDetilData] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [department, setDepartment] = useState("");
  const [nextMilestone, setNextMilestone] = useState({});
  const [showtip, setShowtip] = useState(false);
  useEffect(() => {
    const id = getQueryString("id");
    getDetilData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 项目数据详情
  const getDetilData = async (id) => {
    const params = {
      id: id,
    };
    const result = await api.projectsdetail(params);
    if (result.resultCode === 0) {
      const data = result.data;
      let nextMilestone = data.nextMilestone ? data.nextMilestone : {};
      // const temp_milestones = Array.isArray(data.milestones)
      //   ? handleData(data.milestones)
      //   : [];
      const temp_milestones = Array.isArray(data.milestones)
        ? data.milestones
        : [];
      // 主责部门
      let responsibleDep = data.responsibleDep
        ? data.responsibleDep
        : temp_milestones.length > 0
        ? temp_milestones[0].department
        : "";
      setDepartment(responsibleDep);

      const targetMilestoneNameList = data.target
        ? data.target.split(/\r|\n/g)
        : [];

      setDetilData({
        modifyDate: data.modifyDate,
        projectName: data.projectName,
        status: data.status,
        targetMilestoneNameList: targetMilestoneNameList,
        deadLine: data.deadLine,
      });

      // 当前里程碑
      const milestoneNameList = nextMilestone.milestoneName
        ? nextMilestone.milestoneName.split(/\r|\n/g)
        : [];
      nextMilestone.milestoneNameList = milestoneNameList;

      const nextDeadLine = nextMilestone.deadLine
        ? nextMilestone.deadLine.split("-")
        : [];

      nextMilestone.deadLine = nextDeadLine.length
        ? `${nextDeadLine[1]}/${nextDeadLine[2]}`
        : "";

      // 里程碑计划
      const milestones = temp_milestones.map((item) => {
        const milestoneNameList = item.milestoneName
          ? item.milestoneName.split(/\n|\r/g)
          : [];
        const mDeadLine = item.deadLine ? item.deadLine.split("-") : [];
        return {
          ...item,
          milestoneNameList: milestoneNameList,
          deadLine: mDeadLine.length ? `${mDeadLine[1]}/${mDeadLine[2]}` : "",
        };
      });
      setMilestones([...milestones]);
      setNextMilestone(nextMilestone);
    } else {
      Toast(result.errorMsg);
    }
  };

  const handleShowtip = (e) => {
    setShowtip(!showtip);
    e.stopPropagation();
  };

  const handleData = (arr) => {
    let hasMap = {};
    arr.forEach((item) => {
      if (!hasMap[item.deadLine]) {
        hasMap[item.deadLine] = item.milestoneName;
      } else {
        hasMap[item.deadLine] += "\n" + item.milestoneName;
      }
    });
    const temp = arr.map((item) => {
      return {
        ...item,
        milestoneNameStr: hasMap[item.deadLine],
      };
    });
    const target = unique(temp);
    return target;
  };

  const unique = (arr) => {
    return arr.filter(function (item, index, arr) {
      return arr.findIndex((list) => list.deadLine === item.deadLine) === index;
    });
  };

  return (
    <div className="page thing-page" onClick={() => setShowtip(false)}>
      <Helmet>
        <title>项目详情</title>
      </Helmet>
      <div className="thing-block">
        <div className="header-title">
          <span
            className={`header-statusicon ${
              parseInt(detaildata.status) === 1
                ? "success"
                : parseInt(detaildata.status) === 0
                ? "wait"
                : ""
            }`}
          ></span>
          <span className="header-text">{detaildata.projectName}</span>
          <span className="header-time">
            更新
            {detaildata.modifyDate
              ? detaildata.modifyDate.replace(/-/g, "/").split(" ")[0]
              : ""}
          </span>
        </div>
      </div>
      <div className="thing-block">
        <div className="m-title">
          <div className="m-title-line">
            <div className="m-title-item">
              <span className="fonticon">
                <i className="iconfont icon-mubiao"></i>
              </span>
              <span className="text">最终目标</span>
            </div>
            <div className="r-title-item">
              <span className="department">{department}</span>
              <span className="date">
                {detaildata.deadLine
                  ? detaildata.deadLine.replace(/-/g, "/")
                  : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          <div className="target-content">
            {detaildata.targetMilestoneNameList &&
              detaildata.targetMilestoneNameList.map((target, index) => (
                <p className="text-p" key={index}>
                  {target}
                </p>
              ))}
          </div>
        </div>
      </div>
      {nextMilestone.milestoneName ? (
        <div className="thing-block">
          <div className="m-title">
            <div className="m-title-line">
              <div className="m-title-item">
                <span className="fonticon">
                  <i className="iconfont icon-lichengbei"></i>
                </span>
                <span className="text">当前里程碑</span>
              </div>
            </div>
          </div>
          <div className="content-wrapper">
            <ul className="timeline">
              <li className="timeline-item">
                <div className="timeline-item-tail"></div>
                <div
                  className={`timeline-item-head ${
                    parseInt(nextMilestone.status) === 0
                      ? "wait"
                      : parseInt(nextMilestone.status) === 1
                      ? "success"
                      : parseInt(nextMilestone.status) === 2
                      ? "success"
                      : parseInt(nextMilestone.status) === 3
                      ? "error"
                      : parseInt(nextMilestone.status) === 4
                      ? "error"
                      : "wait"
                  }`}
                ></div>
                <div className="timeline-item-date">
                  {nextMilestone.deadLine}
                </div>
                <div className="timeline-item-content">
                  {nextMilestone.milestoneNameList.map(
                    (milestoneName, milestoneNameIndex) => (
                      <p className="text-p" key={String(milestoneNameIndex)}>
                        {milestoneName}
                      </p>
                    )
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      <div className="thing-block">
        <div className="m-title">
          <div className="m-title-line">
            <div className="m-title-item">
              <span className="fonticon">
                <i className="iconfont icon-weiwancheng"></i>
              </span>
              <span className="text">里程碑计划</span>
              <div className="tipsicon-box" onClick={handleShowtip}>
                <div className="tipsicon">
                  <i className="iconfont icon-yiwen"></i>
                  {showtip && (
                    <div className="tips-box">
                      <ul className="tips-ul">
                        <li className="tips-li">
                          <span className="tips-status success"></span>
                          <div className="tips-des">完成/进行中</div>
                        </li>
                        <li className="tips-li">
                          <span className="tips-status"></span>
                          <div className="tips-des">未完成/有风险</div>
                        </li>
                        <li className="tips-li">
                          <span className="tips-status wait"></span>
                          <div className="tips-des">未开始</div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <ul className="timeline">
            {milestones.map((item, index) => (
              <li className="timeline-item" key={String(index)}>
                <div className="timeline-item-tail"></div>
                <div
                  className={`timeline-item-head ${
                    parseInt(item.status) === 0
                      ? "wait"
                      : parseInt(item.status) === 1
                      ? "success"
                      : parseInt(item.status) === 2
                      ? "success"
                      : parseInt(item.status) === 3
                      ? "error"
                      : parseInt(item.status) === 4
                      ? "error"
                      : "wait"
                  }`}
                ></div>
                <div className="timeline-item-date">{item.deadLine}</div>
                <div className="timeline-item-content">
                  {item.milestoneNameList.map(
                    (milestoneName, milestoneNameIndex) => (
                      <p className="text-p" key={String(milestoneNameIndex)}>
                        {milestoneName}
                      </p>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Detail;
