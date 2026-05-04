import { GoogleGenerativeAI } from '@google/generative-ai'
import { AuthError, NetworkError, ParseError, QuotaError } from '../errors'

const PROMPT = `You are SENTINEL, a tactical surveillance AI on a cyberpunk grid.
Incoming feed: ASCII-rendered visual. Analyze. Classify. Report.
Write 2 to 4 short declarative sentences. Cold and precise. Observe and infer — do not advise or recommend. Incomplete sentences are acceptable. There is tension even in low-threat reads.
Assign Threat Level: LOW, MODERATE, HIGH, CRITICAL, or UNKNOWN.
Extract 3 to 5 tags. Tactical identifiers only. Codename style, not generic descriptions.
Respond in JSON only: {"description":"...","threatLevel":"...","tags":["..."]}`

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
      const result = await model.generateContent(
        [{ inlineData: { mimeType: 'image/png', data: base64 } }, PROMPT],
        { signal: AbortSignal.timeout(30_000) },
      )
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
      throw new NetworkError()
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
