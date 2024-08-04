import moment from "moment";

export const currentDateTime = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
}