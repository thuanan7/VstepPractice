function setData<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getData<T>(key: string) {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data) as T;
  }
  return undefined;
}
export { setData, getData };
