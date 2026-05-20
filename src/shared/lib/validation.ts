export interface ValidationError {
  price?: string;
  ownershipDurationValue?: string;
  usesPerWeek?: string;
  resaleValue?: string;
}

export interface ValidationWarning {
  usesPerWeek?: string;
  resaleValue?: string;
}

export function validateCalculationInput(inputs: {
  price: number;
  ownershipDurationValue: number;
  usesPerWeek: number;
  resaleValue: number;
  maintenanceCost: number;
}): {
  errors: ValidationError;
  warnings: ValidationWarning;
  isValid: boolean;
} {
  const errors: ValidationError = {};
  const warnings: ValidationWarning = {};

  // Price validation
  if (inputs.price === undefined || isNaN(inputs.price) || inputs.price <= 0) {
    errors.price = 'Enter a valid price.';
  }

  // Duration validation
  if (inputs.ownershipDurationValue === undefined || isNaN(inputs.ownershipDurationValue) || inputs.ownershipDurationValue <= 0) {
    errors.ownershipDurationValue = 'Duration is required.';
  }

  // Usage validation
  if (inputs.usesPerWeek === undefined || isNaN(inputs.usesPerWeek) || inputs.usesPerWeek <= 0) {
    errors.usesPerWeek = 'Usage must be greater than zero.';
  } else if (inputs.usesPerWeek > 21) {
    warnings.usesPerWeek = 'This usage estimate seems unusually high. You can still continue.';
  }

  // Resale value validation
  if (inputs.resaleValue > inputs.price + inputs.maintenanceCost) {
    errors.resaleValue = 'Resale value is higher than product cost. Please check your input.';
  }

  return {
    errors,
    warnings,
    isValid: Object.keys(errors).length === 0,
  };
}
export default validateCalculationInput;
