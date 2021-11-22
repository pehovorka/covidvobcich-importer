export const sleep = (timeout = 5000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
