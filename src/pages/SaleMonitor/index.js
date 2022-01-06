import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import NP from "number-precision";
import EchartBarList from "@/components/EchartBarList";
import TableList from "@/components/TableList";
import EchartPie from "@/components/EchartPie";
import { getPercentValue } from "@/libs/index";
import * as api from "@/api/user";
import "./style.less";
const columns_ranks = [
  {
    title: "排名",
    key: "rank",
  },
  {
    title: "销售大区",
    key: "name",
  },
  {
    title: "实销(盒)",
    key: "current",
  },
  {
    title: "目标(盒)",
    key: "target",
  },
  {
    title: "达成率",
    key: "scale",
  },
];

const SaleMonitor = () => {
  const nowyear = new Date().getFullYear();
  const [year, setYear] = useState(nowyear);
  // 月度纯销趋势
  const [lists_mcx, setListMcx] = useState([]);
  // 纯销达成率大区排名(盒)
  const [lists_sells, setListSells] = useState([]);
  // 纯销大区占比(盒)
  const [lists_piesells, setListPieSells] = useState([]);
  const [saleLastDate, setSaleLastDate] = useState("");

  useEffect(() => {
    const getSalesData = async () => {
      const result = await api.largescreenSales();
      if (result.resultCode === 0) {
        const data = result.data;
        const monthSalesList = Array.isArray(data.monthSalesList)
          ? data.monthSalesList
          : [];
        const regionSalesVoList = Array.isArray(data.regionSalesVoList)
          ? data.regionSalesVoList
          : [];

        let temp_data_sells = regionSalesVoList.sort((a, b) => {
          return b.sales - a.sales;
        });

        // 截至日期
        if (data.effectiveDataMonth) {
          let effectiveDataMonth = data.effectiveDataMonth
            .replace(/-/g, "/")
            .split(" ")[0];
          setSaleLastDate(effectiveDataMonth);
          setYear(data.effectiveDataMonth.split("-")[0]);
        }
        // 大区达成率排名
        let temp_lists_sells = temp_data_sells.map((item, index) => {
          return {
            ...item,
            name: item.regionName,
            target: item.targetSales,
            current: item.sales,
            scalevalue:
              item.targetSales === 0 ? 0 : item.sales / item.targetSales,
            scale:
              item.targetSales === 0
                ? "0%"
                : NP.strip(
                    parseFloat(
                      (
                        (item.sales / item.targetSales).toFixed(4) * 100
                      ).toFixed(2)
                    )
                  ) + "%",
          };
        });

        temp_lists_sells = temp_lists_sells.sort((a, b) => {
          return b.scalevalue - a.scalevalue;
        });

        temp_lists_sells.map((item, index) => {
          item.rank = index + 1;
        });

        setListSells([...temp_lists_sells]);

        // 大区占比
        const salesArr = temp_data_sells.map((item) => {
          return parseInt(item.sales);
        });

        const temp_lists_piesells = temp_data_sells.map((item, index) => {
          return {
            name: item.regionName,
            value: item.sales,
            scale: getPercentValue(salesArr, index, 2) + "%",
          };
        });

        setListPieSells([...temp_lists_piesells]);

        // 月度纯销趋势
        const data_mcx = handleMcxData(monthSalesList);
        data_mcx.sort((a, b) => {
          return a.sort - b.sort;
        });
        setListMcx([...data_mcx]);
      }
    };

    getSalesData();
  }, []);

  const handleMcxData = (res) => {
    let data = Array.isArray(res) ? res : [];
    if (data.length) {
      const echartdata = data.map((item) => {
        return {
          value: parseInt(item.value),
          datestr: `${item.name.split("-")[0]}/${item.name.split("-")[1]}`,
          monthstr: `${parseInt(item.name.split("-")[1])}月`,
          month: `${parseInt(item.name.split("-")[1])}`,
          sort: `${parseInt(item.name.split("-")[1])}`,
        };
      });
      // return echartdata
      return echartdata.filter((item) => item.value > 0);
    }
    return data;
  };

  return (
    <div className="page detail-page">
      <Helmet>
        <title>纯销监测</title>
      </Helmet>
      <div>
        <EchartBarList
          result={lists_mcx}
          title="月度纯销趋势"
          unit="盒"
          stitle="纯销累计"
          nowyear={year}
          endtime={saleLastDate}
        />
        <EchartPie
          endtime={saleLastDate}
          title="纯销大区占比"
          unit="盒"
          lists={lists_piesells}
        />
        <TableList
          endtime={saleLastDate}
          title="纯销达成率大区排名"
          columns={columns_ranks}
          lists={lists_sells}
        />
      </div>
    </div>
  );
};

export default SaleMonitor;
