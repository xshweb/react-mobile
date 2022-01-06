// 登录
export const Login = (data, callback) => async (dispatch, getState) => {
  dispatch({
    type: "Login",
    payload: data,
  });
  callback && callback();
};

// 增加权限
export const AddPower = (data, callback) => async (dispatch, getState) => {
  dispatch({
    type: "AddPower",
    payload: data
  });
  callback && callback();
};

// 解除权限
export const ReducePower = (data, callback) => async (dispatch, getState) => {
  dispatch({
    type: "ReducePower",
    payload: data
  });
  callback && callback();
};
