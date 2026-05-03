export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; requirements: string[] } => {
  const requirements: string[] = [];

  if (password.length < 8) {
    requirements.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    requirements.push('At least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    requirements.push('At least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    requirements.push('At least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    requirements.push('At least one special character (!@#$%^&*)');
  }

  return {
    isValid: requirements.length === 0,
    requirements,
  };
};

// Signup form validation
export const validateSignupForm = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  agencyName: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate agency name
  if (!data.agencyName || data.agencyName.trim().length < 2) {
    errors.push({
      field: 'agencyName',
      message: 'Agency name must be at least 2 characters',
    });
  }

  // Validate email
  if (!data.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  // Validate password
  if (!data.password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push({
        field: 'password',
        message: `Password must include: ${passwordValidation.requirements.join(', ')}`,
      });
    }
  }

  // Validate password confirmation
  if (!data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Please confirm your password',
    });
  } else if (data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Login form validation
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  if (!data.password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Project form validation
export const validateProjectForm = (data: {
  name: string;
  description: string;
  clientName: string;
  clientEmail: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Project name must be at least 3 characters',
    });
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 10 characters',
    });
  }

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.push({
      field: 'clientName',
      message: 'Client name is required',
    });
  }

  if (!data.clientEmail || !validateEmail(data.clientEmail)) {
    errors.push({
      field: 'clientEmail',
      message: 'Please enter a valid client email',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get field-specific error
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find((e) => e.field === fieldName);
  return error?.message || null;
};

// Check if field has error
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((e) => e.field === fieldName);
};
