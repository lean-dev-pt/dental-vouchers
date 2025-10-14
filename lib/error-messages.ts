/**
 * Translates Supabase error messages to Portuguese (pt-PT)
 *
 * This utility maps common Supabase authentication and database error messages
 * from English to European Portuguese for better user experience.
 */

const ERROR_TRANSLATIONS: Record<string, string> = {
  // Authentication errors
  "Invalid login credentials": "Credenciais de login inválidas",
  "Invalid email or password": "Email ou palavra-passe inválidos",
  "Email not confirmed": "Email não confirmado",
  "User already registered": "Utilizador já registado",
  "User not found": "Utilizador não encontrado",
  "Invalid email": "Email inválido",
  "Password should be at least 6 characters": "A palavra-passe deve ter pelo menos 6 caracteres",
  "Password is too weak": "A palavra-passe é demasiado fraca",
  "Email address is invalid": "O endereço de email é inválido",
  "Email rate limit exceeded": "Limite de envio de emails excedido",
  "Password recovery requires an email": "A recuperação de palavra-passe requer um email",
  "Unable to validate email address: invalid format": "Não foi possível validar o endereço de email: formato inválido",
  "Signup requires a valid password": "O registo requer uma palavra-passe válida",
  "User already exists": "O utilizador já existe",
  "Email link is invalid or has expired": "O link de email é inválido ou expirou",
  "Token has expired or is invalid": "O token expirou ou é inválido",
  "Anonymous sign-ins are disabled": "Os logins anónimos estão desativados",
  "Invalid verification code": "Código de verificação inválido",
  "Phone number is not valid": "O número de telefone não é válido",
  "User is not allowed": "Utilizador não permitido",

  // Database errors
  "Failed to fetch": "Falha ao obter dados",
  "Network error": "Erro de rede",
  "Connection error": "Erro de conexão",
  "Database error": "Erro de base de dados",
  "Unauthorized": "Não autorizado",
  "Forbidden": "Proibido",
  "Not found": "Não encontrado",
  "Internal server error": "Erro interno do servidor",
  "Service unavailable": "Serviço indisponível",

  // Generic errors
  "An error occurred": "Ocorreu um erro",
  "Something went wrong": "Algo correu mal",
  "Failed to": "Falhou ao",
  "Unable to": "Não foi possível",
  "Error": "Erro",
  "Invalid": "Inválido",

  // Session errors
  "Session expired": "Sessão expirada",
  "Session not found": "Sessão não encontrada",
  "Invalid session": "Sessão inválida",
  "No session": "Sem sessão",

  // Rate limiting
  "Too many requests": "Demasiados pedidos",
  "Rate limit exceeded": "Limite de taxa excedido",

  // OTP/MFA errors
  "OTP expired": "OTP expirado",
  "Invalid OTP": "OTP inválido",
  "MFA required": "MFA obrigatório",
};

/**
 * Translates an error message from English to Portuguese
 *
 * @param error - The error object or message string
 * @returns The translated error message in Portuguese
 *
 * @example
 * translateError(new Error("Invalid login credentials"))
 * // Returns: "Credenciais de login inválidas"
 *
 * @example
 * translateError("Email not confirmed")
 * // Returns: "Email não confirmado"
 */
export function translateError(error: unknown): string {
  let errorMessage = "Ocorreu um erro"; // Default fallback

  // Extract message from Error object or string
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  // Try exact match first
  if (ERROR_TRANSLATIONS[errorMessage]) {
    return ERROR_TRANSLATIONS[errorMessage];
  }

  // Try partial match (case-insensitive)
  const lowerMessage = errorMessage.toLowerCase();
  for (const [englishKey, portugueseValue] of Object.entries(ERROR_TRANSLATIONS)) {
    if (lowerMessage.includes(englishKey.toLowerCase())) {
      return portugueseValue;
    }
  }

  // If no translation found, return original message (might already be in Portuguese)
  return errorMessage;
}

/**
 * Checks if an error message is likely in Portuguese
 *
 * @param message - The error message to check
 * @returns true if the message appears to be in Portuguese
 */
export function isPortugueseMessage(message: string): boolean {
  const portugueseIndicators = [
    "não",
    "é",
    "está",
    "foram",
    "senha",
    "utilizador",
    "erro",
    "inválido",
    "palavra-passe",
  ];

  const lowerMessage = message.toLowerCase();
  return portugueseIndicators.some(indicator => lowerMessage.includes(indicator));
}
