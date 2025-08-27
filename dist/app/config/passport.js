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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const env_1 = require("./env");
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const user_interface_1 = require("../modules/user/user.interface");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        const isGoogleAuthenticated = user.auths.some((auth) => auth.provider === user_interface_1.AuthProvider.GOOGLE);
        if (isGoogleAuthenticated && !user.password) {
            return done(null, false, {
                message: "User already authenticated with Google. If you want to login with credentials then login with Google and set a password.",
            });
        }
        //TODO:--> check if user loggedin with Facebook or other auth provider
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return done(null, false, { message: "Invalid password" });
        }
        if (user.isDeleted) {
            return done(null, false, { message: "User is deleted" });
        }
        if (user.isBlocked) {
            return done(null, false, { message: "User is blocked" });
        }
        if (!user.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        user.lastLogin = new Date();
        yield user.save();
        return done(null, user, { message: "User logged in successfully" });
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "Email not found" });
        }
        let user = yield user_model_1.default.findOne({ email });
        if (!user) {
            user = yield user_model_1.default.create({
                email,
                name: profile.displayName || ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName),
                picture: (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0].value,
                isVerified: true,
                auths: [
                    {
                        provider: user_interface_1.AuthProvider.GOOGLE,
                        providerId: profile.id,
                    },
                ],
                lastLogin: new Date(),
            });
        }
        if (!user.auths.find((auth) => auth.provider === user_interface_1.AuthProvider.GOOGLE)) {
            user.picture = (_d = profile.photos) === null || _d === void 0 ? void 0 : _d[0].value;
            user.auths.push({
                provider: user_interface_1.AuthProvider.GOOGLE,
                providerId: profile.id,
            });
            yield user.save();
        }
        return done(null, user, { message: "User logged in successfully" });
    }
    catch (error) {
        return done(error);
    }
})));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
