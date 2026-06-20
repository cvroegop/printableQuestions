<script setup lang="ts">
const { questions, categories, addParsedQuestions, updateQuestionText, deleteQuestion } =
  useQuestionBank()

const pasteText = ref('')
const editingId = ref<string | null>(null)
const editingText = ref('')

function handleAdd() {
  if (!pasteText.value.trim()) return
  addParsedQuestions(pasteText.value)
  pasteText.value = ''
}

function startEdit(id: string, text: string) {
  editingId.value = id
  editingText.value = text
}

function saveEdit() {
  if (editingId.value) updateQuestionText(editingId.value, editingText.value)
  editingId.value = null
}

function categoryName(categoryId: string | null) {
  if (!categoryId) return null
  return categories.value.find((c) => c.id === categoryId)?.name ?? null
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <h2 class="text-xl font-semibold">Stap 1 — Lijst samenstellen</h2>

    <div class="space-y-2">
      <UTextarea
        v-model="pasteText"
        :rows="8"
        class="w-full"
        placeholder="Plak hier WhatsApp-export of een lijst met vragen (één per regel)..."
      />
      <UButton label="Toevoegen" @click="handleAdd" />
    </div>

    <ul class="divide-y divide-(--ui-border) rounded-md border border-(--ui-border)">
      <li
        v-for="question in questions"
        :key="question.id"
        class="flex items-center gap-2 px-3 py-2"
      >
        <UInput
          v-if="editingId === question.id"
          v-model="editingText"
          class="flex-1"
          autofocus
          @keyup.enter="saveEdit"
          @blur="saveEdit"
        />
        <template v-else>
          <span class="flex-1 cursor-pointer" @click="startEdit(question.id, question.text)">
            {{ question.text }}
          </span>
          <UBadge v-if="categoryName(question.categoryId)" color="neutral" variant="subtle">
            {{ categoryName(question.categoryId) }}
          </UBadge>
        </template>
        <UButton
          label="×"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="deleteQuestion(question.id)"
        />
      </li>
    </ul>

    <p v-if="questions.length === 0" class="text-(--ui-text-muted)">
      Nog geen vragen toegevoegd.
    </p>
  </div>
</template>
