import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

// Data transformed to percentages and rounded to whole numbers
export const ethnicData = [
  {
    ethnicity: "Chinese",
    "Food-Secure": Math.round((784 / (784 + 118)) * 100),
    "Food-Insecure": Math.round((118 / (784 + 118)) * 100),
  },
  {
    ethnicity: "Malay",
    "Food-Secure": Math.round((95 / (95 + 59)) * 100),
    "Food-Insecure": Math.round((59 / (95 + 59)) * 100),
  },
  {
    ethnicity: "Indian",
    "Food-Secure": Math.round((91 / (91 + 16)) * 100),
    "Food-Insecure": Math.round((16 / (91 + 16)) * 100),
  },
  {
    ethnicity: "Others",
    "Food-Secure": Math.round((35 / (35 + 6)) * 100),
    "Food-Insecure": Math.round((6 / (35 + 6)) * 100),
  },
];

const EthnicDistribution = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={ethnicData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["Food-Secure", "Food-Insecure"]}
      indexBy="ethnicity"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id }) =>
        id === "Food-Secure" ? "#A3D16B" : "#ecc94b" // Updated color for lighter green
      }
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Ethnicity",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Percentage",
        legendPosition: "middle",
        legendOffset: -40,
        format: (value) => `${value}%`,
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelFormat={(value) => `${value}%`}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return `${e.id}: ${e.formattedValue}% individuals among ${e.indexValue}`;
      }}
    />
  );
};

export default EthnicDistribution;
