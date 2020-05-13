const timeConversion = (seconds: number | undefined): string => {
    let time = '';
    if (seconds) {
        if (seconds > 59) {
            if (seconds > 3599) {
                time = (Math.floor(seconds / 3600) >= 10 ? Math.floor(seconds / 3600) : '0' + Math.floor(seconds / 3600)) + ':' + ((Math.floor((seconds - 3600) / 60) >= 10 ? (Math.floor((seconds - 3600) / 60)) : '0' + (Math.floor((seconds - 3600) / 60))) + ':' + ((seconds - 3600) % 60 >= 10 ? (seconds - 3600) % 60 : '0' + (seconds - 3600) % 60));

            } else {
                time = '00:' + (Math.floor(seconds / 60) >= 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60)) + ':' + (seconds % 60 >= 10 ? seconds % 60 : '0' + seconds % 60);
            }
        } else {
            time = '00:00:' + (seconds >= 10 ? seconds : '0' + seconds);
        }
    }
    return time;
}

export default timeConversion;