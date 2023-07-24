class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
  }
  class PropertyRequiredError extends ValidationError {
    constructor(property) {
      super("Invalid property: " + property);
      this.name = "PropertyRequiredError";
      this.property = property;
    }
  }

  exports.ValidationError = ValidationError;
  exports.PropertyRequiredError = PropertyRequiredError;