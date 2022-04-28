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
exports.ITopics = void 0;
var typeorm_1 = require("typeorm");
var ITopics = /** @class */ (function () {
    function ITopics() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
        __metadata("design:type", Number)
    ], ITopics.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
        __metadata("design:type", String)
    ], ITopics.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 70 }),
        __metadata("design:type", String)
    ], ITopics.prototype, "slug", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], ITopics.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], ITopics.prototype, "url_image", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "tinyint", default: 1 }),
        __metadata("design:type", Number)
    ], ITopics.prototype, "enabled", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], ITopics.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'datetime'
        }),
        __metadata("design:type", Date)
    ], ITopics.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.DeleteDateColumn)({
            type: 'datetime'
        }),
        __metadata("design:type", Date)
    ], ITopics.prototype, "deleted_at", void 0);
    ITopics = __decorate([
        (0, typeorm_1.Entity)()
    ], ITopics);
    return ITopics;
}());
exports.ITopics = ITopics;
