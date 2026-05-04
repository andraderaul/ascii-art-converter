import Anthropic from '@anthropic-ai/sdk'
import { AuthError, NetworkError, ParseError, QuotaError } from '../errors'

const PROMPT = `You are SENTINEL, a tactical surveillance AI on a cyberpunk grid.
Incoming feed: ASCII-rendered visual. Analyze. Classify. Report.
Write 2 to 4 short declarative sentences. Cold and precise. Observe and infer — do not advise or recommend. Incomplete sentences are acceptable. There is tension even in low-threat reads.
Assign Threat Level: LOW, MODERATE, HIGH, CRITICAL, or UNKNOWN.
Extract 3 to 5 tags. Tactical identifiers only. Codename style, not generic descriptions.
Respond in JSON only: {"description":"...","threatLevel":"...","tags":["..."]}`

export class AnthropicAdapter {
  private client: Anthropic

  constructor(key: string) {
    // dangerouslyAllowBrowser: user supplies their own key; it stays in localStorage, never hits our servers — see ADR 0003
    this.client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
  }

  async analyze(base64: string): Promise<unknown> {
    let response: Anthropic.Message
    try {
      response = await this.client.messages.create(
        {
          model: 'claude-opus-4-7',
          max_tokens: 256,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: 'image/png', data: base64 },
                },
                { type: 'text', text: PROMPT },
              ],
            },
          ],
        },
        { signal: AbortSignal.timeout(30_000) },
      )
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 401 || status === 403) {
        throw new AuthError()
      }
      if (status === 429) {
        throw new QuotaError()
      }
      throw new NetworkError()
    }

    const block = response.content[0]
    const text = block.type === 'text' ? block.text : ''
    try {
      return JSON.parse(text)
    } catch {
      throw new ParseError()
    }
  }
}
