<template>
  <div>
    <rover-card
      v-if="roverInfo"
      :rover-info="roverInfo"
      :rover-cameras="roverCameras"
      :loading="loading"
      @rover-change="onRoverChange"
      @camera-change="onCameraChange"
      @sol-change="roverDay = $event"
      @earth-day-change="earthDay = $event"
      @day-option-change="dayOption = $event"
      @search="onSearch"
    />
      <loader
        v-if="loading"
        :size="32"
      />

    <template v-if="cameraImages.length">
      <div class="page-options">
        <pagination
            v-if="usePagination"
            v-model="currentPage"
            :items-count="cameraImages.length"
            :page-size="pageSize"
        />
        <ordering @order-change="ordering = $event" />
      </div>
      <div class="image-wrapper">
        <a
          v-for="image in shownImages"
          class="image-link"
          :key="image.id"
          :href="image.img_src"
          target="_blank"
        >
          <img
            class="image"
            :src="image.img_src"
            alt=""
          />
        </a>
      </div>
    </template>
    <div
      v-else-if="!loading && !cameraImages.length"
      class="empty-message"
    >
      Nothing at current search, try different Martian or Earth day
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MarsService from "@/services/api";
import Pagination from '@/components/Pagination.vue';
import RoverCard from "@/components/RoverCard.vue";
import {IMarsImages, IRoverInfo} from "@/models/models";
import Loader from '@/components/Loader.vue';
import Ordering from '@/components/Ordering.vue';

export enum Rovers {
  perseverance = 'Perseverance',
  curiosity = 'Curiosity',
  opportunity = 'Opportunity',
  spirit = 'Spirit',
}

interface IData {
  loading: boolean,
  roverInfo: IRoverInfo | null,
  dayOption: 'sol' | 'earth',
  roverDay: number,
  earthDay: string,
  roverCameras: string[],
  marsImages: IMarsImages[],
  cameraImages: IMarsImages[],
  currentPage: number,
  pageSize: number;
  ordering: boolean;
}

export default defineComponent({
  name: 'MainView',
  components: {
    RoverCard,
    Pagination,
    Ordering,
    Loader,
  },
  props: {},
  data(): IData {
    return {
      roverInfo: null,
      dayOption: 'sol',
      roverDay: 0,
      earthDay: '',
      roverCameras: [],
      marsImages: [],
      cameraImages: [],
      loading: false,
      currentPage: 1,
      pageSize: 20,
      ordering: false,
    };
  },
  computed: {
    usePagination(): boolean {
      return this.cameraImages.length > this.pageSize;
    },
    shownImages():IMarsImages[] {
      const { start, end } = this.getChartPageSize(this.currentPage, this.pageSize);
      let images = this.cameraImages;
      if (this.ordering) {
        images = images.toReversed();
      }
      if (this.usePagination) {
        return images.slice(start, end);
      }
      return images;
    }
  },
  created() {
    this.onRoverChange(Rovers.perseverance);
  },
  methods: {
    async onSearch() {
      this.currentPage = 1;
      this.loading = true;
      if (this.dayOption === 'sol') {
        await this.getImagesBySol();
        return;
      }
      await this.getImagesByEarthDate();
      this.loading = false;
    },
    async onRoverChange(rover: Rovers) {
      this.loading = true;
      this.roverInfo = await MarsService.getRoverManifest(rover);
      if (this.roverInfo?.photos.length) {
        this.roverDay = this.roverInfo!.max_sol;
        await this.getImagesBySol();
      }
      this.loading = false;
    },
    async getImagesBySol() {
      this.loading = true;
      this.marsImages = await MarsService.getRoverImagesBySol(this.roverInfo!.name, this.roverDay);
      if (this.marsImages.length) {
        this.earthDay = this.marsImages[0].earth_date;
        this.getCameras();
      } else {
        this.cameraImages = [];
      }
      this.loading = false;
    },
    async getImagesByEarthDate() {
      this.loading = true;
      this.marsImages = await MarsService.getRoverImagesByEarthDay(this.roverInfo!.name, this.earthDay);
      if (this.marsImages.length) {
        this.roverDay = this.marsImages[0].sol;
        this.getCameras();
      } else {
        this.cameraImages = [];
      }
      this.loading = false;
    },
    getCameras() {
      const allCameras = this.marsImages.map((img) => {
        return img.camera.full_name;
      });
      this.roverCameras = [...new Set(allCameras)];
      this.onCameraChange(this.roverCameras[0]);
    },
    onCameraChange(camera: string) {
      this.cameraImages = this.marsImages.filter((img) => img.camera.full_name === camera);
    },
    getChartPageSize(currentPage: number, pageSize: number) {
      const end = currentPage * pageSize;
      const start = end - pageSize;
      return { start, end };
    },
  },
});
</script>

<style scoped>
.image-wrapper {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
}

.image-link {
  flex-grow: 1;
  width: 49%;
  max-width: 49%;
  margin-right: 1%;
  margin-bottom: 1em;
}

img {
  width: 100%;
  height: 100%;
}

input {
  width: 30em;
  height: 2.1em;
  margin-right: 24px;
}

.empty-message {
  font-size: 24px;
  margin: 0 auto;
  padding-top: 2em;
}

.page-options {
  display: flex;
}
</style>
