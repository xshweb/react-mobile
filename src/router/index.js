// import { createBrowserHistory } from 'history';
import LoadableComponent from "@/components/LoadableComponent";
const Index = LoadableComponent(() => import("@/pages/Index"));
const Finance = LoadableComponent(() => import("@/pages/Finance"));
const Market = LoadableComponent(() => import("@/pages/Market"));
const Sale = LoadableComponent(() => import("@/pages/Sale"));
const ThingDetail = LoadableComponent(() => import("@/pages/ThingDetail"));
const ThingList = LoadableComponent(() => import("@/pages/ThingList"));
const Login = LoadableComponent(() => import("@/pages/Login"));
const FillLogin = LoadableComponent(() => import("@/pages/FillLogin"));
const AllTotal = LoadableComponent(() => import("@/pages/AllTotal"));
const FillAllTotal = LoadableComponent(() => import("@/pages/FillAllTotal"));
const FillData = LoadableComponent(() => import("@/pages/FillData"));
const SaleMonitor = LoadableComponent(() => import("@/pages/SaleMonitor"));
const ThingDetailPage = LoadableComponent(() => import("@/pages/ThingDetailPage"));
const StockList = LoadableComponent(() => import("@/pages/StockList"));
const defaultRoutes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: Index,
  },
  {
    path: "/finance",
    component: Finance,
  },
  {
    path: "/market",
    component: Market,
  },
  {
    path: "/sale",
    component: Sale,
  },
  {
    path: "/thingdetail",
    component: ThingDetail,
  },
  {
    path: "/salemonitor",
    component: SaleMonitor,
  },
  {
    path: "/thingdetail2",
    component: ThingDetailPage,
  },
  {
    path: "/thinglist",
    component: ThingList,
  },
  {
    path: "/alltotal",
    component: AllTotal,
  },
  {
    path: "/fillalltotal",
    component: FillAllTotal,
  },
  {
    path: "/filldata",
    component: FillData,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/filllogin",
    component: FillLogin,
  },
  {
    path: "/stocklist",
    component: StockList,
  },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  default: defaultRoutes
};
