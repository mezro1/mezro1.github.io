<template>
  <div class="pagination-wrapper">
    <div>
      {{ displayText }}
    </div>
    <div>
      <button
          type="button"
          class="arrow left"
          :class="{
            'not-allowed': currentPage === 1,
            'pointer': currentPage !== 1,
          }"
          :disabled="currentPage === 1"
          name="left"
          @click="previousPage"
      >
        <svg width="60px" height="80px" viewBox="0 0 50 80" xml:space="preserve">
          <polyline fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="
        45.63,75.8 0.375,38.087 45.63,0.375 "/>
        </svg>
      </button>
      <button
          type="button"
          class="arrow right"
          :class="{
            'not-allowed': currentPage === totalPages,
            'pointer': currentPage !== totalPages,
          }"
          :disabled="currentPage === totalPages"
          name="right"
          @click="nextPage"
      >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60px" height="80px" viewBox="0 0 50 80" xml:space="preserve">
          <polyline fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="
        0.375,0.375 45.63,38.087 0.375,75.8 "/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Pagination',
  props: {
    /**
     * Current page value
     */
    modelValue: {
      type: Number,
      required: true,
    },
    /**
     * Total number of items for pagination
     */
    itemsCount: {
      type: Number,
      required: true,
    },
    /**
     * Visible number of items per page
     */
    pageSize: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:model-value'],
  computed: {
    totalPages(): number {
      return Math.ceil(this.itemsCount / this.pageSize);
    },
    currentPage: {
      get(): number {
        return this.modelValue;
      },
      set(page: number): void {
        this.$emit('update:model-value', page);
      },
    },
    displayText(): string {
      const start = ((this.currentPage - 1) * this.pageSize) + 1;
      const end = Math.min(this.currentPage * this.pageSize, this.itemsCount);
      return `${start}-${end} of ${this.itemsCount} Martian images`;
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
  },
});
</script>

<style scoped>
.not-allowed {
  cursor: not-allowed;
}
.pagination-wrapper {
  display: flex;
  margin-top: 30px;
}
button {
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  outline:0;
}

svg {
  width: 40px;
  height: 20px;
}

.arrow {
  width: 40px;
  height: 20px;
}

.left:hover polyline,
.left:focus polyline {
  stroke-width: 10;
}

.left:active polyline {
  stroke-width: 12;
  transition: all 100ms ease-in-out;
}

.right:hover polyline,
.right:focus polyline {
  stroke-width: 10;
}

.right:active polyline {
  stroke-width: 12;
  transition: all 100ms ease-in-out;
}

polyline {
  stroke-width: 6;
  transition: all 250ms ease-in-out;
}
</style>
