import moment from 'moment';

export const getHHMMFromUTC = (utc: number) => {
    return moment.utc(utc).format('HH:mm');
};
