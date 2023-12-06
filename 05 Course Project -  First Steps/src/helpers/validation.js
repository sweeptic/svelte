export function isEmpty(val) {
    console.log('val', val);

    return val.trim().length === 0;
}

export function isValidEmail(val) {
    return val.includes('@');
}
