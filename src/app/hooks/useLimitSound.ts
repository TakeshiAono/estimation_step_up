import useSound from "use-sound";

// @ts-ignore
import restEndSound from "./../assets/rest_end.mp3";
// @ts-ignore
import operationEndSound from "./../assets/operation_end.mp3";

type Props = {
  volume: number;
  isResetSound: boolean;
  onSoundPlay: () => void;
};

const useLimitSound = ({ volume, isResetSound, onSoundPlay }: Props) => {
  const [operationSoundPlay] = useSound(operationEndSound, {
    volume: volume / 100,
  });
  const [restSoundPlay] = useSound(restEndSound, { volume: volume / 100 });

  const soundPlay = () => {
    isResetSound
      ? (() => {
          restSoundPlay();
          onSoundPlay();
        })()
      : (() => {
          operationSoundPlay();
          onSoundPlay();
        })();
  };

  return soundPlay;
};

export default useLimitSound;
