/**
 * 数字を3桁カンマ区切りにする
 * @param money
 * @returns {string}
 */
export const formatMoney = (money: string | number): string => {
  return Number(money).toLocaleString()
}
/**
 * 日時をスラッシュ(/)区切りにする
 * @param date
 * @returns {string}
 */
export const formatDate = (date: string): string => {
  return date.replace(/(\d{4})\-(\d{2})\-(\d{2})-/, '$1/$2/$3 ')
}
/**
 * capital-history.statusの状態を画面表示用に変換する
 * @param status
 * @returns {string}
 */
export const formatStatus = (status: number): string => {
  switch (status) {
    case 0:
      return '登録'
    case 1:
      return '編集'
    case 2:
      return '削除'
    case 3:
      return '清算'
  }
  return '不明'
}
/**
 * capital-history.categoryTypeを画面表示用に変換する
 * @param categoryType
 * @returns
 */
export const formatCategoryType = (categoryType: number): string => {
  return categoryType === 0 ? '収入' : '支出'
}
