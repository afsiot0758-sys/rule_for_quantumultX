/*
 * DaysMatter_Lunar.js
 *
 * 基于原版 DaysMatter.js
 *
 * 增加：
 * 1. 我的生日：农历正月廿四
 * 2. 老婆生日：农历五月初四
 * 3. 女儿生日：农历腊月廿五
 * 4. 结婚纪念日：农历九月十四
 * 5. 入职日期：2014年11月3日（公历）
 *
 * 通知：
 * 每天运行时自动通知最近3个项目
 *
 * Loon：
 * $notification.post()
 *
 * Quantumult X：
 * $notify()
 */


// ============================================================
// 1. 原版 DaysMatter.js
// ============================================================

const DAYS_MATTER_SOURCE =
    "https://raw.githubusercontent.com/afsiot0758-sys/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js";


// ============================================================
// 2. 农历数据表
//    1900～2100
// ============================================================

const LUNAR_INFO = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260,
    0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,

    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255,
    0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,

    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40,
    0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,

    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0,
    0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,

    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4,
    0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,

    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0,
    0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,

    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570,
    0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,

    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4,
    0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,

    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a,
    0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,

    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50,
    0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,

    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552,
    0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,

    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9,
    0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,

    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60,
    0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,

    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0,
    0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,

    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577,
    0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,

    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0,
    0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,

    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0,
    0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,

    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6,
    0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,

    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50,
    0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,

    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0,
    0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,

    0x0d520
];


// ============================================================
// 3. 农历基础函数
// ============================================================

function lunarLeapMonth(year) {

    return LUNAR_INFO[year - 1900] & 0x0f;

}


function lunarLeapDays(year) {

    const leapMonth = lunarLeapMonth(year);

    if (!leapMonth) {

        return 0;

    }

    return (LUNAR_INFO[year - 1900] & 0x10000)
        ? 30
        : 29;

}


function lunarMonthDays(year, month) {

    return (LUNAR_INFO[year - 1900] &
        (0x10000 >> month))
        ? 30
        : 29;

}


function lunarYearDays(year) {

    let total = 348;

    for (
        let bit = 0x8000;
        bit > 0x8;
        bit >>= 1
    ) {

        if (LUNAR_INFO[year - 1900] & bit) {

            total++;

        }

    }

    return total + lunarLeapDays(year);

}


// ============================================================
// 4. 农历 → 公历
//    不考虑闰月生日
// ============================================================

function lunarToSolar(year, month, day) {

    if (year < 1900 || year > 2100) {

        throw new Error(
            "农历年份超出1900～2100范围"
        );

    }


    let offset = 0;


    // 1900年开始累计
    for (
        let y = 1900;
        y < year;
        y++
    ) {

        offset += lunarYearDays(y);

    }


    // 累加月份
    const leapMonth = lunarLeapMonth(year);

    for (
        let m = 1;
        m < month;
        m++
    ) {

        offset += lunarMonthDays(year, m);

        if (m === leapMonth) {

            offset += lunarLeapDays(year);

        }

    }


    // 加上日期
    offset += day - 1;


    // 1900-01-31 = 农历1900年正月初一
    const baseDate =
        new Date(1900, 0, 31);


    return new Date(
        baseDate.getTime() +
        offset * 86400000
    );

}


// ============================================================
// 5. 日期格式化
// ============================================================

function pad(number) {

    return String(number).padStart(2, "0");

}


function formatDate(date) {

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate())
    );

}


// ============================================================
// 6. 农历项目
// ============================================================

function createLunarItems(year) {

    return [

        {
            month: 1,
            day: 24,
            name: "我的生日（农历正月廿四）"
        },

        {
            month: 5,
            day: 4,
            name: "老婆生日（农历五月初四）"
        },

        {
            month: 12,
            day: 25,
            name: "女儿生日（农历腊月廿五）"
        },

        {
            month: 9,
            day: 14,
            name: "结婚纪念日（农历九月十四）"
        }

    ].map(function(item) {

        return {

            date: formatDate(
                lunarToSolar(
                    year,
                    item.month,
                    item.day
                )
            ),

            name: item.name

        };

    });

}


// ============================================================
// 7. 入职周年
//
// 2014年11月3日入职
//
// 2026年11月3日 = 12周年
// 2027年11月3日 = 13周年
// ============================================================

