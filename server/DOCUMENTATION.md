# Server Documentation Standards

This project uses **TSDoc** format for all code comments. All documentation is written in **English**.

## What to Document

**Required**: All exported functions, classes, utilities, middleware, and controllers.

## TSDoc Format

```typescript
/**
 * Brief description (one sentence).
 *
 * @param paramName - Description of the parameter
 * @returns Description of return value
 * @throws {ErrorType} When this error is thrown
 *
 * @remarks
 * Additional important notes
 */
```

### Common Tags

- `@param` - Function parameters
- `@returns` - Return values
- `@throws` - Possible errors
- `@remarks` - Important notes
- `@example` - Usage examples (optional)

## Example

```typescript
/**
 * Retrieves the authenticated user's settings.
 *
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 * @returns User settings (id, firstName, lastName, username, birthDate, gender)
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If user is not found
 */
export const getUserSettings = async (req: Request, res: Response) => {
  // ...
};
```

## Inline Comments

Use `//` for complex logic only. Focus on "why" not "what".

- ✅ **Good**: `// Identical message to prevent email enumeration (security)`
- ❌ **Bad**: `// Check if user exists`

## Rules

- ✅ All comments in English
- ✅ TSDoc for all exports
- ❌ No temporary DEBUG comments
- ❌ No comments that repeat the code

## Resources

- [TSDoc Documentation](https://tsdoc.org/)
- See existing code in this repository for more examples
