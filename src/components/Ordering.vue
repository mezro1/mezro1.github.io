<template>
  <div class="ordering">
    Order:
    <button
      type="button"
      @click="onClick"
    >
      <span class="arrow" :class="{'active': orderActive}">
        <span />
        <span />
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Ordering',
  emits: ['order-change'],
  data(): {
    orderActive: boolean,
  } {
    return {
      orderActive: false,
    };
  },
  methods: {
    onClick() {
     this.orderActive = !this.orderActive;
     this.$emit('order-change', this.orderActive)
    },
  },
});
</script>

<style scoped>
.ordering {
  margin-top: 30px;
  margin-right: 2em;
  margin-left: auto;
}
button {
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0;
}
.arrow {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  position: relative;
  margin: 0 1rem;
}
.arrow span {
  top: 0.8rem;
  position: absolute;
  width: 0.75rem;
  height: 0.1rem;
  background-color: #efefef;
  display: inline-block;
  transition: all 0.2s ease;
}
.arrow span:first-of-type {
  left: 0;
  transform: rotate(45deg);
}
.arrow span:last-of-type {
  right: 0;
  transform: rotate(-45deg);
}
.arrow.active span:first-of-type {
  transform: rotate(-45deg);
}
.arrow.active span:last-of-type {
  transform: rotate(45deg);
}

</style>
