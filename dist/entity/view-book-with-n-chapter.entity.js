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
exports.IViewBookWithNChapter = void 0;
var typeorm_1 = require("typeorm");
var enumTestament;
(function (enumTestament) {
    enumTestament["OT"] = "OT";
    enumTestament["NT"] = "NT";
})(enumTestament || (enumTestament = {}));
var IViewBookWithNChapter = /** @class */ (function () {
    function IViewBookWithNChapter() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
        __metadata("design:type", Number)
    ], IViewBookWithNChapter.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int"
        }),
        __metadata("design:type", Number)
    ], IViewBookWithNChapter.prototype, "number", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], IViewBookWithNChapter.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], IViewBookWithNChapter.prototype, "slug", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: enumTestament,
            default: enumTestament.OT
        }),
        __metadata("design:type", String)
    ], IViewBookWithNChapter.prototype, "testament", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "bigint"
        }),
        __metadata("design:type", Number)
    ], IViewBookWithNChapter.prototype, "number_chapters", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], IViewBookWithNChapter.prototype, "created_at", void 0);
    IViewBookWithNChapter = __decorate([
        (0, typeorm_1.Entity)()
    ], IViewBookWithNChapter);
    return IViewBookWithNChapter;
}());
exports.IViewBookWithNChapter = IViewBookWithNChapter;
