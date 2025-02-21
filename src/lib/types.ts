export interface Source {
    id: string |number
    title: string
    content: string
    url: string
    date: string
    domain?: string
    favicon: string
  }
  
  export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    isLoading?: boolean
    sources?: Source[];
  }