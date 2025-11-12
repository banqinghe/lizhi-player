export interface Song {
    /** 歌曲所属的专辑 ID */
    albumId: number;
    /** 歌曲 ID */
    songId: number;
    /** 歌曲名称 */
    name: string;
    /** 音源 URL */
    url: string;
}

export interface Album {
    /** 专辑 ID */
    albumId: number;
    /** 专辑名称 */
    name: string;
    /** 出版年份 */
    year: number;
    /** 专辑封面图片地址 */
    cover: string;
    /** 专辑内的歌曲列表 */
    songs: Song[];
}

export interface Source {
    albums: Album[];
}
