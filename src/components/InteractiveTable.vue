<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  pageSize: {
    type: Number,
    default: 10
  },
  caption: {
    type: String,
    default: 'Interactive data table'
  },
  searchPlaceholder: {
    type: String,
    default: 'Search all columns'
  }
})

const globalSearch = ref('')
const columnFilters = ref({})
const sortKey = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)
const tableScroll = ref(null)

function valueFor(row, column) {
  if (typeof column.value === 'function') return column.value(row)
  return row[column.key]
}

function normalized(value) {
  return String(value ?? '').toLowerCase().trim()
}

const searchableColumns = computed(() => props.columns.filter((column) => column.searchable !== false))

const filteredRows = computed(() => {
  const globalTerm = normalized(globalSearch.value)

  return props.rows.filter((row) => {
    const matchesGlobal = !globalTerm || searchableColumns.value.some((column) =>
      normalized(valueFor(row, column)).includes(globalTerm)
    )

    if (!matchesGlobal) return false

    return searchableColumns.value.every((column) => {
      const term = normalized(columnFilters.value[column.key])
      return !term || normalized(valueFor(row, column)).includes(term)
    })
  })
})

const sortedRows = computed(() => {
  if (!sortKey.value) return [...filteredRows.value]

  const column = props.columns.find((item) => item.key === sortKey.value)
  if (!column) return [...filteredRows.value]

  return [...filteredRows.value].sort((a, b) => {
    const aValue = valueFor(a, column)
    const bValue = valueFor(b, column)

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
    }

    const result = String(aValue ?? '').localeCompare(String(bValue ?? ''), undefined, {
      numeric: true,
      sensitivity: 'base'
    })
    return sortDirection.value === 'asc' ? result : -result
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / props.pageSize)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return sortedRows.value.slice(start, start + props.pageSize)
})

const resultStart = computed(() => sortedRows.value.length === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1)
const resultEnd = computed(() => Math.min(currentPage.value * props.pageSize, sortedRows.value.length))

function toggleSort(column) {
  if (column.sortable === false) return

  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }
}

function sortIndicator(column) {
  if (sortKey.value !== column.key) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

function ariaSort(column) {
  if (column.sortable === false || sortKey.value !== column.key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}


function previousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

function nextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

function scrollTable(direction) {
  if (!tableScroll.value) return
  const amount = Math.max(240, Math.floor(tableScroll.value.clientWidth * 0.8))
  tableScroll.value.scrollBy({ left: direction * amount, behavior: 'smooth' })
}

function handleTableKeydown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollTable(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollTable(1)
  }
}

function resetFilters() {
  globalSearch.value = ''
  columnFilters.value = {}
  sortKey.value = ''
  sortDirection.value = 'asc'
  currentPage.value = 1
}

watch([globalSearch, columnFilters, sortKey, sortDirection], () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})
</script>

<template>
  <div class="interactive-table">
    <div class="table-tools">
      <div class="global-search">
        <label :for="`${caption}-global-search`">Search table</label>
        <input
          :id="`${caption}-global-search`"
          v-model="globalSearch"
          class="form-control"
          type="search"
          :placeholder="searchPlaceholder"
          autocomplete="off"
          :spellcheck="false"
        >
      </div>
      <button class="btn btn-outline reset-btn" type="button" @click="resetFilters">Clear filters</button>
    </div>

    <div class="mobile-scroll-controls" aria-label="Horizontal table controls">
      <span>More columns:</span>
      <button class="scroll-btn" type="button" @click="scrollTable(-1)">← Left</button>
      <button class="scroll-btn" type="button" @click="scrollTable(1)">Right →</button>
    </div>

    <div
      ref="tableScroll"
      class="table-scroll"
      tabindex="0"
      :aria-label="`${caption}. Scroll horizontally if needed. Use left and right arrow keys when focused.`"
      @keydown="handleTableKeydown"
    >
      <table class="data-table">
        <caption class="sr-only">{{ caption }}</caption>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="ariaSort(column)"
            >
              <button
                v-if="column.sortable !== false"
                class="sort-button"
                type="button"
                :aria-label="`Sort by ${column.label}`"
                @click="toggleSort(column)"
              >
                {{ column.label }} <span aria-hidden="true">{{ sortIndicator(column) }}</span>
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
          <tr class="filter-row">
            <th v-for="column in columns" :key="`${column.key}-filter`" scope="col">
              <label v-if="column.searchable !== false" class="sr-only" :for="`${caption}-${column.key}-filter`">
                Search {{ column.label }}
              </label>
              <input
                v-if="column.searchable !== false"
                :id="`${caption}-${column.key}-filter`"
                v-model="columnFilters[column.key]"
                class="column-filter"
                type="search"
                :placeholder="`Filter ${column.label}`"
                autocomplete="off"
                :spellcheck="false"
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row[rowKey]">
            <td v-for="column in columns" :key="column.key">
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="valueFor(row, column)"
              >
                {{ valueFor(row, column) }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="columns.length" class="empty-state">No matching records found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" aria-live="polite">
      <p class="result-count">
        Showing {{ resultStart }}–{{ resultEnd }} of {{ sortedRows.length }} records · {{ pageSize }} rows per page
      </p>
      <div class="page-controls" aria-label="Table pagination">
        <button
          class="btn btn-outline page-btn"
          type="button"
          :disabled="currentPage === 1"
          @click="previousPage"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="btn btn-outline page-btn"
          type="button"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-tools {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1rem;
}
.global-search { flex: 1; max-width: 420px; }
.global-search label { display: block; font-weight: 600; margin-bottom: 0.3rem; }
.reset-btn { white-space: nowrap; }

.mobile-scroll-controls {
  display: none;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
  font-size: 0.85em;
  color: #4a5568;
}
.scroll-btn {
  border: 1px solid var(--teal-700);
  border-radius: 4px;
  background: var(--white);
  color: var(--teal-700);
  font: inherit;
  font-weight: 700;
  padding: 0.35em 0.65em;
  cursor: pointer;
}
.scroll-btn:focus-visible { outline: 2px solid var(--gold-500); outline-offset: 2px; }

.table-scroll {
  overflow-x: auto;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  touch-action: pan-x pan-y;
  scrollbar-gutter: stable;
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.table-scroll:focus-visible {
  outline: 3px solid var(--gold-500);
  outline-offset: 2px;
}

.data-table { min-width: 760px; }
.sort-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
.sort-button:focus-visible {
  outline: 2px solid var(--gold-500);
  outline-offset: 3px;
}

.filter-row th { background: var(--teal-50); padding: 0.45rem; }
.column-filter {
  width: 100%;
  min-width: 7rem;
  padding: 0.45em 0.55em;
  border: 1px solid #a0aec0;
  border-radius: 4px;
  font: inherit;
  color: var(--ink);
  background: var(--white);
}
.column-filter:focus {
  outline: 2px solid var(--teal-500);
  outline-offset: 1px;
}

.empty-state { text-align: center; padding: 1.5rem; color: #4a5568; }
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.8rem;
}
.result-count { margin: 0; color: #4a5568; font-size: 0.9em; }
.page-controls { display: flex; align-items: center; gap: 0.75rem; }
.page-btn { padding: 0.35em 0.75em; font-size: 0.9em; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 760px) {
  .mobile-scroll-controls { display: flex; flex-wrap: wrap; }
  .table-scroll { width: 100%; }
  .table-tools, .pagination { align-items: stretch; flex-direction: column; }
  .global-search { max-width: none; }
  .page-controls { justify-content: space-between; }
}
</style>
