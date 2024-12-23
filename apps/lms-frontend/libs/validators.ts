import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PasswordStrengthErrors } from './types'

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const errors: PasswordStrengthErrors = {};

    // Check minimum length
    if (value.length < 8) {
      errors.minLength = true;
    }

    // Check for uppercase letters
    if (!/[A-Z]/.test(value)) {
      errors.upperCase = true;
    }

    // Check for lowercase letters
    if (!/[a-z]/.test(value)) {
      errors.lowerCase = true;
    }

    // Check for numbers
    if (!/\d/.test(value)) {
      errors.numbers = true;
    }

    // Check for special characters
    if (!/[\W_]/.test(value)) {
      errors.specialCharacters = true;
    }

    return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
  };
}

export function passwordMatchValidator(control: AbstractControl) {
  return control.get('password')?.value ===
    control.get('confirmPassword')?.value
    ? null
    : { mismatch: true };
}

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[a-zA-Z'-]+\s[a-zA-Z'-]+$/;
    const validFullName = regex.test(control.value);
    return validFullName ? null : { invalidFullName: true };
  };
}

export function eachWordShouldBeginWithCapital(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fullName = (control.value as string) || '';
    if (!fullName) {
      return null;
    }
    for (const word of fullName.split(' '))
      if (word[0] == undefined || word[0] == word[0].toLowerCase())
        return { eachWordShouldBeginWithCapital: true };
    return null;
  };
}

export function onlyAlphabeticalCharactersAndSpaceAllowed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!((control.value as string) || '').match(regex))
      return { onlyAlphabeticalCharactersAndSpaceAllowed: true };
    return null;
  };
}
