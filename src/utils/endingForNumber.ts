const endingForNumber = (num: number | undefined): string => {
    let ending = '';
    const exceptions = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    const secondGroup = [2, 3, 4];
    const thirdGroup = [5, 6, 7, 8, 9, 0];

    if (num) {
        if (exceptions.find((item) => item === num)) {
            ending = 'й';
        } else {
            if (num % 10 === 1) {
                ending = 'я';
            }
            if (secondGroup.find((item) => item === num % 10) !== undefined) {
                ending = 'и';
            }
            if (thirdGroup.find((item) => item === num % 10) !== undefined) {
                ending = 'й';
            }
        }
    }

    return ending;
}

export default endingForNumber;