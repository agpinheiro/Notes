export const handleReplacementItem = (
  arr: any[],
  index: number,
  item: any,
): any[] => {
  const newArr = [...arr];
  newArr[index] = item;
  return newArr;
};
