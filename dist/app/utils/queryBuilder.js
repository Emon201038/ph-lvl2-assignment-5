"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(model, queryParams) {
        this.filters = {};
        this.populateFields = [];
        this.selectFields = [];
        this.model = model;
        this.queryParams = queryParams;
        this.populateFields = queryParams.populate
            ? queryParams.populate.split(",")
            : [];
        this.selectFields = queryParams.select ? queryParams.select.split(",") : [];
        this.mongooseQuery = this.model.find();
    }
    filter() {
        const excludedFields = [
            "search",
            "sort",
            "sortBy",
            "sortOrder",
            "limit",
            "page",
            // "sender",
            // "receiver",
            "populate",
        ];
        const filters = Object.assign({}, this.queryParams);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        excludedFields.forEach((field) => delete filters[field]);
        for (const key in filters) {
            let value = filters[key];
            if (value === "true" || value === "false") {
                filters[key] = value === "true";
            }
            // if the value is "null", null, "undefined", undefined, or empty string → remove this field
            if (value === null ||
                value === undefined ||
                value === "null" ||
                value === "undefined" ||
                value === "") {
                delete filters[key];
                continue;
            }
            filters[key] = value;
        }
        this.filters = Object.assign(Object.assign({}, this.filters), filters);
        this.mongooseQuery = this.model.find(this.filters);
        return this;
    }
    search(fields) {
        const keyword = this.queryParams.search;
        const searchFields = this.queryParams.searchFields
            ? this.queryParams.searchFields.split(",")
            : fields
                ? fields
                : [];
        if (keyword) {
            const regex = new RegExp(keyword, "i");
            const searchConditions = searchFields.map((field) => ({
                [field]: { $regex: regex },
            }));
            this.filters = Object.assign(Object.assign({}, this.filters), { $or: searchConditions });
            this.mongooseQuery = this.model.find(this.filters);
        }
        return this;
    }
    sort() {
        const { sort, sortBy, sortOrder } = this.queryParams;
        if (sort) {
            const sortFields = sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortFields);
        }
        else if (sortBy && sortOrder) {
            const order = sortOrder === "desc" ? -1 : 1;
            this.mongooseQuery = this.mongooseQuery.sort({ [sortBy]: order });
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;
        const skip = (page - 1) * limit;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
    populate(fields = []) {
        const populateFromQuery = this.queryParams.populate;
        const fieldsToPopulate = populateFromQuery
            ? populateFromQuery.split(",")
            : fields.length
                ? fields
                : [];
        fieldsToPopulate.forEach((field) => {
            // Support syntax: "author:name;email" => populate only name, email
            if (field.includes(":")) {
                const [path, select] = field.split(":");
                this.mongooseQuery = this.mongooseQuery.populate({
                    path: path.trim(),
                    select: select.split(";").join(" "), // allow "name;email"
                });
            }
            else {
                this.mongooseQuery = this.mongooseQuery.populate(field.trim());
            }
        });
        return this;
    }
    select(fields = []) {
        const selectFromQuery = this.queryParams.select;
        const fieldsToSelect = fields.length
            ? fields
            : selectFromQuery
                ? selectFromQuery.split(",")
                : [];
        if (fieldsToSelect.length > 0) {
            const projection = fieldsToSelect.join(" ");
            this.mongooseQuery = this.mongooseQuery.select(projection);
        }
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mongooseQuery;
        });
    }
    execWithMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(this.queryParams.page) || 1;
            const limit = Number(this.queryParams.limit) || 10;
            const [data, total] = yield Promise.all([
                this.mongooseQuery.exec(),
                this.model.countDocuments(this.filters),
            ]);
            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
