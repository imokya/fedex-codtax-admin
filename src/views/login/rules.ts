export const validatePassword = () => {
  return (
    rule: string,
    value: string,
    callback: (error: Error | void) => void
  ) => {
    if (value.length < 6) {
      callback(new Error('密码不能少于6位'));
    } else {
      callback();
    }
  };
};
