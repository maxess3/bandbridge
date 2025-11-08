/**
 * Centralized export of all Zod validation schemas.
 */

// Export authentication schemas
export {
  formSignUpSchema,
  formLoginSchema,
  formForgotPwdSchema,
  formResetPwdSchema,
} from "./authSchema";

// Export profile schemas
export {
  instrumentSchema,
  formGeneralProfile,
  formInfoProfile,
  formProfilePicture,
  searchAutocompleteSchema,
  searchQuerySchema,
} from "./profileSchema";

// Export settings schemas
export { formUserSettings } from "./settingsSchema";
