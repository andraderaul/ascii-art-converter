export class AuthError extends Error {
  constructor() {
    super('Invalid or expired API key')
    this.name = 'AuthError'
  }
}

export class ParseError extends Error {
  constructor() {
    super('Unexpected response from AI Provider')
    this.name = 'ParseError'
  }
}

export class QuotaError extends Error {
  constructor() {
    super('API quota exceeded')
    this.name = 'QuotaError'
  }
}
