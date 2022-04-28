export const sanitizeMarkedDays = function (input:any){
    // Remove not allowed values
  const markedDaysArray = input.filter((value:any) => value >= 0 && value <= 6);
  // Order
  markedDaysArray.sort();
  
  return markedDaysArray;
}