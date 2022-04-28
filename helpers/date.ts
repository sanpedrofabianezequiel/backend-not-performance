import moment from 'moment';

export const createDateFromString = (input:any) =>
    moment(input, "YYYY-MM-DD").toDate();

export const createStringFromDate = (date:any) =>
    moment(date).format("YYYY-MM-DD");

export const getNextDate = (dateString:any, daysString:any) => {// (Date.now(),123456)
                                                                // "2021-04-23"
    const date = createDateFromString(dateString); 
    const currentDay = date.getDay();
    //console.log('currentDay::: ', currentDay);
    const days = daysString.split('');
    //console.log(days)
    const index = days.indexOf(`${currentDay}`);
    //console.log("index :" + index)
    let daysToAdd = 0;
    //console.log("days-lenght" + days.length)
    if (index ==  days.length- 1) {

        daysToAdd = 7 - (currentDay - Number(days[0]));

    } else {

        daysToAdd = Number(days[index+1]) - currentDay;

    }
    const nextDate = moment(date).add(daysToAdd, "days").format("YYYY-MM-DD")
    return nextDate;

}