function createEmploymentItems(year) {

    const employmentYear = 2014;

    const years = year - employmentYear;

    return [

        {

            date: year + "-11-03",

            name:
                "入职" +
                years +
                "周年（2014年11月3日）"

        }

    ];

}


// ============================================================
// 8. HTTP 获取原版 DaysMatter.js
// ============================================================

function fetchText(url) {

    return new Promise(function(resolve, reject) {

        // Quantumult X
        if (
            typeof $task !== "undefined" &&
            $task.fetch
        ) {

            $task.fetch({

                url: url

            }).then(function(response) {

                resolve(response.body);

            }).catch(function(error) {

                reject(error);

            });

            return;

        }


        // Loon / Surge / Stash 等
        if (
            typeof $httpClient !== "undefined" &&
            $httpClient.get
        ) {

            $httpClient.get(

                {
                    url: url
                },

                function(error, response, body) {

                    if (error) {

                        reject(error);

                        return;

                    }

                    resolve(body);

                }

            );

            return;

        }


        reject(
            new Error(
                "当前环境不支持HTTP请求"
            )
        );

    });

}


// ============================================================
// 9. 主程序
// ============================================================

async function main() {

    try {

        // 获取原版 DaysMatter.js
        let source =
            await fetchText(
                DAYS_MATTER_SOURCE
            );


        // ====================================================
        // 找到原版日期数组
        // ====================================================

        const dateMarker =
            "let dateDiffArray = []";


        if (
            source.indexOf(dateMarker) === -1
        ) {

            throw new Error(
                "未找到 DaysMatter.js 的日期数组位置"
            );

        }


        // ====================================================
        // 当前年份
        // ====================================================

        const currentYear =
            new Date().getFullYear();


        // ====================================================
        // 添加：
        //
        // 当前年农历生日
        // 下一年农历生日
        //
        // 当前年入职周年
        // 下一年入职周年
        // ====================================================

        const extraItems = [];


        // 当前年
        extraItems.push(
            ...createLunarItems(
                currentYear
            )
        );

        extraItems.push(
            ...createEmploymentItems(
                currentYear
            )
        );


        // 下一年
        extraItems.push(
            ...createLunarItems(
                currentYear + 1
            )
        );

        extraItems.push(
            ...createEmploymentItems(
                currentYear + 1
            )
        );


        // ====================================================
        // 注入日期
        // ====================================================

        const injection = `

/* ========================================================
 * DaysMatter Lunar + Employment
 * ======================================================== */

(function () {

    const extraItems =
        ${JSON.stringify(extraItems)};

    extraItems.forEach(function (item) {

        daysData.push(item);

    });

})();

`;


        source =
            source.replace(
                dateMarker,
                dateMarker +
                injection
            );


        // ====================================================
        // 找到原版通知位置
        // ====================================================

        const notifyMarker =
            "// $.msg(title, '', notifyContent)";


        if (
            source.indexOf(notifyMarker) === -1
        ) {

            throw new Error(
                "未找到 DaysMatter.js 的通知位置"
            );

        }


        // ====================================================
        // 跨平台通知
        //
        // Loon：
        // $notification.post()
        //
        // Quantumult X：
        // $notify()
        //
        // 其他：
        // $.msg()
        // ====================================================

        const notifyCode = `

if (
    typeof $notification !== "undefined" &&
    $notification.post
) {

    $notification.post(
        title,
        "最近 3 个",
        notifyContent
    );

} else if (
    typeof $notify !== "undefined"
) {

    $notify(
        title,
        "最近 3 个",
        notifyContent
    );

} else {

    $.msg(
        title,
        "最近 3 个",
        notifyContent
    );

}

`;


        source =
            source.replace(
                notifyMarker,
                notifyCode +
                "\n" +
                notifyMarker
            );


        // ====================================================
        // 执行修改后的 DaysMatter.js
        // ====================================================

        eval(source);


    } catch (error) {

        console.log(
            "DaysMatter_Lunar：" +
            (
                error.message ||
                error
            )
        );


        if (
            typeof $done === "function"
        ) {

            $done();

        }

    }

}


// ============================================================
// 10. 启动
// ============================================================

main();
