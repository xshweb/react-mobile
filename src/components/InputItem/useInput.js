import { useState, useEffect } from "react";

export default function useInput({
  initValue = "",
  helperText = "",
  validator = () => true,
  validateTriggers = ["onChange"],
} = {}) {
  // 保存用户输入的值，使用 initValue 作为初始值
  const [value, setValue] = useState(initValue);
  // Boolean 类型，表示当前表单项的验证状态
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  function onChange(e) {
    const { value } = e.target;

    setValue(value);

    // 根据 validateTriggers 的选项，决定是否要在 onChange 里进行校验
    if (validateTriggers.includes("onChange")) {
      setError(!validator(value));
    }
  }

  /**
   * 根据 validateTriggers 生成相应的事件处理器
   */
  function createEventHandlers() {
    const eventHandlers = {};

    validateTriggers.forEach((item) => {
      // 生成相应的事件处理器，并在其中做输入校验。
      eventHandlers[item] = (e) => {
        const { value } = e.target;
        setError(!validator(value));
      };
    });

    return eventHandlers;
  }

  const eventHandlers = createEventHandlers();

  function setIptValue (value) {
    setValue(value);
  }

  function setIptError (value) {
    setError(value);
  }

  const attr = {
    value,
    helperText,
    error,
    ...eventHandlers,
    onChange,
  }

  return {
    attr,
    setIptValue,
    setIptError
  };
  
}
