import { Toast } from '@base-ui-components/react/toast';

export function ToastPortal() {
    return (
        <Toast.Portal>
            <Toast.Viewport className="fixed z-10 top-10 right-0 bottom-auto left-0 mx-auto flex w-full max-w-[300px]">
                <ToastList />
            </Toast.Viewport>
        </Toast.Portal>
    );
}

function ToastList() {
    const { toasts } = Toast.useToastManager();
    return toasts.map(toast => (
        <Toast.Root
            key={toast.id}
            toast={toast}
            swipeDirection="up"
            className="[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)+(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))] absolute right-0 top-0 left-0 z-[calc(1000-var(--toast-index))] mx-auto w-fit origin-top transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-lg border border-stone-700 bg-stone-800 bg-clip-padding p-4 shadow-lg select-none after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-ending-style:opacity-0 data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(-150%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] h-(--height) data-expanded:h-(--toast-height) [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]"
        >
            <Toast.Content className="overflow-hidden transition-opacity duration-150 data-behind:pointer-events-none data-behind:opacity-0 data-expanded:pointer-events-auto data-expanded:opacity-100">
                <Toast.Title className="text-[0.975rem] leading-5 font-medium" />
                <Toast.Description className="text-[0.925rem] leading-5" />
            </Toast.Content>
        </Toast.Root>
    ));
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const toastManager = Toast.useToastManager();
    return (text: string) => {
        toastManager.add({
            title: text,
            timeout: 500,
        });
    };
}
