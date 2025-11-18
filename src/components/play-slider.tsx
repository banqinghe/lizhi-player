import { Slider } from '@base-ui-components/react/slider';
import { useCurPlay, useSeekTo } from '@/stores/cur-play';
import { cn, formatSeconds } from '@/utils';

interface PlaySliderProps {
    className?: string;
}

export default function PlaySlider(props: PlaySliderProps) {
    const { className } = props;

    const curPlay = useCurPlay();
    const seekTo = useSeekTo();
    const bufferedPercent = curPlay?.duration ? (curPlay.buffered / curPlay.duration) * 100 : 0;
    const isBuffering = Boolean(curPlay?.isBuffering && curPlay?.isPlaying);

    const handleValueChange = (value: number) => {
        seekTo(value);
    };

    return (
        <Slider.Root
            className={className}
            value={curPlay?.currentTime || 0}
            min={0}
            max={curPlay?.duration || 1}
            onValueChange={handleValueChange}
            disabled={!curPlay?.duration}
        >
            <Slider.Control className="flex w-full touch-none items-center py-2 select-none">
                <Slider.Track className="relative h-1 w-full rounded bg-stone-500 select-none overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-stone-400/60"
                        style={{ width: `${Math.min(bufferedPercent, 100)}%` }}
                    />
                    <Slider.Indicator className="relative rounded bg-stone-50 select-none" />
                    <Slider.Thumb
                        className={cn('size-2 rounded-full bg-stone-50 outline-none', { 'animate-pulse': isBuffering })}
                    />
                </Slider.Track>
            </Slider.Control>
            <div className="flex justify-between text-[10px] text-stone-400">
                <span>{formatSeconds(curPlay?.currentTime || 0)}</span>
                <span>{formatSeconds(curPlay?.duration || 0)}</span>
            </div>
        </Slider.Root>
    );
}
