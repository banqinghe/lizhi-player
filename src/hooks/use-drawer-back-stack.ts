import { useEffect, useRef } from 'react';

/**
 * 单个 Drawer 在栈中的描述
 */
interface DrawerItem {
    id: string;
    onClose: () => void;
}

/**
 * 全局 Drawer 栈：后打开的在栈顶
 */
const drawerStack: DrawerItem[] = [];

/**
 * 关闭栈顶 Drawer，返回是否真的处理了一个 Drawer
 */
function closeTopDrawer(): boolean {
    const top = drawerStack[drawerStack.length - 1];
    if (!top) return false;

    // 先出栈，再调用 onClose，避免 onClose 内部又操作栈导致混乱
    drawerStack.pop();
    top.onClose();
    return true;
}

let isPopStateListenerAttached = false;

/**
 * 确保全局只注册一次 popstate 监听
 */
function ensurePopStateListener() {
    if (isPopStateListenerAttached) return;
    if (typeof window === 'undefined') return;

    window.addEventListener('popstate', (event) => {
        const handled = closeTopDrawer();

        if (handled) {
            // 这里不再 pushState，只消费掉一层虚拟 history：
            // - 每次 Drawer 打开时已经 push 了一层
            // - 每次 back（popstate）只关闭一层栈顶 Drawer
            //   当所有 Drawer 都关闭后，下一次 back 才真正回到上一个页面
            event.preventDefault?.();
        }
        // 如果没有 Drawer 打开，则不做处理，让 React Router 自己处理真正的路由回退。
    });

    isPopStateListenerAttached = true;
}

/**
 * 在 Drawer 组件中使用：
 * - isOpen: 当前 Drawer 是否打开
 * - onClose: 关闭 Drawer 的回调（例如 setOpen(false)）
 *
 * 当 isOpen 从 false -> true 时：pushState + 入栈
 * 当 isOpen 从 true -> false 时：从栈中移除
 */
export function useDrawerBackStack(isOpen: boolean, onClose: () => void) {
    const wasOpenRef = useRef(false);
    const idRef = useRef<string>('');

    if (!idRef.current) {
        idRef.current = `drawer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        ensurePopStateListener();

        const wasOpen = wasOpenRef.current;

        // 关闭 -> 打开
        if (!wasOpen && isOpen) {
            wasOpenRef.current = true;

            // push 一层虚拟 history 状态，用来拦截一次 back
            history.pushState({ drawerVirtual: true }, '');

            drawerStack.push({
                id: idRef.current,
                onClose,
            });
        }

        // 打开 -> 关闭（包括主动关闭和交互关闭）
        if (wasOpen && !isOpen) {
            wasOpenRef.current = false;

            const index = drawerStack.findIndex(item => item.id === idRef.current);
            if (index !== -1) {
                drawerStack.splice(index, 1);
            }
        }
    }, [isOpen, onClose]);
}
