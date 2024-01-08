<template>
  <div
    class="custom-select"
    tabindex="0"
    @blur="open = false"
  >
    <div
      class="selected"
      :class="{open: open}"
      @click="open = !open"
    >
      {{ selected }}
    </div>
    <div
      class="items"
      :class="{selectHide: !open}"
    >
      <div
        class="item"
        v-for="(option, i) of options"
        :key="i"
        @click="onSelect(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

export default defineComponent({
  name: 'SelectOption',
  props:{
    options: {
      type: Array as PropType<string[]>,
      required: true
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  emits: ['change'],
  data() {
    return {
      selected: this.options[0],
      open: false,
    };
  },
  watch: {
    options() {
      this.selected = this.options[0];
    },
  },
  methods: {
    onSelect(option: string) {
      this.selected = option;
      this.open = false;
      this.$emit('change', option);
    }
  },
});
</script>

<style scoped>
.custom-select {
  z-index: 9999;
  position: relative;
  text-align: left;
  outline: none;
  height: 47px;
  line-height: 47px;
  margin-top: 5px;
}

.selected {
  background-color: #080D0E;
  border-radius: 6px;
  border: 1px solid #858586;
  color: #ffffff;
  padding-left: 8px;
  cursor: pointer;
  user-select: none;
}

.selected.open{
  border: 1px solid #CE9B2C;
  border-radius: 6px 6px 0px 0px;
}

.selected:after {
  position: absolute;
  content: "";
  top: 22px;
  right: 10px;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-color: #fff transparent transparent transparent;
}

.items {
  color: #ffffff;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  border-right: 1px solid #CE9B2C;
  border-left: 1px solid #CE9B2C;
  border-bottom: 1px solid #CE9B2C;
  position: absolute;
  background-color: #080D0E;
  left: 0;
  right: 0;
}

.item{
  color: #ffffff;
  padding-left: 8px;
  cursor: pointer;
  user-select: none;
}

.item:hover{
  background-color: #B68A28;
}

.selectHide {
  display: none;
}
</style>
