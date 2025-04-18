import { http } from "../constants/httpStatusCodes";

/**
 * Custom error class representing an intentional error.
 * This error is primarily used for testing or simulating error scenarios.
 *
 * @extends {Error}
 */
export class IntentionalError extends Error {
  /**
   * HTTP status code associated with the error.
   * Defaults to 200 (OK).
   */
  statusCode: number;

  /**
   * Type identifier for this specific error.
   * Used for type checking and error differentiation.
   */
  type: "INTENTIONAL_ERROR";

  /**
   * Constructs a new `IntentionalError` instance.
   *
   * @param {string} [message="This is an intentional error."]
   * The error message to be displayed.
   */
  constructor(message: string = "This is an intentional error.") {
    super(message); // Call the parent constructor with the message
    this.name = "IntentionalError"; // Override the name of the error
    this.statusCode = http.OK; // Default to HTTP 200 status (success)
    this.type = "INTENTIONAL_ERROR"; // Define the type for this specific error

    // Ensure proper stack trace capture in V8-based engines (Node.js, Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IntentionalError);
    }
  }
}
