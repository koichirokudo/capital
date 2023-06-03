/**
 * 数字を3桁カンマ区切りにする
 * currency が true の場合は円マークをつけて返す
 * @param money
 * @param currency
 * @returns {string}
 */
export const formatMoney = (
  money: string | number,
  currency?: boolean,
): string => {
  if (currency) {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    })
      .format(Number(money))
      .toLocaleString()
  }
  return Number(money).toLocaleString()
}
/**
 * DBから取得した日時をスラッシュ(/)区切りにする
 * ex. yyyy-mm-dd-hh:mm:ss -> yyyy/mm/dd hh:mm:ss
 * @param date
 * @returns {string}
 */
export const formatDBDate = (date: string): string => {
  return date.replace(/(\d{4})-(\d{2})-(\d{2})-/, '$1/$2/$3 ')
}
/**
 * Date オブジェクトを年月日に分割して返す
 * ex. [2023, 01, 02]
 * ex. [2023,  1,  2]
 * @param date
 * @param slice
 * @returns
 */
const splitDate = (date: Date, slice = -2): string[] => {
  const year = date.getFullYear().toString()
  const month = ('00' + (date.getMonth() + 1)).slice(slice)
  const day = ('00' + date.getDate()).slice(slice)

  return [year, month, day]
}

/**
 * 年月日のいずれかを指定されたものを string 型にして返す
 * ex. year  -> 2023
 * ex. month -> 01
 * ex. day   -> 02
 * @param date
 * @param type
 * @param slice
 * @returns
 */
export const getSpecificDate = (
  date: Date,
  type = 'day',
  slice?: number,
): string => {
  const [year, month, day] = splitDate(date, slice)
  if (type === 'year') {
    return `${year}`
  } else if (type === 'month') {
    return `${month}`
  }

  return `${day}`
}

/**
 * 指定したDateオブジェクトの日時を返す
 * 区切り文字の指定ができる
 * ex. yyyy/mm/dd
 * ex. yyyy-mm-dd
 * @param date
 * @param delimiter
 * @returns {string}
 */
export const getFullDate = (date: Date, delimiter = '/'): string => {
  const [year, month, day] = splitDate(date)
  return `${year}${delimiter}${month}${delimiter}${day}`
}

/**
 * タイムゾーンの調整
 * @param date
 */
export const adjustTimezone = (date: Date): void => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
}

/**
 * UTCでシリアライズされた日付(2023-05-31T15:00:00.000Z)を
 * ISO8601(2023-05-31)に変換する
 * @param date
 * @returns {string}
 */
export const formattedISO8601 = (date: Date): string => {
  return date.toISOString().split('T')[0]
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
 * capital-history.capitalTypeを画面表示用に変換する
 * @param capitalType
 * @returns {string}
 */
export const formatCapitalType = (capitalType: number): string => {
  return capitalType === 0 ? '収入' : '支出'
}
