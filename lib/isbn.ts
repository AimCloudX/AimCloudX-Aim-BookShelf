function isISBN10(isbn: string) {
  // ハイフンや空白を除去
  var digits = isbn.replace(/[\- ]/g, '')

  // ISBN-10は9桁数字 + 1桁(数字またはX)
  // 例: 0-306-40615-2 や 0306406152
  if (!/^\d{9}[\dX]$/.test(digits)) {
    return false
  }

  // チェックサム計算
  // ISBN-10の計算ルール: Σ(i番目の数字 × i) (iは1から10)
  // 最後の桁がXの場合は10とみなす
  var sum = 0
  for (var i = 0; i < 9; i++) {
    sum += (i + 1) * parseInt(digits.charAt(i), 10)
  }
  // 最後の桁
  var lastChar = digits.charAt(9)
  sum += lastChar === 'X' ? 10 * 10 : 10 * parseInt(lastChar, 10)

  return sum % 11 === 0
}

// ISBN-13形式・チェックサム検証
function isISBN13(isbn: string) {
  // ハイフンや空白を除去
  var digits = isbn.replace(/[\- ]/g, '')

  // ISBN-13は13桁数字のみ
  // 例: 978-3-16-148410-0 や 9783161484100
  if (!/^\d{13}$/.test(digits)) {
    return false
  }

  // チェックサム計算
  // ISBN-13の計算ルール: Σ(各桁 * 1または3)
  // 偶数目(0開始で奇数インデックス)が3倍、それ以外が1倍
  var sum = 0
  for (var i = 0; i < 12; i++) {
    var digit = parseInt(digits.charAt(i), 10)
    sum += i % 2 === 0 ? digit : digit * 3
  }
  // 検査数字計算
  var checkDigit = (10 - (sum % 10)) % 10

  return checkDigit === parseInt(digits.charAt(12), 10)
}

// ISBNかどうか判断（ISBN-10もしくはISBN-13）
export default function isISBN(isbn: string) {
  return isISBN10(isbn) || isISBN13(isbn)
}
