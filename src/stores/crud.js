import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCrudStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const nextId = ref(1)
  const items = ref([])
    const reindexItems = () => {
      items.value = items.value.map((item, index) => ({
        ...item,
        id: index + 1,
      }))
      nextId.value = items.value.length + 1
    }

  function increment() {
    count.value++
  }
  

function addItem(item) {
  const exists = items.value.some(i =>
    i.name.toLowerCase().trim() === item.name.toLowerCase().trim()
  )

  if (exists) {
    throw new Error('Duplicate item name is not allowed.')
  }

  items.value.push(item)
  nextId.value += 1
  count.value = items.value.length
  reindexItems()
}

function updateItem(updatedItem) {
  const exists = items.value.some(i =>
    i.name.toLowerCase().trim() === updatedItem.name.toLowerCase().trim() &&
    i.id !== updatedItem.id
  )

  if (exists) {
    throw new Error('Duplicate item name is not allowed.')
  }

  const index = items.value.findIndex(i => i.id === updatedItem.id)
  if (index !== -1) {
    items.value[index] = updatedItem
  }
  reindexItems()
}

  function deleteItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
    count.value = items.value.length
    reindexItems()
  }


  function resetItems() {
    items.value = []
    nextId.value = 1
    count.value = 0
    reindexItems()
  }

  return {
    count,
    doubleCount,
    nextId,
    items,
    increment,
    addItem,
    updateItem,
    deleteItem,
    resetItems,
    reindexItems,
  }
})
