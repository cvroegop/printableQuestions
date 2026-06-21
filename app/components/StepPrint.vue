<script setup lang="ts">
const { questions, categories } = useQuestionBank()

const CARDS_PER_PAGE = 16

interface Card {
  text: string
}

interface Group {
  categoryName: string
  cards: Card[]
}

const groups = computed<Group[]>(() => {
  const result: Group[] = []
  for (const category of categories.value) {
    const cards = questions.value
      .filter(question => question.categoryId === category.id)
      .map(question => ({ text: question.text }))
    if (cards.length > 0) {
      result.push({ categoryName: category.name, cards })
    }
  }
  const uncategorized = questions.value
    .filter(question => question.categoryId === null)
    .map(question => ({ text: question.text }))
  if (uncategorized.length > 0) {
    result.push({ categoryName: 'Geen categorie', cards: uncategorized })
  }
  return result
})

interface Page {
  categoryName: string
  cards: Card[]
}

const cards = computed<Card[]>(() => groups.value.flatMap(group => group.cards))

const pages = computed<Page[]>(() => {
  const chunks: Page[] = []
  for (const group of groups.value) {
    for (let i = 0; i < group.cards.length; i += CARDS_PER_PAGE) {
      chunks.push({ categoryName: group.categoryName, cards: group.cards.slice(i, i + CARDS_PER_PAGE) })
    }
  }
  return chunks
})

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="step-print">
    <div class="toolbar">
      <div>
        <h2 class="text-xl font-semibold">Stap 3 — Printen</h2>
        <p class="text-sm text-(--ui-text-muted)">
          {{ pages.length }} {{ pages.length === 1 ? 'A4-pagina' : "A4-pagina's" }}
        </p>
      </div>
      <UButton label="Printen" @click="handlePrint" />
    </div>

    <p v-if="cards.length === 0" class="text-(--ui-text-muted)">Nog geen vragen om te printen.</p>

    <div v-for="(page, pageIndex) in pages" :key="pageIndex" class="page-wrap">
      <p class="page-label">
        {{ page.categoryName }} — pagina {{ pageIndex + 1 }} van {{ pages.length }}
      </p>
      <div class="page">
        <div
          v-for="(card, cardIndex) in page.cards"
          :key="cardIndex"
          class="card"
        >
          <span class="card-text">{{ card.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-wrap {
  margin-bottom: 24px;
}

.page-label {
  margin: 0 0 6px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.page {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 6px;
  width: 190mm;
  height: 277mm;
  margin: 0 auto;
  padding: 4mm;
  border: 1px solid #ddd;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
}

.card-text {
  display: block;
  width: 56mm;
  text-align: center;
  font-size: 11px;
  line-height: 1.25;
  transform: rotate(-90deg);
}

@media print {
  .toolbar {
    display: none;
  }

  .page-label {
    display: none;
  }

  .page-wrap {
    margin-bottom: 0;
  }

  .page {
    border: none;
    margin: 0;
    page-break-after: always;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
</style>
