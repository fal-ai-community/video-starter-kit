import { useVideoProjectStore } from "@/data/store";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { Button } from "./ui/button";

export function VideoControls() {
  const player = useVideoProjectStore((s) => s.player);
  const playerState = useVideoProjectStore((s) => s.playerState);
  const handleTogglePlay = () => {
    if (!player) return;
    if (player.isPlaying()) {
      player.pause();
    } else {
      player.play();
    }
  };
  const onSeekToStart = () => {
    if (!player) return;
    player.seekTo(0);
  };
  const onSeekToEnd = () => {
    if (!player) return;
    // player.seekTo(player.);
  };
  const onSeekBackward = () => {
    if (!player) return;
    // player.seekTo(player.getCurrentTime() - 5);
  };
  const onSeekForward = () => {
    if (!player) return;
    // player.seekTo(player.getCurrentTime() + 5);
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <Button variant="ghost" size="icon" onClick={onSeekToStart}>
        <ChevronFirstIcon />
      </Button>
      <Button variant="ghost" size="icon" onClick={onSeekBackward}>
        <ChevronLeftIcon />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleTogglePlay}>
        {playerState === "paused" && <PlayIcon className="fill-current" />}
        {playerState === "playing" && <PauseIcon className="fill-current" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={onSeekForward}>
        <ChevronRightIcon />
      </Button>
      <Button variant="ghost" size="icon" onClick={onSeekToEnd}>
        <ChevronLastIcon />
      </Button>
    </div>
  );
}
