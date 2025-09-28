export function removeDuplicatesFromArray<T>(data: T[], key: keyof T) {
  const hash = new Set<T[keyof T]>();

  return data.filter((item) => {
    const isExists = hash.has(item[key]);
    return isExists ? false : hash.add(item[key]);
  });
}
