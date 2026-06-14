export interface Passage {
  id: string
  title: string
  content: string
  language: 'en' | 'zh'
  difficulty: 1 | 2 | 3
}

export interface TestResult {
  id: string
  date: string
  wpm: number
  accuracy: number
  timeUsed: number
  passageId: string
  passageTitle: string
}

export interface CharState {
  char: string
  status: 'pending' | 'correct' | 'incorrect' | 'current'
}

export interface TypingStats {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  totalTyped: number
  progress: number
}
