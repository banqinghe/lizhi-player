import { Slider } from '@base-ui-components/react/slider';
import { useCurPlay, useSeekTo } from '@/stores/cur-play';
import { formatSeconds } from '@/utils';

interface PlaySliderProps {
    className?: string;
}

export default function PlaySlider(props: PlaySliderProps) {
    const { className } = props;

    const curPlay = useCurPlay();
    const seekTo = useSeekTo();

    return (
        <Slider.Root
            className={className}
            value={curPlay?.currentTime || 0}
            min={0}
            max={curPlay?.duration || 1}
            onValueChange={seekTo}
            disabled={!curPlay?.duration}
        >
            <Slider.Control className="flex w-full touch-none items-center py-2 select-none">
                <Slider.Track className="h-1 w-full rounded bg-stone-500 select-none">
                    <Slider.Indicator className="rounded bg-stone-50 select-none" />
                    <Slider.Thumb className="size-2 rounded-full bg-stone-50 outline-none" />
                </Slider.Track>
            </Slider.Control>
            <div className="flex justify-between text-[10px] text-stone-400">
                <span>{formatSeconds(curPlay?.currentTime || 0)}</span>
                <span>{formatSeconds(curPlay?.duration || 0)}</span>
            </div>
        </Slider.Root>
    );
}
