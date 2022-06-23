import service from "utils/request";

/**
 * @description: 新建文献库
 * @param {*} data
 * @return {*}
 */
export const makelib = (data) => {
  return service({
    url: "/team/lib/makelib",
    method: "post",
    data,
  });
};