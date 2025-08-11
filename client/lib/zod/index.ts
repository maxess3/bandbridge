// Export des schémas d'authentification
export {
	formSignUpSchema,
	formLoginSchema,
	formForgotPwdSchema,
	formResetPwdSchema,
} from "./authSchema";

// Export des schémas de profil
export {
	instrumentSchema,
	formGeneralProfile,
	formInfoProfile,
	formProfilePicture,
} from "./profileSchema";

// Export des schémas de paramètres
export { formUserSettings } from "./settingsSchema";
