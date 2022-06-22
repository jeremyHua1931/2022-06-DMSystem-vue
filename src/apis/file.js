import service from "utils/request";

/**
 * @description: 获取team列表
 * @param {*} data
 * @return {*}
 */
export const getFiles = (data) => {
    return service({
        url: "/pdfmanager",
        method: "post",
        data,
    });
};