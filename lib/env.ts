export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not set in environment variables")
  }
  return password
}

export function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set in environment variables")
  }
  if (secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters long")
  }
  return secret
}
