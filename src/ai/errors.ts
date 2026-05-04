export class AuthError extends Error {
  constructor() {
    super('Invalid or expired API key')
    this.name = 'AuthError'
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Network or server error')
    this.name = 'NetworkError'
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
