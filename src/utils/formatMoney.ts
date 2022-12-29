/**
 * 数字を3桁カンマ区切りにする
 * @param money
 * @returns {string}
 */
export const formatMoney = (money: string | number) => {
  return Number(money).toLocaleString()
}
