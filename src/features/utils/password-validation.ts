export function getPasswordValidations(
  password: string,
) {
  return {
    min: password.length >= 8,

    letter: /[a-zA-Z]/.test(password),

    number: /\d/.test(password),

    special:
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

export function isPasswordValid(
  password: string,
) {
  const validations =
    getPasswordValidations(password);

  return (
    validations.min &&
    validations.letter &&
    validations.number &&
    validations.special
  );
}