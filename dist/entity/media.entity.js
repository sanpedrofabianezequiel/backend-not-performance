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
exports.IMediaItems = void 0;
var typeorm_1 = require("typeorm");
var IMediaItems = /** @class */ (function () {
    function IMediaItems() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
        __metadata("design:type", Number)
    ], IMediaItems.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], IMediaItems.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], IMediaItems.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "tinytext"
        }),
        __metadata("design:type", String)
    ], IMediaItems.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int", default: 0
        }),
        __metadata("design:type", Number)
    ], IMediaItems.prototype, "height", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int", default: 0
        }),
        __metadata("design:type", Number)
    ], IMediaItems.prototype, "width", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int", default: 0
        }),
        __metadata("design:type", Number)
    ], IMediaItems.prototype, "size", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], IMediaItems.prototype, "url", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], IMediaItems.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime' }),
        __metadata("design:type", Date)
    ], IMediaItems.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.DeleteDateColumn)({ type: 'datetime' }),
        __metadata("design:type", Date)
    ], IMediaItems.prototype, "deleted_at", void 0);
    IMediaItems = __decorate([
        (0, typeorm_1.Entity)()
    ], IMediaItems);
    return IMediaItems;
}());
exports.IMediaItems = IMediaItems;
