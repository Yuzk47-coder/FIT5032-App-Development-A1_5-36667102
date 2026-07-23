<template>
  <div class="star-rating">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      :class="{ filled: star <= (hovered || modelValue) }"
      @mouseenter="hovered = star"
      @mouseleave="hovered = 0"
      @click="$emit('update:modelValue', star)"
    >
      ★
    </span>
    <span class="rating-text ms-2">{{ displayText }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  average: { type: Number, default: 0 },
  count: { type: Number, default: 0 }
})

defineEmits(['update:modelValue'])

const hovered = ref(0)

const displayText = computed(() => {
  if (props.count === 0) return 'No ratings yet'
  return `${props.average} / 5 (${props.count} rating${props.count > 1 ? 's' : ''})`
})
</script>

<style scoped>
.star {
  font-size: 1.5rem;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}
.star.filled {
  color: #f5a623;
}
.rating-text {
  font-size: 0.85rem;
  color: #666;
}
</style>