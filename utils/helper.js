export const findStandardDeviation = (arr) => {
    const n = arr.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += arr[i];
    }
    const mean = sum / n;
    let variance = 0;
    for (let i = 0; i < n; i++) {
      variance += Math.pow(arr[i] - mean, 2);
    }
    const standardDeviation = Math.sqrt(variance / n);
    return standardDeviation;
}