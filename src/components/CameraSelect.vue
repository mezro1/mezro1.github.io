<template>
  <div>
    <label
      class="label"
      for="perseverance"
    >
      2. Select {{ name }} camera
    </label>
    <div class="select">
      <select
        v-model="selected"
        name="perseverance"
        id="perseverance"
        :class="{
          'pointer': !disabled,
          'not-allowed': disabled,
        }"
        :disabled="disabled"
        @update:model-value="$emit('change', $event)"
      >
        <option
          v-for="camera in items"
          :key="camera.key"
        >
          {{ camera.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface ISelectItem {
  key: string;
  name: string;
}

export default defineComponent({
  name: 'CameraSelect',
  components: {},
  props: {
    items: {
      type: Array as PropType<ISelectItem[]>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  data(): {
    selected: string,
  } {
    return {
      selected: '',
    };
  },
});
</script>

<style scoped>
select {
  height: 2.5em;
  width: 25em;
  margin-right: 24px;
}

.pointer {
  cursor: pointer;
}

.not-allowed {
  cursor: not-allowed;
}
</style>
