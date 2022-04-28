"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcNumberOfPages = exports.generateSlug = void 0;
var generateSlug = function (input) { return input.toLowerCase().trim().replace(/ /g, "-"); };
exports.generateSlug = generateSlug;
var calcNumberOfPages = function (limit, totalItems) {
    if (limit == -1)
        return 1;
    return totalItems % limit == 0 ? (totalItems / limit) : (totalItems / limit) + 1;
};
exports.calcNumberOfPages = calcNumberOfPages;
