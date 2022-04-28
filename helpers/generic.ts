export const generateSlug = (input:any) => input.toLowerCase().trim().replace(/ /g, "-");
export const calcNumberOfPages = (limit:number, totalItems:number):number => {
    if (limit == -1) return 1;
    return totalItems % limit == 0 ? (totalItems / limit) : (totalItems / limit) + 1;
};
