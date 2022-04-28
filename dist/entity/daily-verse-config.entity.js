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
exports.IDailyVerseConfig = void 0;
var typeorm_1 = require("typeorm");
var IDailyVerseConfig = /** @class */ (function () {
    function IDailyVerseConfig() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({
            type: "int",
        }),
        __metadata("design:type", Number)
    ], IDailyVerseConfig.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int",
            unique: true
        }),
        __metadata("design:type", Number)
    ], IDailyVerseConfig.prototype, "current_verse_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "int"
        }),
        __metadata("design:type", Number)
    ], IDailyVerseConfig.prototype, "qty_to_show", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: "datetime", default: null
        }),
        __metadata("design:type", Date)
    ], IDailyVerseConfig.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], IDailyVerseConfig.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.DeleteDateColumn)({
            type: "datetime"
        }),
        __metadata("design:type", Date)
    ], IDailyVerseConfig.prototype, "deleted_at", void 0);
    IDailyVerseConfig = __decorate([
        (0, typeorm_1.Entity)()
    ], IDailyVerseConfig);
    return IDailyVerseConfig;
}());
exports.IDailyVerseConfig = IDailyVerseConfig;
