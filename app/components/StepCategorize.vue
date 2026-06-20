<script setup lang="ts">
const { questions, categories, addCategory, deleteCategory, assignCategory } = useQuestionBank()

const newCategoryName = ref('')
const newCategoryColor = ref('#a3d9a5')
const expandedCategoryIds = ref<Set<string | null>>(new Set([null]))

function toggleExpanded(categoryId: string | null) {
  const next = new Set(expandedCategoryIds.value)
  if (next.has(categoryId)) next.delete(categoryId)
  else next.add(categoryId)
  expandedCategoryIds.value = next
}

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
}

function handleAddCategory() {
  if (!newCategoryName.value.trim()) return
  addCategory(newCategoryName.value.trim(), newCategoryColor.value)
  newCategoryName.value = ''
  newCategoryColor.value = randomColor()
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

    <div class="flex items-start gap-4">
      <UCard
        class="w-56 shrink-0 border-2 border-dashed"
        @dragover.prevent
        @drop="handleDrop($event, null)"
      >
        <template #header>
          <button
            type="button"
            class="flex w-full items-center justify-between gap-2"
            @click="toggleExpanded(null)"
          >
            <h3 class="text-sm font-medium">Ongesorteerd</h3>
            <div class="flex items-center gap-1">
              <UBadge color="neutral" variant="subtle" size="sm">{{ questionsFor(null).length }}</UBadge>
              <UIcon
                name="i-lucide-chevron-down"
                class="size-4 transition-transform"
                :class="{ 'rotate-180': expandedCategoryIds.has(null) }"
              />
            </div>
          </button>
        </template>

        <UCollapsible :open="expandedCategoryIds.has(null)">
          <template #content>
            <div class="space-y-2 pt-1">
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
          </template>
        </UCollapsible>
      </UCard>

      <div class="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <UCard
          v-for="category in categories"
          :key="category.id"
          class="border-2 border-dashed"
          :style="{ borderColor: category.color }"
          @dragover.prevent
          @drop="handleDrop($event, category.id)"
        >
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <button
                type="button"
                class="flex flex-1 items-center justify-between gap-2"
                @click="toggleExpanded(category.id)"
              >
                <h3 class="truncate text-sm font-medium">{{ category.name }}</h3>
                <div class="flex items-center gap-1">
                  <UBadge color="neutral" variant="subtle" size="sm">{{ questionsFor(category.id).length }}</UBadge>
                  <UIcon
                    name="i-lucide-chevron-down"
                    class="size-4 transition-transform"
                    :class="{ 'rotate-180': expandedCategoryIds.has(category.id) }"
                  />
                </div>
              </button>
              <UButton
                label="×"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="deleteCategory(category.id)"
              />
            </div>
          </template>

          <UCollapsible :open="expandedCategoryIds.has(category.id)">
            <template #content>
              <div class="space-y-2 pt-1">
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
            </template>
          </UCollapsible>
        </UCard>
      </div>
    </div>
  </div>
</template>
