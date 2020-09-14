import moment from 'moment';

const timeConversion = (seconds: number | undefined): string => {
    if (seconds) {
        return moment().startOf('day').seconds(seconds).format('HH:mm:ss');
    } else {
        return '';
    }
}

export default timeConversion;