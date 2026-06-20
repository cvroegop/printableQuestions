<script setup lang="ts">
type Tab = 'list' | 'categorize' | 'print'

const activeTab = ref<Tab>('list')

const tabItems = [
  { label: '1. Lijst', value: 'list' },
  { label: '2. Categoriseren', value: 'categorize' },
  { label: '3. Printen', value: 'print' }
]
</script>

<template>
  <UApp>
    <div class="min-h-screen">
      <div class="px-4 pt-3 print:hidden">
        <UTabs v-model="activeTab" :items="tabItems" />
      </div>

      <main class="p-6">
        <StepList v-if="activeTab === 'list'" />
        <StepCategorize v-else-if="activeTab === 'categorize'" />
        <StepPrint v-else-if="activeTab === 'print'" />
      </main>
    </div>
  </UApp>
</template>
