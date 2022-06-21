import service from "utils/request";

/**
 * @description: 获取team列表
 * @param {*} data
 * @return {*}
 */
export const addDeposit = (data) => {
  return service({
    url: "/admin/good/addDeposit",
    method: "post",
    data,
  });
};


/**
 * @description: 获取team列表
 * @param {*} data
 * @return {*}
 */
export const getTeams = (data) => {
  return service({
    url: "http://10.131.167.11:8082/team/getTeams",
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
    url: "http://10.131.167.11:8082/team/getAllTeamers",
    method: "post",
    data,
  });
};