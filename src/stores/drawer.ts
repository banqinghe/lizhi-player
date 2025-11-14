/**
 * @file 控制播放页和播放列表抽屉开闭状态
 */

import { atom, useAtomValue, useSetAtom } from 'jotai';

const playListOpenAtom = atom<boolean>(false);
const playDrawerOpenAtom = atom<boolean>(false);

export function usePlayListOpen() {
    return useAtomValue(playListOpenAtom);
}

export function useSetPlayListOpen() {
    return useSetAtom(playListOpenAtom);
}

export function usePlayDrawerOpen() {
    return useAtomValue(playDrawerOpenAtom);
}

export function useSetPlayDrawerOpen() {
    return useSetAtom(playDrawerOpenAtom);
}
