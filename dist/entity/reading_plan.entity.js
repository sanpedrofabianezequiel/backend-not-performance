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
exports.IReadingPlans = exports.enumStatus = void 0;
var typeorm_1 = require("typeorm");
var enumStatus;
(function (enumStatus) {
    enumStatus["PENDING"] = "pending";
    enumStatus["RUNNING"] = "running";
    enumStatus["FINISHED"] = "finished";
})(enumStatus = exports.enumStatus || (exports.enumStatus = {}));
var IReadingPlans = /** @class */ (function () {
    function IReadingPlans() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
        __metadata("design:type", Number)
    ], IReadingPlans.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar"
        }),
        __metadata("design:type", String)
    ], IReadingPlans.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar'
        }),
        __metadata("design:type", String)
    ], IReadingPlans.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "date"
        }),
        __metadata("design:type", Date)
    ], IReadingPlans.prototype, "start_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "date"
        }),
        __metadata("design:type", Date)
    ], IReadingPlans.prototype, "end_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
        __metadata("design:type", String)
    ], IReadingPlans.prototype, "next_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], IReadingPlans.prototype, "days", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int"
        }),
        __metadata("design:type", Number)
    ], IReadingPlans.prototype, "amount_verses_per_day", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: enumStatus,
        }),
        __metadata("design:type", String)
    ], IReadingPlans.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int",
            default: 0,
        }),
        __metadata("design:type", Number)
    ], IReadingPlans.prototype, "amount_days_delivered", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], IReadingPlans.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'datetime'
        }),
        __metadata("design:type", Date)
    ], IReadingPlans.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.DeleteDateColumn)({
            type: 'datetime'
        }),
        __metadata("design:type", Date)
    ], IReadingPlans.prototype, "deleted_at", void 0);
    IReadingPlans = __decorate([
        (0, typeorm_1.Entity)()
    ], IReadingPlans);
    return IReadingPlans;
}());
exports.IReadingPlans = IReadingPlans;
