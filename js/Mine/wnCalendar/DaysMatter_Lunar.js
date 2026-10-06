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
// 原版 DaysMatter.js
// ============================================================

const DAYS_MATTER_SOURCE =
    "https://raw.githubusercontent.com/afsiot0758-sys/rule_for_quantumultX/master/js/Mine/wnCalendar/DaysMatter.js";


// ============================================================
// 农历数据表
// 1900～2100
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
    0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,

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

    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0,
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
// 农历基础函数
// ============================================================

function lunarLeapMonth(year) {

    return LUNAR_INFO[year - 1900] & 0x0f;

}


function lunarLeapDays(year) {

    var leapMonth =
        lunarLeapMonth(year);

    if (!leapMonth) {

        return 0;

    }

    return (
        LUNAR_INFO[year - 1900] &
        0x10000
    ) ? 30 : 29;

}


function lunarMonthDays(year, month) {

    return (
        LUNAR_INFO[year - 1900] &
        (0x10000 >> month)
    ) ? 30 : 29;

}


function lunarYearDays(year) {

    var total = 348;

    for (
        var bit = 0x8000;
        bit > 0x8;
        bit >>= 1
    ) {

        if (
            LUNAR_INFO[year - 1900] &
            bit
        ) {

            total++;

        }

    }

    return (
        total +
        lunarLeapDays(year)
    );

}


// ============================================================
// 农历日期 → 公历日期
//
// 基准：1900年1月31日 = 农历1900年正月初一
//
// 本功能不处理“闰月生日”
// ============================================================

function lunarToSolar(
    year,
    month,
    day
) {

    if (
        year < 1900 ||
        year > 2100
    ) {

        throw new Error(
            "农历年份超出1900～2100范围"
        );

    }


    var offset = 0;


    // 累加1900年至目标年前一年的天数
    for (
        var y = 1900;
        y < year;
        y++
    ) {

        offset +=
            lunarYearDays(y);

    }


    // 累加目标年之前的月份
    var leapMonth =
        lunarLeapMonth(year);

    for (
        var m = 1;
        m < month;
        m++
    ) {

        offset +=
            lunarMonthDays(
                year,
                m
            );


        if (
            m === leapMonth
        ) {

            offset +=
                lunarLeapDays(year);

        }

    }


    // 加上日期
    offset +=
        day - 1;


    var baseDate =
        new Date(
            1900,
            0,
            31
        );


    return new Date(
        baseDate.getTime() +
        offset * 86400000
    );

}


// ============================================================
// 日期格式化
// ============================================================

function pad2(number) {

    return String(
        number
    ).padStart(2, "0");

}


function formatDate(date) {

    return (
        date.getFullYear() +
        "-" +
        pad2(
            date.getMonth() + 1
        ) +
        "-" +
        pad2(
            date.getDate()
        )
    );

}


// ============================================================
// 创建农历项目
// ============================================================

function createLunarItems(year) {

    var definitions = [

        [
            1,
            24,
            "我的生日（农历正月廿四）"
        ],

        [
            5,
            4,
            "老婆生日（农历五月初四）"
        ],

        [
            12,
            25,
            "女儿生日（农历腊月廿五）"
        ],

        [
            9,
            14,
            "结婚纪念日（农历九月十四）"
        ]

    ];


    var result = [];


    for (
        var i = 0;
        i < definitions.length;
        i++
    ) {

        var item =
            definitions[i];


        result.push({

            date: formatDate(
                lunarToSolar(
                    year,
                    item[0],
                    item[1]
                )
            ),

            name: item[2]

        });

    }


    return result;

}


// ============================================================
// 创建入职周年
//
// 入职日期：2014年11月3日
// ============================================================

function createEmploymentItem(
    year
) {

    var years =
        year - 2014;


    return {

        date:
            year +
            "-11-03",

        name:
            "入职" +
            years +
            "周年（2014年11月3日）"

    };

}


// ============================================================
// 获取原版 DaysMatter.js
// ============================================================

