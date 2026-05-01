import { GoogleGenerativeAI } from '@google/generative-ai'
import { AuthError, ParseError, QuotaError } from '../errors'

const PROMPT = `You are a futuristic cyberpunk security AI.
Analyze this visual feed — it may show a person, object, or scene rendered in ASCII format.
Provide a brief, robotic assessment of what you observe.
Determine a Threat Level: LOW, MODERATE, HIGH, CRITICAL, or UNKNOWN.
Extract 3 to 5 identifier tags.
Respond only in JSON with this exact shape: {"description":"...","threatLevel":"...","tags":["..."]}`

export class GeminiAdapter {
  private genAI: GoogleGenerativeAI

  constructor(key: string) {
    // Gemini SDK has no dangerouslyAllowBrowser flag; key stays in localStorage, never hits our servers — see ADR 0003
    this.genAI = new GoogleGenerativeAI(key)
  }

  async analyze(base64: string): Promise<unknown> {
    let text: string
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent([
        { inlineData: { mimeType: 'image/png', data: base64 } },
        PROMPT,
      ])
      text = result.response.text()
    } catch (err) {
      const msg = (err as { message?: string }).message ?? ''
      const status = (err as { status?: number }).status
      if (msg.includes('API_KEY_INVALID') || status === 401 || status === 403) {
        throw new AuthError()
      }
      if (status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
        throw new QuotaError()
      }
      throw new ParseError()
    }

    // Gemini sometimes wraps JSON in ```json blocks
    const cleaned = text
      .replace(/^```json\s*/m, '')
      .replace(/\s*```$/m, '')
      .trim()
    try {
      return JSON.parse(cleaned)
    } catch {
      throw new ParseError()
    }
  }
}
