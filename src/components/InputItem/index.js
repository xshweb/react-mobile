import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./style.less";

function useAutofocus(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        if (props.isfocus) {
          node.focus();
        }
      }
    },
    // eslint-disable-next-line
    [props.isfocus, props.statusfocus]
  );
  return ref;
}

function Input({
  label,
  type,
  helperText,
  error,
  name,
  isfocus,
  statusfocus,
  ...otherProps
}) {
  const iptdom = useAutofocus({
    isfocus: isfocus,
    statusfocus: statusfocus
  });
  return (
    <div className="input-wrapper">
      <div className="input-box">
        <span className="input-label">{label}</span>
        <div className="input-item">
          <input
            {...otherProps}
            type={type}
            name={name}
            className="ipt"
            ref={iptdom}
          />
        </div>
      </div>
      {error && <p className="input-error">{helperText}</p>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
};

export default Input;