function fetchText(url) {

    return new Promise(
        function (
            resolve,
            reject
        ) {


            // --------------------------------------------
            // Quantumult X
            // --------------------------------------------

            if (
                typeof $task !==
                    "undefined" &&
                $task.fetch
            ) {

                $task.fetch({

                    url: url

                }).then(
                    function (response) {

                        resolve(
                            response.body
                        );

                    }
                ).catch(
                    function (error) {

                        reject(error);

                    }
                );


                return;

            }


            // --------------------------------------------
            // Loon / Surge / Stash
            // --------------------------------------------

            if (
                typeof $httpClient !==
                    "undefined" &&
                $httpClient.get
            ) {

                $httpClient.get(

                    {
                        url: url
                    },

                    function (
                        error,
                        response,
                        body
                    ) {

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

        }
    );

}


// ============================================================
// 主程序
// ============================================================

async function main() {

    try {


        // --------------------------------------------
        // 获取原版 DaysMatter.js
        // --------------------------------------------

        var source =
            await fetchText(
                DAYS_MATTER_SOURCE
            );


        // --------------------------------------------
        // 找到原版 daysData
        // --------------------------------------------

        var daysMarker =
            "let daysData = []";


        if (
            source.indexOf(
                daysMarker
            ) === -1
        ) {

            throw new Error(
                "未找到 DaysMatter.js 的 daysData 定义位置"
            );

        }


        // --------------------------------------------
        // 当前年份
        // --------------------------------------------

        var currentDate =
            new Date();

        var currentYear =
            currentDate.getFullYear();


        // --------------------------------------------
        // 创建自定义日期
        // --------------------------------------------

        var extraItems = [];


        // 当前年农历
        var lunarCurrent =
            createLunarItems(
                currentYear
            );


        // 下一年农历
        var lunarNext =
            createLunarItems(
                currentYear + 1
            );


        // 加入当前年农历
        for (
            var i = 0;
            i < lunarCurrent.length;
            i++
        ) {

            extraItems[
                extraItems.length
            ] = lunarCurrent[i];

        }


        // 加入下一年农历
        for (
            var j = 0;
            j < lunarNext.length;
            j++
        ) {

            extraItems[
                extraItems.length
            ] = lunarNext[j];

        }


        // 当前年入职周年
        extraItems[
            extraItems.length
        ] =
            createEmploymentItem(
                currentYear
            );


        // 下一年入职周年
        extraItems[
            extraItems.length
        ] =
            createEmploymentItem(
                currentYear + 1
            );


        // --------------------------------------------
        // 注入原版 daysData
        // --------------------------------------------

        var injection =
            daysMarker +
            "\n" +
            "(function () {\n" +
            "    var _customDaysData = " +
            JSON.stringify(
                extraItems
            ) +
            ";\n" +
            "\n" +
            "    for (" +
            "var _i = 0; " +
            "_i < _customDaysData.length; " +
            "_i++) {\n" +
            "\n" +
            "        daysData[" +
            "daysData.length" +
            "] = " +
            "_customDaysData[_i];\n" +
            "\n" +
            "    }\n" +
            "\n" +
            "})();\n";


        source =
            source.replace(
                daysMarker,
                injection
            );


        // ========================================================
        // 通知
        // ========================================================

        var notifyMarker =
            "// $.msg(title, '', notifyContent)";


        if (
            source.indexOf(
                notifyMarker
            ) === -1
        ) {

            throw new Error(
                "未找到 DaysMatter.js 的通知位置"
            );

        }


        // --------------------------------------------
        // Loon / Quantumult X 通知
        // --------------------------------------------

var notifyCode =
    "if (typeof $notification !== 'undefined' && $notification.post) {\n" +
    "    $notification.post(title, '最近 3 个', notifyContent);\n" +
    "} else if (typeof $notify !== 'undefined') {\n" +
    "    $notify(title, '最近 3 个', notifyContent);\n" +
    "} else {\n" +
    "    $.msg(title, '最近 3 个', notifyContent);\n" +
    "}\n";

            "    $notification.post(" +
            "title, " +
            "'最近 3 个', " +
            "notifyContent" +
            ");\n" +

            "} else if (" +
            "typeof $notify !== "undefined" +
            ") {\n" +

            "    $notify(" +
            "title, " +
            "'最近 3 个', " +
            "notifyContent" +
            ");\n" +

            "} else {\n" +

            "    $.msg(" +
            "title, " +
            "'最近 3 个', " +
            "notifyContent" +
            ");\n" +

            "}\n";


        source =
            source.replace(
                notifyMarker,
                notifyCode +
                notifyMarker
            );


        // ========================================================
        // 执行修改后的原版 DaysMatter.js
        // ========================================================

        eval(source);


    } catch (error) {


        console.log(
            "DaysMatter_Lunar：" +
            (
                error &&
                error.message
                    ? error.message
                    : error
            )
        );


        if (
            typeof $done ===
                "function"
        ) {

            $done();

        }

    }

}


// ============================================================
// 启动
// ============================================================

main();
