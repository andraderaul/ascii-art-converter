import Anthropic from '@anthropic-ai/sdk'
import { AuthError, ParseError, QuotaError } from '../errors'

const PROMPT = `You are a futuristic cyberpunk security AI.
Analyze this visual feed — it may show a person, object, or scene rendered in ASCII format.
Provide a brief, robotic assessment of what you observe.
Determine a Threat Level: LOW, MODERATE, HIGH, CRITICAL, or UNKNOWN.
Extract 3 to 5 identifier tags.
Respond only in JSON with this exact shape: {"description":"...","threatLevel":"...","tags":["..."]}`

export class AnthropicAdapter {
  private client: Anthropic

  constructor(key: string) {
    // dangerouslyAllowBrowser: user supplies their own key; it stays in localStorage, never hits our servers — see ADR 0003
    this.client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
  }

  async analyze(base64: string): Promise<unknown> {
    let response: Anthropic.Message
    try {
      response = await this.client.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64 } },
              { type: 'text', text: PROMPT },
            ],
          },
        ],
      })
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 401 || status === 403) {
        throw new AuthError()
      }
      if (status === 429) {
        throw new QuotaError()
      }
      throw new ParseError()
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
