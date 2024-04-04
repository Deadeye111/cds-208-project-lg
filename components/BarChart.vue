<template>
  <div class="text-white dark:text-black">
    <Bar :options="chartOptions" :data="chartData" :style="myStyles" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  setup(props) {
    const chartHeight = ref(20)

    const myStyles = computed(() => {
      return {
        height: `${chartHeight.value}rem`,
        width: '100%', // Using the chartHeight data property
        position: 'relative'
      }
    })

    const chartData = computed(() => {
      return {
        labels: props.labels,
        datasets: [{
          label: props.legendLabel,
          data: props.data,
          backgroundColor: ['rgb(79,70,229)']
        }]
      }
    })

    const chartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: props.title // Use the title provided via prop
        }
      }
    }

    return { chartData, chartOptions, myStyles }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    legendLabel: {
      type: String,
      default: ''
    },
    labels: Array,
    data: Array
  }
}
</script>
