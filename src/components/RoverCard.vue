<template>
  <div class="card-wrapper">
    <div>
      <div class="rover-name">
        {{ roverInfo.name }} Mars Rover
      </div>
      <div class="mission-info">
        <div class="info-wrapper">
          <div>Mission status:</div>
          <div class="mission-status">{{ roverInfo.status }}</div>
        </div>
        <div class="info-wrapper">
          <div>Launch date:</div>
          <div>{{ roverInfo.launch_date }}</div>
        </div>
        <div class="info-wrapper">
          <div>Landing date:</div>
          <div>{{ roverInfo.landing_date }}</div>
        </div>
      </div>
    </div>

    <fieldset
        :class="{'disabled-container': loading}"
        :disabled="loading"
    >
      <div class="rover-options">
        <div class="option-wrapper">
          <div class="label">Mars rover</div>
          <select-option
              :options="rovers"
              :style="{width: '20rem'}"
              @change="$emit('rover-change', $event)"
          />
        </div>
        <div class="option-wrapper" :style="{width: '20rem'}">
          <label class="label pointer">
            <input
                v-model="searchOption"
                type="radio"
                class="radio-button"
                value="sol"
                @update:model-value="$emit('day-option-change', 'sol')"
            />
            Rover's day on Mars (max: {{ roverInfo.max_sol }})
          </label>
          <input
              v-model="sol"
              type="number"
              class="sol-input"
              :class="{'disabled-input': searchOption === 'earth'}"
              :disabled="searchOption === 'earth'"
              :max="roverInfo.max_sol"
              :placeholder="`max day: ${roverInfo.max_sol}`"
              @update:model-value="$emit('sol-change', sol)"
          />
          <div
              v-if="showSolError"
              class="error-message">
            Martian day must be between 0 - {{ roverInfo.max_sol }}
          </div>
        </div>
        <div class="option-wrapper" :style="{width: '22rem'}">
          <label class="label pointer">
            <input
                v-model="searchOption"
                type="radio"
                class="radio-button"
                value="earth"
                @update:model-value="$emit('day-option-change', 'earth')"
            />
            Earth date
            <span class="day-info">({{roverInfo.landing_date}} > day < {{roverInfo.max_date}})</span>
          </label>
          <input
              v-model="earth"
              class="sol-input"
              :class="{'disabled-input': searchOption === 'sol'}"
              :disabled="searchOption === 'sol'"
              :placeholder="roverInfo.max_date"
              @update:model-value="$emit('earth-day-change', earth)"
          />
          <div
              v-if="showEarthError"
              class="error-message">
            Earth day must be format yyyy-mm-dd between:
            <div>{{roverInfo.landing_date}} and {{roverInfo.max_date}}</div>
          </div>
        </div>

        <div
            v-if=roverCameras.length
            class="option-wrapper"
        >
          <div class="label">
            Camera
          </div>
          <select-option
              :options="roverCameras"
              :style="{width: '25rem'}"
              @change="$emit('camera-change', $event)"
          />
        </div>
        <button
            type="button"
            class="search-button"
            @click="onSearch"
        >
          Search
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import CameraSelect from "@/components/CameraSelect.vue";
import {IRoverInfo} from "@/models/models";
import SelectOption from "@/components/SelectOption.vue";
import {Rovers} from "@/views/MainView.vue";

export default defineComponent({
  name: 'RoverCard',
  components: {
    SelectOption,
    CameraSelect,
  },
  props: {
    roverInfo: {
      type: Object as PropType<IRoverInfo>,
      required: true,
    },
    roverCameras: {
      type: Array as PropType<string[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['rover-change', 'camera-change', 'sol-change', 'earth-day-change', 'day-option-change', 'search'],
  data(): {
    sol: number;
    earth: string;
    searchOption: string;
    showSolError: boolean;
    showEarthError: boolean;
  } {
    return {
      sol: this.roverInfo.max_sol,
      earth: this.roverInfo.photos[this.roverInfo.photos.length - 1].earth_date,
      searchOption: 'sol',
      showSolError: false,
      showEarthError: false,
    };
  },
  computed: {
    rovers(): string[] {
      return [Rovers.perseverance, Rovers.curiosity, Rovers.opportunity, Rovers.spirit];
    }
  },
  watch: {
    roverInfo() {
      this.sol = this.roverInfo.max_sol;
      this.earth = this.roverInfo.photos[this.roverInfo.photos.length - 1].earth_date;
    },
  },
  methods: {
    onSearch() {
      this.showSolError = false;
      this.showEarthError = false;
      this.validate();
      if (this.searchOption === 'sol' && !this.showSolError) {
        this.$emit('search');
      }
      if (this.searchOption === 'earth' && !this.showEarthError) {
        this.$emit('search');
      }
    },
    validate() {
      if (this.searchOption === 'sol' && (this.sol < 0 || this.sol > this.roverInfo.max_sol)) {
        this.showSolError = true;
        return;
      }
      if (this.searchOption === 'earth') {
        if (!this.earth || !this.isValidDate(this.earth) || !this.isDateInRange()) {
          this.showEarthError = true;
          return;
        }
      }
    },
    isValidDate(dateString: string) {
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
      if(!dateString.match(regEx)) return false;  // Invalid format
      var d = new Date(dateString);
      var dNum = d.getTime();
      if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
      return d.toISOString().slice(0,10) === dateString;
    },
    isDateInRange() {
      const selectedDay = this.getTimestamp(this.earth);
      const minDay = this.getTimestamp(this.roverInfo.landing_date);
      const maxDay = this.getTimestamp(this.roverInfo.max_date);
      console.log(selectedDay > minDay && selectedDay < maxDay);
      return selectedDay >= minDay && selectedDay <= maxDay;
    },
    getTimestamp(dateStr: string): number {
      const [year, month, day] = dateStr.split(/-/);
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    },
  },
});
</script>
<style scoped>
.mission-info {
  display: flex;
}
.mission-status {
  text-transform: uppercase;
}
fieldset {
  margin-top: 2em;
  padding-bottom: 2em;
}
.disabled-container {
  height: fit-content;
  opacity: 0.4;
  cursor: not-allowed;
}
.disabled-container :deep(*) {
  pointer-events: none;
}
.rover-options {
  display: flex;
  flex-flow: wrap;
  margin-top: 2em;
}
.rover-name {
  font-size: 48px;
}
.option-wrapper {
  margin-right: 2em;
}
.info-wrapper {
  display: flex;
  margin-top: 4px;
  font-weight: 700;
}
.search-button {
  font-size: 20px;
  border: 2px solid green;
  padding: 0 24px;
  border-radius: 25px;
  margin-top: 1.6em;
  cursor: pointer;
  height: 47px;
  background: #080D0E;
  font-family: "Lekton", sans-serif;
}
.search-button:hover {
  background: green;
}
.info-wrapper div:first-child {
  margin-right: 8px;
  text-decoration: underline;
}
.info-wrapper div:last-child {
  color: green;
  margin-right: 16px;
}
.error-message {
  color: red;
  font-size: 16px;
  margin-top: 2px;
}
.day-info {
  font-size: 14px;
  color: green;
}
.radio-button {
  width: 15px;
  height: 15px;
}
.disabled-input {
  opacity: 0.3;
  cursor: not-allowed;
}
.sol-input {
  position: relative;
  text-align: left;
  outline: none;
  height: 47px;
  line-height: 47px;
  background-color: #080D0E;
  border-radius: 6px;
  border: 1px solid #858586;
  color: #ffffff;
  padding-left: 8px;
  user-select: none;
  font-size: 16px;
  width: 20em;
  margin-top: 5px;
}
</style>
