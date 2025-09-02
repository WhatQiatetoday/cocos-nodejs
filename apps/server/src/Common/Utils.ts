export const toFixed = (num: number, digit: number = 3) => {
    const scale = 10 ** digit;
    return Math.floor(num * scale) / scale;
}

export const randomBySeed = (seed: number) => {
    return (seed * 9301 + 49297) % 233280
}