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

  const currentSpanParamsForMinutes = (minutes: number) => {
    const index = operatingTaskMinutesMaps?.findIndex(
      (operatingTaskMinutesMap) => {
        return (
          operatingTaskMinutesMap.start <= minutes &&
          minutes <= operatingTaskMinutesMap.end
        );
      },
    );
    if (index != -1) {
      if (
        operatingTaskMinutesMaps[index].start <= minutes &&
        minutes <= operatingTaskMinutesMaps[index].end
      ) {
        return [
          operatingTaskMinutesMaps[index].taskName,
          operatingTaskMinutesMaps[index].color,
          operatingTaskMinutesMaps[index].jumpUrl,
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
    <>
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
        {[...Array(dayMinutes)].map((_, minutes) => {
          return (
            <Tooltip title={currentSpanParamsForMinutes(minutes)[0]}>
              <div
                key={minutes}
                onClick={() => {
                  currentSpanParamsForMinutes(minutes)[1] != "white"
                    ? (window.location.href =
                        currentSpanParamsForMinutes(minutes)[2])
                    : "";
                }}
                style={{
                  backgroundColor: currentSpanParamsForMinutes(minutes)[1],
                  width: "auto",
                  position: "relative",
                }}
              >
                {minutes % (60 * displayTimeScaleUnit()) == 0 && (
                  <>
                    <span style={{ borderRight: "solid" }}></span>
                    <span
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-4px",
                      }}
                    >
                      {minutes / 60}
                    </span>
                  </>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </>
  );
};

export default TimeBarChart;
