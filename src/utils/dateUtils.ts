import moment from 'moment';

export const getHHMMFromUTC = (utc: number) => {
    return moment.utc(utc).format('HH:mm');
};

export const getLastSeenFromUTC = (utc: number) => {
    return moment.utc(utc).fromNow();
};
