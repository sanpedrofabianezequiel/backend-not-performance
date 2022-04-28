import { getRepository } from "typeorm";
import { IBooks } from "../entity/Book.entity";

let books:any[] = [];
let booksSlugs:any[] = [];

export const loadBookInCache = async () => {
    try {
        
        const [books,totalBooks]  = await getRepository(IBooks).findAndCount({
            skip:0,
            take:10
        });
        booksSlugs = books.map(b => b.slug);
    } catch (error) {
        console.log(error);
    }
};

export const getBooksFromCache = async () => {
    if (books.length == 0) {
        await loadBookInCache();
    }
    return books;
};

export const getBooksSlugFromCache = async () => {
    if (booksSlugs.length == 0) {
        await loadBookInCache();
    }
    return booksSlugs;
};