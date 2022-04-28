import moment from "moment"

const createStringFromDate = (date: any) =>
        moment(date).format("YYYY-MM-DD");

const createDateFromString = (input:any) =>
        moment(input, "YYYY-MM-DD").toDate()

export {createStringFromDate, createDateFromString}
