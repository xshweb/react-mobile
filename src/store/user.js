const initialState = {
  userId: 0,
  token: "",
  powerlist: [],
};

// ['sales', 'project', 'hr', 'finance']

export default function login(state = initialState, action) {
  const { type, payload } = action;
  // console.log(payload)
  switch (type) {
    case "Login":
      return {
        ...state,
        userId: payload.userId,
        token: payload.token
      };
    case "AddPower":
      let powerlist = state.powerlist;
      console.log("-----powerlist before-------");
      console.log(powerlist);
      const index = powerlist.findIndex((item) => item === payload)
      if (index === -1) {
        powerlist.push(payload)
      }
      console.log("-----powerlist after-------");
      console.log(powerlist);
      return {
        ...state,
        powerlist: [...state.powerlist, payload]
    };
    case "ReducePower":
      let rpowerlist = state.powerlist;
      console.log("-----rpowerlist before-------");
      console.log(rpowerlist);
      const rindex = rpowerlist.findIndex((item) => item === payload)
      if (rindex > -1) {
        rpowerlist.splice(rindex, 1)
      }
      console.log("-----rpowerlist after-------");
      console.log(rpowerlist);
      return {
        ...state,
        powerlist: [...rpowerlist]
    };
    default:
      return state;
  }
}
