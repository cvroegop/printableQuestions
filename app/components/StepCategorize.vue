<script setup lang="ts">
const { questions, categories, addCategory, deleteCategory, assignCategory } = useQuestionBank()

const newCategoryName = ref('')
const newCategoryColor = ref('#a3d9a5')

function handleAddCategory() {
  if (!newCategoryName.value.trim()) return
  addCategory(newCategoryName.value.trim(), newCategoryColor.value)
  newCategoryName.value = ''
}

function questionsFor(categoryId: string | null) {
  return questions.value.filter((q) => q.categoryId === categoryId)
}

function handleDragStart(event: DragEvent, questionId: string) {
  event.dataTransfer?.setData('text/plain', questionId)
}

function handleDrop(event: DragEvent, categoryId: string | null) {
  const questionId = event.dataTransfer?.getData('text/plain')
  if (questionId) assignCategory(questionId, categoryId)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Stap 2 — Categoriseren</h2>

    <div class="flex items-center gap-3">
      <UInput v-model="newCategoryName" placeholder="Nieuwe categorienaam" />
      <UPopover>
        <UButton variant="outline" :style="{ backgroundColor: newCategoryColor }" class="size-8 p-0" />
        <template #content>
          <UColorPicker v-model="newCategoryColor" class="p-3" />
        </template>
      </UPopover>
      <UButton label="Categorie toevoegen" @click="handleAddCategory" />
    </div>

    <div class="flex flex-wrap gap-4">
      <UCard
        class="min-h-40 flex-1 basis-56 border-2 border-dashed"
        @dragover.prevent
        @drop="handleDrop($event, null)"
      >
        <template #header>
          <h3 class="text-sm font-medium">Ongesorteerd</h3>
        </template>

        <div class="space-y-2">
          <div
            v-for="question in questionsFor(null)"
            :key="question.id"
            class="cursor-grab rounded-md bg-(--ui-bg-elevated) px-2 py-2 text-sm"
            draggable="true"
            @dragstart="handleDragStart($event, question.id)"
          >
            {{ question.text }}
          </div>
        </div>
      </UCard>

      <UCard
        v-for="category in categories"
        :key="category.id"
        class="min-h-40 flex-1 basis-56 border-2 border-dashed"
        :style="{ borderColor: category.color }"
        @dragover.prevent
        @drop="handleDrop($event, category.id)"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium">{{ category.name }}</h3>
            <UButton
              label="×"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="deleteCategory(category.id)"
            />
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="question in questionsFor(category.id)"
            :key="question.id"
            class="cursor-grab rounded-md px-2 py-2 text-sm"
            :style="{ backgroundColor: category.color }"
            draggable="true"
            @dragstart="handleDragStart($event, question.id)"
          >
            {{ question.text }}
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
