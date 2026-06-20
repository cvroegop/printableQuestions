import { parseQuestions } from '~/utils/parseQuestions'

export interface Category {
  id: string
  name: string
  color: string
}

export interface Question {
  id: string
  text: string
  categoryId: string | null
}

const STORAGE_KEY = 'printable-questions-bank'

const questions = ref<Question[]>([])
const categories = ref<Category[]>([])
let loaded = false

function persist() {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ questions: questions.value, categories: categories.value })
  )
}

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const data = JSON.parse(raw)
    questions.value = data.questions ?? []
    categories.value = data.categories ?? []
  } catch {
    // ignore corrupt storage
  }
}

function makeId() {
  return crypto.randomUUID()
}

export function useQuestionBank() {
  load()

  watch([questions, categories], persist, { deep: true })

  function addParsedQuestions(raw: string) {
    const texts = parseQuestions(raw)
    for (const text of texts) {
      questions.value.push({ id: makeId(), text, categoryId: null })
    }
  }

  function updateQuestionText(id: string, text: string) {
    const question = questions.value.find((q) => q.id === id)
    if (question) question.text = text
  }

  function deleteQuestion(id: string) {
    questions.value = questions.value.filter((q) => q.id !== id)
  }

  function addCategory(name: string, color: string) {
    categories.value.push({ id: makeId(), name, color })
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter((c) => c.id !== id)
    for (const question of questions.value) {
      if (question.categoryId === id) question.categoryId = null
    }
  }

  function assignCategory(questionId: string, categoryId: string | null) {
    const question = questions.value.find((q) => q.id === questionId)
    if (question) question.categoryId = categoryId
  }

  return {
    questions,
    categories,
    addParsedQuestions,
    updateQuestionText,
    deleteQuestion,
    addCategory,
    deleteCategory,
    assignCategory
  }
}
