/**
 * 数字を3桁カンマ区切りにする
 * @param money
 * @returns {string}
 */
export const formatMoney = (money: string | number): string => {
  return Number(money).toLocaleString()
}
/**
 * DBから取得した日時をスラッシュ(/)区切りにする
 * ex. yyyy-mm-dd-hh:mm:ss → yyyy/mm/dd hh:mm:ss
 * @param date
 * @returns {string}
 */
export const formatDBDate = (date: string): string => {
  return date.replace(/(\d{4})\-(\d{2})\-(\d{2})-/, '$1/$2/$3 ')
}
/**
 * 指定したDateオブジェクトの日時を指定した区切り文字に変換する
 * typeに year, month, day を指定することで指定したところのまでをstringで返す
 * defaultはday
 * ex. yyyy/mm/dd
 * ex. year: yyyy, month: yyyy/mm, day: yyyy/mm/dd
 * @param date
 * @param type
 * @param delimiter
 * @returns {string}
 */
export const formatDate = (
  date: Date,
  type: string = 'day',
  delimiter: string = '/',
): string => {
  const year = date.getFullYear()
  const month = ('00' + (date.getMonth() + 1)).slice(-2)
  const day = ('00' + date.getDate()).slice(-2)

  if (type === 'year') {
    return `${year}`
  } else if (type === 'month') {
    return `${year}${delimiter}${month}`
  }

  return `${year}${delimiter}${month}${delimiter}${day}`
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
  }
  return '不明'
}
/**
 * capital-history.categoryTypeを画面表示用に変換する
 * @param categoryType
 * @returns {string}
 */
export const formatCategoryType = (categoryType: number): string => {
  return categoryType === 0 ? '収入' : '支出'
}
