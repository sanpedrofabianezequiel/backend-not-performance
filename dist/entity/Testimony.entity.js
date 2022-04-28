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
exports.ITestimonies = exports.TestimonyStatus = void 0;
var typeorm_1 = require("typeorm");
var TestimonyStatus;
(function (TestimonyStatus) {
    TestimonyStatus["PENDING"] = "pending";
    TestimonyStatus["APPROVED"] = "approved";
})(TestimonyStatus = exports.TestimonyStatus || (exports.TestimonyStatus = {}));
var ITestimonies = /** @class */ (function () {
    function ITestimonies() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
        __metadata("design:type", Number)
    ], ITestimonies.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], ITestimonies.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text"
        }),
        __metadata("design:type", String)
    ], ITestimonies.prototype, "content", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "text",
        }),
        __metadata("design:type", String)
    ], ITestimonies.prototype, "tag", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: TestimonyStatus,
            default: TestimonyStatus.PENDING
        }),
        __metadata("design:type", String)
    ], ITestimonies.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar",
        }),
        __metadata("design:type", String)
    ], ITestimonies.prototype, "created_by", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], ITestimonies.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'datetime'
        }),
        __metadata("design:type", Date)
    ], ITestimonies.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.DeleteDateColumn)({
            type: 'datetime'
        }),
        __metadata("design:type", Date)
    ], ITestimonies.prototype, "deleted_at", void 0);
    ITestimonies = __decorate([
        (0, typeorm_1.Entity)()
    ], ITestimonies);
    return ITestimonies;
}());
exports.ITestimonies = ITestimonies;
