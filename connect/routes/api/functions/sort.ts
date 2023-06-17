export function insertionSort<T>(arr: T[], key: keyof T | string): T[] {
    for (let i = 1; i < arr.length; i++) {
      const currVal = arr[i];
      let j = i - 1;
  
      while (j >= 0 && String(arr[j][key as keyof T]) > String(currVal[key as keyof T])) {
        arr[j + 1] = arr[j];
        j--;
      }
  
      arr[j + 1] = currVal;
    }
  
    return arr;
}

