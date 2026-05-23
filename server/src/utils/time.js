import moment from "moment-timezone";

export const getISTTime = () => {
  return moment()
    .tz("Asia/Kolkata")
    .toDate();
};