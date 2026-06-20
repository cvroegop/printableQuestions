<script setup lang="ts">
const { questions, categories } = useQuestionBank()

const CARDS_PER_PAGE = 16

interface Card {
  text: string
  color: string
}

const cards = computed<Card[]>(() => {
  const result: Card[] = []
  for (const category of categories.value) {
    for (const question of questions.value) {
      if (question.categoryId === category.id) {
        result.push({ text: question.text, color: category.color })
      }
    }
  }
  for (const question of questions.value) {
    if (question.categoryId === null) {
      result.push({ text: question.text, color: '#eeeeee' })
    }
  }
  return result
})

const pages = computed<Card[][]>(() => {
  const chunks: Card[][] = []
  for (let i = 0; i < cards.value.length; i += CARDS_PER_PAGE) {
    chunks.push(cards.value.slice(i, i + CARDS_PER_PAGE))
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
      <p class="page-label">Pagina {{ pageIndex + 1 }} van {{ pages.length }}</p>
      <div class="page">
        <div
          v-for="(card, cardIndex) in page"
          :key="cardIndex"
          class="card"
          :style="{ backgroundColor: card.color }"
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
  font-size: 13px;
  color: #888;
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
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
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
