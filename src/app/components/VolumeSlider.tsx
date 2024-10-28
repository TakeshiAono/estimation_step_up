import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Slider, Stack } from "@mui/material";

type Props = {
  volume: number;
  onChange: (volume: number) => void;
};

const VolumeSlider = ({ volume, onChange }: Props) => {
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ backgroundColor: "white" }}
      alignItems="center"
    >
      <VolumeDownIcon />
      <Slider
        style={{ backgroundColor: "white" }}
        aria-label="Volume"
        value={volume}
        onChange={(_, value) => {
          console.log("test", value);
          if (typeof value === "number") {
            onChange(value);
          }
        }}
      />
      <VolumeUpIcon />
    </Stack>
  );
};

export default VolumeSlider;
