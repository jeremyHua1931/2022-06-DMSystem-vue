import service from "utils/request";

/**
 * @description: 获取team列表
 * @param {*} data
 * @return {*}
 */
export const getTeams = (data) => {
  return service({
    url: "/team/getTeams",
    method: "post",
    data,
  });
};

/**
 * @description: 获取team所有成员
 * @param {*} data
 * @return {*}
 */
export const getAllTeamers = (data) => {
  return service({
    url: "/team/getAllTeamers",
    method: "post",
    data,
  });
};