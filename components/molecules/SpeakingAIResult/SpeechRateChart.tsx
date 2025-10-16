// @mui
import React from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';
// components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.font.size = 13;
ChartJS.defaults.font.family = 'Public Sans, sans-serif';
ChartJS.defaults.font.weight = 500;
ChartJS.defaults.color = '#637381';

const RootStyle = styled('div')(() => ({}));

type RecordProps = {
  speechRateSerie: Array<number>;
};

export default function SpeechRateChart(props: RecordProps) {
  const { speechRateSerie } = props;
  const theme = useTheme();

  const chartOption = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (point: any) => point.formattedValue,
        },
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
          text: 'Seconds',
        },
        grid: {
          display: false,
          color: theme.palette.divider,
        },
      },
      y: {
        display: true,
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Words',
        },
        suggestedMin: 0,
        suggestedMax: 200,
        afterBuildTicks: (axis: any) =>
          (axis.ticks = [0, 50, 100, 150, 200, 250, 300].map((v) => ({
            value: v,
          }))),
        ticks: {
          padding: 10,
          autoSkip: false,
        },
      },
    },
  };
  const labels = Array.from(speechRateSerie.keys()).map((key) => key * 3);
  const data = {
    labels,
    datasets: [
      {
        data: speechRateSerie,
        borderColor: theme.palette.primary.main,
        fill: false,
        cubicInterpolationMode: 'monotone' as const,
        pointStyle: false as const,
      },
    ],
  };

  return (
    <RootStyle>
      <Line options={chartOption} data={data} />
    </RootStyle>
  );
}

