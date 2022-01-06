const secretid = "sessionId";

export function gotUserToken() {
  return _gotLocalStorage("gvfilluser");
}

export function setUserToken(token) {
  _setLocalStorage("gvfilluser", token);
}

export function clearUserToken() {
  _clearLocalStorage("gvfilluser");
}

function _gotLocalStorage(name) {
  const key = secretid + name;
  const data = window.localStorage.getItem(key);
  return data;
}

function _setLocalStorage(name, value) {
  const key = secretid + name;
  window.localStorage.setItem(key, value);
}

function _clearLocalStorage(name) {
  const key = secretid + name;
  window.localStorage.removeItem(key);
}
