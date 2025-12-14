import type { Album, AlbumArtist, Song } from '/@/shared/types/domain-types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import formatDuration from 'format-duration';
import i18next from 'i18next';

import { Rating } from '/@/shared/components/rating/rating';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const FORMATS_EN: Record<number, string> = Object.freeze({
    0: 'YYYY',
    1: 'MMM YYYY',
    2: 'MMM D, YYYY',
});

const FORMATS_JA: Record<number, string> = Object.freeze({
    0: 'YYYY年',
    1: 'YYYY年M月',
    2: 'YYYY年M月D日',
});

const getDateFormat = (key: string): string => {
    const dashes = Math.min(key.split('-').length - 1, 2);
    const isJapanese = i18next.language?.startsWith('ja');
    
    return isJapanese ? FORMATS_JA[dashes] : FORMATS_EN[dashes];
};

export const formatDateAbsolute = (key: null | string) =>
    key ? dayjs(key).format(getDateFormat(key)) : '';

export const formatDateAbsoluteUTC = (key: null | string) =>
    key ? dayjs.utc(key).format(getDateFormat(key)) : '';

export const formatHrDateTime = (key: null | string) =>
    key ? dayjs(key).format('YYYY-MM-DD HH:mm') : '';

export const formatDateRelative = (key: null | string) => (key ? dayjs(key).fromNow() : '');

export const formatDurationString = (duration: number) => {
    const rawDuration = formatDuration(duration).split(':');
    const isJapanese = i18next.language?.startsWith('ja');

    let string;

    if (isJapanese) {
        switch (rawDuration.length) {
            case 1:
                string = `${rawDuration[0]}秒`;
                break;
            case 2:
                string = `${rawDuration[0]}分 ${rawDuration[1]}秒`;
                break;
            case 3:
                string = `${rawDuration[0]}時間 ${rawDuration[1]}分 ${rawDuration[2]}秒`;
                break;
            case 4:
                string = `${rawDuration[0]}日 ${rawDuration[1]}時間 ${rawDuration[2]}分 ${rawDuration[3]}秒`;
                break;
        }
    } else {
        switch (rawDuration.length) {
            case 1:
                string = `${rawDuration[0]} sec`;
                break;
            case 2:
                string = `${rawDuration[0]} min ${rawDuration[1]} sec`;
                break;
            case 3:
                string = `${rawDuration[0]} hr ${rawDuration[1]} min ${rawDuration[2]} sec`;
                break;
            case 4:
                string = `${rawDuration[0]} day ${rawDuration[1]} hr ${rawDuration[2]} min ${rawDuration[3]} sec`;
                break;
        }
    }

    return string;
};

export const formatDurationStringShort = (duration: number) => {
    const rawDuration = formatDuration(duration).split(':');
    return `${rawDuration[0]}h ${rawDuration[1]}m`;
};

export const formatRating = (item: Album | AlbumArtist | Song) =>
    item.userRating !== null ? <Rating readOnly value={item.userRating} /> : null;

const SIZES = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

export const formatSizeString = (size?: number): string => {
    let count = 0;
    let finalSize = size ?? 0;
    while (finalSize > 1024) {
        finalSize /= 1024;
        count += 1;
    }

    return `${finalSize.toFixed(2)} ${SIZES[count]}`;
};
