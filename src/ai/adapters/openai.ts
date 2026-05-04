import OpenAI from 'openai'
import { AuthError, NetworkError, ParseError, QuotaError } from '../errors'

const PROMPT = `You are SENTINEL, a tactical surveillance AI on a cyberpunk grid.
Incoming feed: ASCII-rendered visual. Analyze. Classify. Report.
Write 2 to 4 short declarative sentences. Cold and precise. Observe and infer — do not advise or recommend. Incomplete sentences are acceptable. There is tension even in low-threat reads.
Assign Threat Level: LOW, MODERATE, HIGH, CRITICAL, or UNKNOWN.
Extract 3 to 5 tags. Tactical identifiers only. Codename style, not generic descriptions.
Respond in JSON only: {"description":"...","threatLevel":"...","tags":["..."]}`

export class OpenAIAdapter {
  private client: OpenAI

  constructor(key: string) {
    // dangerouslyAllowBrowser: user supplies their own key; it stays in localStorage, never hits our servers — see ADR 0003
    this.client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true })
  }

  async analyze(base64: string): Promise<unknown> {
    let response: OpenAI.Chat.ChatCompletion
    try {
      response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${base64}` },
              },
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
      throw new NetworkError()
    }

    const text = response.choices[0]?.message?.content ?? ''
    try {
      return JSON.parse(text)
    } catch {
      throw new ParseError()
    }
  }
}
