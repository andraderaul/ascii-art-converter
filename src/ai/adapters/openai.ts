import OpenAI from 'openai'
import { AuthError, ParseError, QuotaError } from '../errors'

const PROMPT = `You are a futuristic cyberpunk security AI.
Analyze this visual feed — it may show a person, object, or scene rendered in ASCII format.
Provide a brief, robotic assessment of what you observe.
Determine a Threat Level: LOW, MODERATE, HIGH, CRITICAL, or UNKNOWN.
Extract 3 to 5 identifier tags.
Respond only in JSON with this exact shape: {"description":"...","threatLevel":"...","tags":["..."]}`

export class OpenAIAdapter {
  private client: OpenAI

  constructor(key: string) {
    this.client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true })
  }

  async analyze(base64: string): Promise<unknown> {
    let response: OpenAI.Chat.ChatCompletion
    try {
      response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } },
            { type: 'text', text: PROMPT },
          ],
        }],
      })
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 401 || status === 403) throw new AuthError()
      if (status === 429) throw new QuotaError()
      throw new ParseError()
    }

    const text = response.choices[0]?.message?.content ?? ''
    try {
      return JSON.parse(text)
    } catch {
      throw new ParseError()
    }
  }
}
