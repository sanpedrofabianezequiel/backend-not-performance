"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBooks = exports.ETestament = void 0;
var typeorm_1 = require("typeorm");
var ETestament;
(function (ETestament) {
    ETestament["OT"] = "OT";
    ETestament["NT"] = "NT";
})(ETestament = exports.ETestament || (exports.ETestament = {}));
var IBooks = /** @class */ (function () {
    function IBooks() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
        __metadata("design:type", Number)
    ], IBooks.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ type: "int", unique: true }),
        __metadata("design:type", Number)
    ], IBooks.prototype, "number", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], IBooks.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: "2" }),
        __metadata("design:type", String)
    ], IBooks.prototype, "testament", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: "191" }),
        __metadata("design:type", String)
    ], IBooks.prototype, "slug", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'bigint' }),
        __metadata("design:type", Number)
    ], IBooks.prototype, "number_chapters", void 0);
    IBooks = __decorate([
        (0, typeorm_1.Entity)()
    ], IBooks);
    return IBooks;
}());
exports.IBooks = IBooks;
