import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as api from "@/api/user";
import "./style.less";
const ThingList = () => {
  let history = useHistory();
  // 项目数据
  const [projectdata, setProjectData] = useState([]);
  useEffect(() => {
    getProjectsData();
  }, []);
  // 项目
  const getProjectsData = async () => {
    const result = await api.projectsinfo();
    if (result.resultCode === 0) {
      const data = result.data;
      const projects = Array.isArray(data.projects) ? data.projects : [];
      setProjectData([...projects]);
    }
  };

  const goPage = (value) => {
    // history.push({pathname: '/thingdetail', state:{id: value}})
    history.push(`/thingdetail?id=${value}`)
  };

  return (
    <div className="page thinglist-page">
      <Helmet>
        <title>项目列表</title>
      </Helmet>
      <div className="thinglist-wrapper">
        <div className="thinglist-content">
          {projectdata.map((item) => (
            <div
              className="content-item-list"
              key={item.id}
              onClick={() => goPage(item.id)}
            >
              <div className="list-item">
                <span
                  className={`list-status ${
                    parseInt(item.status) === 1 ? "success" : parseInt(item.status) === 1 ? 'wait' : ''
                  }`}
                ></span>
                <span className="list-name">{item.projectName}</span>
              </div>
              <div className="list-icon">
                <i className="iconfont icon-fanhui"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThingList;
