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
  const [nextMilestone, setNextMilestone] = useState({});
  const [showtip, setShowtip] = useState(false);
  useEffect(() => {
    const id = getQueryString("id");
    getDetilData(id);
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
      const temp_milestones = Array.isArray(data.milestones)
        ? data.milestones
        : [];

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

      const milestoneNameList = nextMilestone.milestoneName
        ? nextMilestone.milestoneName.split(/\r|\n/g)
        : [];
      nextMilestone.milestoneNameList = milestoneNameList;

      


      const milestones = temp_milestones.map((item, index) => {
        const milestoneNameList = item.milestoneName
          ? item.milestoneName.split(/\n|\r/g)
          : [];
        return {
          ...item,
          milestoneNameList: milestoneNameList,
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

  return (
    <div className="page thing-page">
      <Helmet>
        <title>项目详情</title>
      </Helmet>
      <div className="thing-wrapper" onClick={() => setShowtip(false)}>
        <div className="title">
          <div className="title-item">
            <span
              className={`statusicon ${
                parseInt(detaildata.status) === 1
                  ? "success"
                  : parseInt(detaildata.status) === 0
                  ? "wait"
                  : ""
              }`}
            ></span>
            <span className="text big-text">{detaildata.projectName}</span>
            <span className="time">
              截止
              {detaildata.modifyDate
                ? detaildata.modifyDate.replace(/-/g, "/").split(" ")[0]
                : ""}
            </span>
          </div>
        </div>

        <div>
          <div className="title m-title">
            <div className="m-title-line">
              <div className="title-item">
                <span className="fonticon">
                  <i className="iconfont icon-mubiao"></i>
                </span>
                <span className="text">最终目标</span>
              </div>
            </div>
          </div>
          <ul className="child-ul">
            <li className="child-li">
              <span
                className="child-status"
                style={{ visibility: "hidden" }}
              ></span>
              <div className="child-des">
                {detaildata.targetMilestoneNameList && detaildata.targetMilestoneNameList.map((target, index) => (
                  <div className="child-des-p" key={index}>{target}</div>
                ))}
              </div>
              <div className="child-admin">
                <span className="admin-time">
                  {detaildata.deadLine
                    ? detaildata.deadLine.replace(/-/g, "/")
                    : ""}
                </span>
              </div>
            </li>
          </ul>
        </div>

        {nextMilestone.milestoneName && (
          <div>
            <div className="title m-title">
              <div className="m-title-line">
                <div className="title-item">
                  <span className="fonticon">
                    <i className="iconfont icon-lichengbei"></i>
                  </span>
                  <span className="text">当前里程碑</span>
                </div>
              </div>
            </div>
            <ul className="child-ul">
              <li className="child-li">
                <span
                  className={`child-status ${
                    parseInt(nextMilestone.status) === 0
                      ? "wait"
                      : parseInt(nextMilestone.status) === 1
                      ? "success"
                      : parseInt(nextMilestone.status) === 2
                      ? "success"
                      : parseInt(nextMilestone.status) === 3
                      ? ""
                      : parseInt(nextMilestone.status) === 4
                      ? ""
                      : ""
                  }`}
                ></span>
                <div className="child-des">
                  {nextMilestone.milestoneNameList.map(
                    (milestoneName, milestoneNameIndex) => (
                      <div
                        className="child-des-p"
                        key={String(milestoneNameIndex)}
                      >
                        {milestoneName}
                      </div>
                    )
                  )}
                </div>
                <div className="child-admin">
                  <span className="admin-name">{nextMilestone.department}</span>
                  <span className="admin-time">
                    {nextMilestone.deadLine
                      ? nextMilestone.deadLine.replace(/-/g, "/")
                      : ""}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        )}

        <div className="title m-title">
          <div className="m-title-line">
            <div className="title-item">
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
        <ul className="child-ul">
          {milestones.map((item, index) => (
            <li className="child-li" key={String(index)}>
              <span
                className={`child-status ${
                  parseInt(item.status) === 0
                    ? "wait"
                    : parseInt(item.status) === 1
                    ? "success"
                    : parseInt(item.status) === 2
                    ? "success"
                    : parseInt(item.status) === 3
                    ? ""
                    : parseInt(item.status) === 4
                    ? ""
                    : ""
                }`}
              ></span>
              <div className="child-des">
                {item.milestoneNameList.map(
                  (milestoneName, milestoneNameIndex) => (
                    <div
                      className="child-des-p"
                      key={String(milestoneNameIndex)}
                    >
                      {milestoneName}
                    </div>
                  )
                )}
              </div>
              <div className="child-admin">
                <span className="admin-name">{item.department}</span>
                <span className="admin-time">
                  {item.deadLine.replace(/-/g, "/")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Detail;
