import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      display: false,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
  scales: {
    y: {
      grid: {
        color: (ctx) => (ctx.index === 0 ? "white" : "rgba(0, 0, 0, 0)"),
      },
      ticks: {
        color: "white",
        beginAtZero: true,
      },
    },
    x: {
      grid: {
        color: (ctx) => (ctx.index === 0 ? "white" : "rgba(0, 0, 0, 0)"),
      },
      ticks: {
        color: "white",
        beginAtZero: true,
      },
    },
  },
};

const Chart = ({ graphData, range, setrange }) => {
  const RANGE = { "3D": 3, W: 7, M: 30, "3M": 90 };

  return (
    <div className="relative flex h-[80%] w-full rounded-[30px] bg-[rgba(0,0,0,.29)] p-6">
      <span className="absolute left-0 right-0 mx-auto flex w-min gap-4">
        {Object.keys(RANGE).map((ele) => {
          return (
            <button
              className="rounded-xl bg-[rgba(0,0,0,.247)] px-4 py-2 text-white"
              style={
                RANGE[ele] == range
                  ? { color: "black", background: "white" }
                  : {}
              }
              key={ele}
              onClick={() => {
                setrange(RANGE[ele]);
              }}
            >
              {ele}
            </button>
          );
        })}
      </span>
      <Line key={range + "chart"} options={options} data={graphData[range]} />
    </div>
  );
};

export default Chart;
