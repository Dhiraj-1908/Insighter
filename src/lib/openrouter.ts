import OpenAI from 'openai'
import { OPENROUTER_API_KEY, SITE_URL, SITE_NAME } from './config'

export const openRouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': SITE_URL,
    'X-Title': SITE_NAME,
  },
  defaultQuery: {
    temperature: '0.7',
  }
})

export const DEEPSEEK_MODEL = 'deepseek/deepseek-r1-distill-llama-70b:free' 