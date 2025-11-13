import { Slider } from '@base-ui-components/react/slider';

interface PlaySliderProps {
    className?: string;
}

export default function PlaySlider(props: PlaySliderProps) {
    const { className } = props;

    return (
        <Slider.Root className={className} defaultValue={25}>
            <Slider.Control className="flex w-full touch-none items-center py-2 select-none">
                <Slider.Track className="h-1 w-full rounded bg-stone-500 select-none">
                    <Slider.Indicator className="rounded bg-stone-50 select-none" />
                    <Slider.Thumb className="size-2 rounded-full bg-stone-50 outline-none" />
                </Slider.Track>
            </Slider.Control>
            <div className="flex justify-between text-[10px] text-stone-400">
                <span>0:05</span>
                <span>0:15</span>
            </div>
        </Slider.Root>
    );
}
