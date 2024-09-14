import { Tooltip } from "@mui/material";
import _ from "lodash";
import { useRef, useState } from "react";

type Props = {
  width: number;
  operatingTaskMinutesMaps: OperatingTaskMinutesMaps;
};

export type OperatingTaskMinutesMaps = {
  taskName: string;
  start: number;
  end: number;
  color: string;
  jumpUrl: string;
}[];

const TimeBarChart = ({ width, operatingTaskMinutesMaps }: Props) => {
  const dayMinutes = 1440;

  const targetTaskInfoOfCurrentMinutes = (currentMinutes: number) => {
    const index = operatingTaskMinutesMaps?.findIndex(
      (operatingTaskMinutesMap) =>
        operatingTaskMinutesMap.start <= currentMinutes &&
        currentMinutes <= operatingTaskMinutesMap.end,
    );
    if (index && index != -1) {
      if (
        operatingTaskMinutesMaps[index].start <= currentMinutes &&
        currentMinutes <= operatingTaskMinutesMaps[index].end
      ) {
        return [
          operatingTaskMinutesMaps[index].taskName,
          operatingTaskMinutesMaps[index].color,
        ];
      } else {
      }
    }
    return ["", "white"];
  };

  const displayTimeScaleUnit = () => {
    if (width >= 800) {
      return 1;
    } else if (width >= 300) {
      return 3;
    } else if (width < 300) {
      return 4;
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        height: "50px",
        width: width + "px",
        border: "solid",
        display: "grid",
        gridTemplateColumns: `repeat(${dayMinutes}, 1fr)`,
      }}
    >
      {[...Array(dayMinutes)].map((value, index) => {
        return (
          <Tooltip title={targetTaskInfoOfCurrentMinutes(index)[0]}>
            <div
              key={index}
              onClick={() => {
                targetTaskInfoOfCurrentMinutes(index)[1] != "white"
                  ? (window.location.href = "http://localhost:3001/tasks")
                  : "";
              }}
              style={{
                backgroundColor: targetTaskInfoOfCurrentMinutes(index)[1],
                width: "auto",
                position: "relative",
              }}
            >
              {index % (60 * displayTimeScaleUnit()) == 0 && (
                <>
                  <span style={{ borderRight: "solid" }}></span>
                  <span
                    style={{ position: "absolute", top: "-20px", left: "-4px" }}
                  >
                    {index / 60}
                  </span>
                </>
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default TimeBarChart;
