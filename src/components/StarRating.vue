<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  size: { type: String, default: '1.4em' }
})
const emit = defineEmits(['update:modelValue'])

const hoverValue = ref(0)

function displayValue() {
  return hoverValue.value || props.modelValue
}

function choose(v) {
  if (!props.readonly) emit('update:modelValue', v)
}
</script>

<template>
  <span
    class="star-rating"
    role="img"
    :aria-label="readonly ? `Rated ${modelValue} out of 5` : 'Choose a rating from 1 to 5'"
  >
    <button
      v-if="!readonly"
      v-for="n in 5"
      :key="n"
      type="button"
      class="star-btn"
      :style="{ fontSize: size }"
      :class="{ filled: n <= displayValue() }"
      :aria-label="`${n} star${n > 1 ? 's' : ''}`"
      @mouseenter="hoverValue = n"
      @mouseleave="hoverValue = 0"
      @click="choose(n)"
    >★</button>
    <template v-else>
      <span
        v-for="n in 5"
        :key="n"
        class="star-static"
        :style="{ fontSize: size }"
        :class="{ filled: n <= Math.round(modelValue) }"
      >★</span>
    </template>
  </span>
</template>

<style scoped>
.star-rating { display: inline-flex; gap: 2px; align-items: center; }
.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: #cbd5e0;
}
.star-btn.filled { color: var(--gold-500); }
.star-static { color: #cbd5e0; line-height: 1; }
.star-static.filled { color: var(--gold-500); }
</style>