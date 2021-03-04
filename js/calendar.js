var Calendar = function() {
  var _this = this
  var subTime
  var dayType = {
    none: "",
    today: "today",
    disable: "disable-back-color",
    warn: "warn-back-color"
  }
  var currenMonthDate
  var dayMap = ["日", "一", "二", "三", "四", "五", "六"]
  var timeObj = {
    year: "--", //1945
    month: "--", //12
    date: "--", //31
    day: "--", //一
    thisLimit: "31",
    lastLimit: "30"
  }
  var event = {
    clickDate: function(date) {}
  }
  var set = {
    startWith: 0,
    contentId: "calendar_date"
  }

  var initEvent = function() {
    console.log("initEvent")

    document.querySelector(".left-btn.week-btn").addEventListener("click", function() {
      console.log("left")
      set.startWith--
      set.startWith = set.startWith < 0 ? set.startWith + 7 : set.startWith
      setContent(currenMonthDate.getTime())
    })
    document.querySelector(".right-btn.week-btn").addEventListener("click", function() {
      console.log("right")
      set.startWith++
      set.startWith = set.startWith > 6 ? set.startWith - 7 : set.startWith
      setContent(currenMonthDate.getTime())
    })
    document.querySelector(".left-btn.month-btn").addEventListener("click", function() {
      updateCurrenMonthDate(-1)
      console.log("right")
      setContent(currenMonthDate.getTime())
    })
    document.querySelector(".right-btn.month-btn").addEventListener("click", function() {
      updateCurrenMonthDate(1)

      setContent(currenMonthDate.getTime())
    })
  }

  var updateCurrenMonthDate = function(num) {
    // console.warn("currenMonthDate", currenMonthDate);
    currenMonthDate.setMonth(currenMonthDate.getMonth() + num)
  }
  var setContent = function(time) {
    var container = document.getElementById(set.contentId)
    container.innerHTML = ""
    var weekList = generateMonth(time)
    console.log("weekList", weekList)
    weekList.forEach(function(week) {
      container.appendChild(week)
    })
  }
  var nowTime = function() {
    return new Date().getTime() - subTime
  }
  var getDays = function(timeSpan) {
    var date = new Date(timeSpan)
    date.setMonth(date.getMonth() + 1)
    date.setDate(0)
    return date.getDate()
  }
  var getDaysOfMonth = function(year, month) {
    var date = new Date(year, month, 0)
    var days = date.getDate()
    return days
  }
  var generateTimeObj = function(timeSpan) {
    var obj = {}
    var date = new Date(timeSpan)
    obj.year = date.getFullYear()
    obj.month = date.getMonth() + 1
    obj.date = date.getDate()
    obj.day = dayMap[date.getDay()]
    obj.thisLimit = getDays(timeSpan)
    obj.lastLimit = getDaysOfMonth(obj.year, obj.month - 1)
    return obj
  }
  var generateMonth = function(time) {
    var cur = 1,
      curDate,
      tmpTimeObj
    if (time) {
      curDate = new Date(time)
    } else {
      curDate = new Date(nowTime())
    }
    console.log("curDate", curDate)
    tmpTimeObj = generateTimeObj(curDate)
    console.log("tmpTimeObj", tmpTimeObj)
    setMonthTitle(tmpTimeObj)
    setDayWord()
    curDate.setDate(1)
    // 禮拜幾
    var firstDay = curDate.getDay()
    var firstDayIndex = set.startWith > firstDay ? firstDay - set.startWith + 7 : firstDay - set.startWith
    var lastMonth = tmpTimeObj.lastLimit - firstDayIndex + 1
    var nextMonth = 1
    var weekList = []
    while (tmpTimeObj.thisLimit >= cur) {
      var weekDiv = document.createElement("div")
      weekDiv.setAttribute("class", "week")
      for (var i = 0; i < 7; i++) {
        var tmpDay
        if (lastMonth > tmpTimeObj.lastLimit) {
          if (cur > tmpTimeObj.thisLimit) {
            tmpDay = getDateDiv(dayType.disable, nextMonth)
            nextMonth++
          } else {
            if (isToday(tmpTimeObj.year, tmpTimeObj.month, cur)) {
              tmpDay = getDateDiv(dayType.today, cur)
            } else {
              tmpDay = getDateDiv(dayType.none, cur)
            }
            cur++
          }
        } else {
          tmpDay = getDateDiv(dayType.disable, lastMonth)
          lastMonth++
        }
        weekDiv.appendChild(tmpDay)
      }
      weekList.push(weekDiv)
    }

    return weekList
  }
  var setDayWord = function() {
    var list = document.getElementsByClassName("header-word")

    for (var i = 0; i < list.length; i++) {
      var index = set.startWith + i > 6 ? set.startWith + i - 7 : set.startWith + i
      list[i].textContent = dayMap[index]
    }
  }
  var setMonthTitle = function(timeObj) {
    document.getElementsByClassName("tmp-month").item(0).textContent = timeObj.year + "年" + timeObj.month + "月"
  }
  var getDateDiv = function(className, dateNum) {
    var dayDiv = document.createElement("div")
    var daySpan = document.createElement("span")
    daySpan.textContent = dateNum
    dayDiv.setAttribute("class", "day " + className)
    dayDiv.appendChild(daySpan)
    dayDiv.addEventListener("click", function() {
      // alert(dateNum)
      document.getElementsByClassName("input-area").item(0).value = getFormatDateString(dateNum, "-")
    })
    return dayDiv
  }
  var isToday = function(year, mon, day) {
    var date = new Date(nowTime())

    if (date.getFullYear() == year && date.getMonth() + 1 == mon && date.getDate() == day) return true

    return false
  }
  var getFormatDateString = function(dayNum, sign) {
    var timeObj = generateTimeObj(currenMonthDate.getTime())
    // console.warn("getFormatDateString",timeObj )

    return timeObj.year + sign + addZero(timeObj.month, 2) + sign + addZero(dayNum, 2)
  }

  var addZero = function(number, count) {
    var l = (number + "").length
    if (count > l) {
      for (var i = 0; i < count - l; i++) number = "0" + number
    }
    return number
  }
  var userInterface = {
    init: function(timeSpan) {
      // timeSpan = new Date().getTime() - subTime
      subTime = new Date().getTime() - timeSpan
      timeObj = generateTimeObj(timeSpan)
      return userInterface
    },
    build: function(id) {
      currenMonthDate = new Date(nowTime())
      setContent()
      initEvent()
    },
    event: function(name, eve) {
      event[name] = eve
      return userInterface
    },
    set: function(name, val) {
      set[name] = val
      return userInterface
    }
  }
  return userInterface
}
var calendar = Calendar()
calendar
  .init(new Date().getTime())
  .set("startWith", 0)
  .build()
