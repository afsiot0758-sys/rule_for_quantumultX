/*
 * DaysMatter 农历增强版
 *
 * 本文件不修改原版 DaysMatter.js，而是在运行时读取你自己仓库里的原版，
 * 在原版 daysData 中追加 4 个普通农历日期，再继续执行原脚本。
 *
 * 农历日期（均为普通月，不使用闰月）：
 * 我的生日：正月廿四
 * 老婆生日：五月初四
 * 女儿生日：腊月廿五
 * 结婚纪念日：九月十四
 *
 * 你的原版地址：
 * https://raw.githubusercontent.com/afsiot0758-sys/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js
 */

const DAYS_MATTER_SOURCE =
  'https://raw.githubusercontent.com/afsiot0758-sys/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js'

// 1900-2100 年农历数据
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x04b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
]

function leapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0x0f
}

function leapDays(year) {
  const lm = leapMonth(year)
  if (!lm) return 0
  return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29
}

function lunarYearDays(year) {
  let sum = 348
  const info = LUNAR_INFO[year - 1900]

  for (let bit = 0x8000; bit > 0x8; bit >>= 1) {
    if (info & bit) sum++
  }

  return sum + leapDays(year)
}

function lunarMonthDays(year, month) {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29
}

// 普通农历月 → 公历
// 本脚本固定不使用闰月
function lunarToSolar(year, month, day) {
  if (year < 1900 || year > 2100) return null
  if (month < 1 || month > 12) return null
  if (day < 1 || day > lunarMonthDays(year, month)) return null

  let offset = 0

  for (let y = 1900; y < year; y++) {
    offset += lunarYearDays(y)
  }

  for (let m = 1; m < month; m++) {
    offset += lunarMonthDays(year, m)

    if (leapMonth(year) === m) {
      offset += leapDays(year)
    }
  }

  offset += day - 1

  const date = new Date(1900, 0, 31)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offset)

  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate()
  )
}

function getHttp(url, callback) {
  if (typeof $httpClient !== 'undefined' && $httpClient.get) {
    $httpClient.get(url, callback)
    return
  }

  if (typeof $task !== 'undefined' && $task.fetch) {
    $task.fetch({ url: url }).then(
      function (resp) {
        callback(null, resp, resp.body)
      },
      function (err) {
        callback(err, null, null)
      }
    )
    return
  }

  callback(new Error('当前环境不支持 HTTP 请求'), null, null)
}

function addLunarDates(source) {
  // 原版 DaysMatter.js 中：
  // let dateDiffArray = []
  // startWork()

  const marker = 'let dateDiffArray = []'

  if (source.indexOf(marker) === -1) {
    throw new Error(
      '未找到 DaysMatter.js 的 dateDiffArray 初始化位置'
    )
  }

  const lunarCode = `
/* ===== DaysMatter Lunar Extension ===== */

;(function () {

  const lunarItems = [
    {
      month: 1,
      day: 24,
      name: '我的生日（农历正月廿四）'
    },
    {
      month: 5,
      day: 4,
      name: '老婆生日（农历五月初四）'
    },
    {
      month: 12,
      day: 25,
      name: '女儿生日（农历腊月廿五）'
    },
    {
      month: 9,
      day: 14,
      name: '结婚纪念日（农历九月十四）'
    }
  ]

  /*
   * 前一年、今年、下一年都计算。
   * 这样农历腊月日期落到公历下一年时也不会漏掉。
   */

  ;[tnowY - 1, tnowY, tnowY + 1].forEach(
    function (lunarYear) {

      lunarItems.forEach(
        function (item) {

          const solar = lunarToSolar(
            lunarYear,
            item.month,
            item.day
          )

          if (solar) {
            daysData.push({
              date: solar,
              name: item.name
            })
          }

        }
      )

    }
  )

})()

/* ===== End Lunar Extension ===== */
`

  return source.replace(
    marker,
    marker + '\n' + lunarCode
  )
}

getHttp(
  DAYS_MATTER_SOURCE,
  function (error, response, body) {

    if (error || !body) {

      if (
        typeof $notification !== 'undefined' &&
        $notification.post
      ) {
        $notification.post(
          'DaysMatter',
          '脚本加载失败',
          '无法读取你自己的 DaysMatter.js'
        )
      }

      if (typeof $done !== 'undefined') {
        $done()
      }

      return
    }

    try {

      eval(addLunarDates(body))

    } catch (e) {

      if (
        typeof $notification !== 'undefined' &&
        $notification.post
      ) {
        $notification.post(
          'DaysMatter',
          '脚本执行失败',
          String(e)
        )
      }

      if (typeof $done !== 'undefined') {
        $done()
      }
    }
  }
)
