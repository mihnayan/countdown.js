/**
 * Скрипт обработки ряда указанных событий, возникающих при наступлении определенной даты
 * и запускающий действия, описанные в этих событиях.
 * @autor Mikhail Mangushev
 * @version 0.1
 */

var events = [
    {
        timeout: 1396528168000,
        actions: {
            hide: ["block-1", "block-2"],
            show: ["block-3", "block-4", "block-5"],
        },
    },
    {
        timeout: 1396528198000,
        actions: {
            hide: ["block-3", "block-4", "block-5"],
            show: ["block-1", "block-2"],
        },
    },
    {
        timeout: 1396528228000,
        actions: {
            hide: ["block-1", "block-2"],
            show: ["block-3", "block-4", "block-5"],
            alert: "Все события завершены!"
        },
    },
 ];

 // -------------- действия, доступные для выполнения в событиях
 // ------------------------------------------------------------

var actions = {
    /**
    * Скрывает элементы, идентификаторы которых переданы в массиве elements
    */
    hide: function (elements) {
        for (var i = 0; i < elements.length; i++) {
            var e = document.getElementById(elements[i]);
            if (e != null) e.style.display = 'none';
        }
    },

    /**
    * Делает видимыми элементы, идентификаторы которых переданы в массиве elements
    */
    show: function (elements) {
        for (var i = 0; i < elements.length; i++) {
            var e = document.getElementById(elements[i]);
            if (e != null) e.style.display = 'block';
        }
    },

    /**
    * Выводит сообщение str
    */
    alert: function (str) {
        alert(str);
    },
};

// ----------------- код, подключаемый к событиям таймера
// ------------------------------------------------------

var ontick_plugin = function () {
    var viewBlock = document.getElementById('timerbox'); 
    if (viewBlock == null) return function () {};

    var css = "#timerbox{padding: 0;margin:0 auto;line-height: 1.2;color: #2f2f2f;font-family: Helvetica,sans-serif;font-size: 115px;width: 726px;height: 170px;}"
        + "#timerbox .timerbox-number{float: left; width: 174px; height: 170px; }"
        + "#timerbox .timerbox-space{float: left; width: 10px; height: 170px; }"
        + "#timerbox-d1,#timerbox-h1,#timerbox-m1,#timerbox-s1{float: left;text-align: center;background-image:url('http://timegenerator.ru/c/2/flip.png');background-repeat:no-repeat;margin: 0 -3px 0 0;height: 145px;width: 90px;z-index:1;}"
        + "#timerbox-d2,#timerbox-h2,#timerbox-m2,#timerbox-s2{float: left;text-align: center;background-image:url('http://timegenerator.ru/c/2/flip.png');background-repeat:no-repeat;margin: 0 0 0 -3px;height: 145px;width: 90px;z-index:1;}"
        + "#timerbox-text{position: absolute;margin-top: 150px;height: 14px;width: 174px; font-size:14px; text-align:center; font-weight:bold;}";

    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    var secsInDay = 24 * 60 * 60, secsInHour = 60 * 60, secsInMin = 60;

    var leadingZero = function (num) { return (num >=10) ? num : "0" + num; };

    return function (timeout) {
        var secs = timeout / 1000;
        timeout = secs % secsInDay;
        var days = leadingZero((secs - timeout) / secsInDay).toString();

        secs = timeout;
        timeout = secs % secsInHour;
        var hours = leadingZero((secs - timeout) / secsInHour).toString();

        secs = timeout;
        timeout = secs % secsInMin;
        var mins = leadingZero((secs - timeout) / secsInMin).toString(); 

        secs = leadingZero(timeout).toString();

        viewBlock.innerHTML = "<div class='timerbox-number'><div id='timerbox-d1'><span></span>" + days[0]
            + "</div><div id='timerbox-d2'><span></span>" + days[1]
            + "</div><div id='timerbox-text'>ДНЕЙ</div></div>" 
            + "<div class='timerbox-space'></div>" 
            + "<div class='timerbox-number'><div id='timerbox-h1'><span></span>" + hours[0]
            + "</div><div id='timerbox-h2'><span></span>" + hours[1]
            + "</div><div id='timerbox-text'>ЧАСОВ</div></div>" 
            + "<div class='timerbox-space'></div>" 
            + "<div class='timerbox-number'><div id='timerbox-m1'><span></span>" + mins[0]
            + "</div><div id='timerbox-m2'><span></span>" + mins[1]
            + "</div><div id='timerbox-text'>МИНУТ</div></div>" 
            + "<div class='timerbox-space'></div>" 
            + "<div class='timerbox-number'><div id='timerbox-s1'><span></span>" + secs[0]
            + "</div><div id='timerbox-s2'><span></span>" + secs[1]
            + "</div><div id='timerbox-text'>СЕКУНД</div></div>";
    }
};

 /**
 * Создает новый таймер с временем отсчета до даты date 
 * и стартом executor по окончанию отсчета
 */
var Timer = function (events, actions) {

    var self = this;
    var currentEvent = 0;
    
    var count = function(timeout) {
        if (timeout > Date.parse(new Date())) {
            if (typeof self.ontick == 'function') self.ontick(timeout - Date.parse(new Date()));
            setTimeout(function() { count(timeout); }, 1000);
        } else {
            if (typeof self.onstartevent == 'function') self.onstartevent(currentEvent);
            setTimeout(execute(events[currentEvent].actions), 10);
            if (currentEvent < (events.length - 1)) {
                currentEvent++;
                if (typeof self.onchangeevent == 'function') self.onchangeevent(currentEvent);
                setTimeout(function() { count(events[currentEvent].timeout)}, 10);
            }
        }
    };

    var execute = function(acts) {
        for (act in acts) {
            if (typeof actions[act] == 'function')
                actions[act](acts[act]);
        }
    };

    /**
     * Событие, возникающее при запуске таймера
     */
    this.onstart = function () {};

    /**
     * Событие, возникающее при каждом отсчете времени (раз в секунду)
     * @param timeout время, оставшееся до начала текущего события
     */
    this.ontick = function (timeout) {};

    /**
     * Событие, возникающее при начале мероприятия (в данном случае заменено слово "событие"
     * для устранения тавтологии).
     * @param eventId идентификатор события (мероприятия), начало которого произошло
     */
    this.onstartevent = function (eventId) {};

    /**
     * Событие, возникающее при смене текущего мероприятия после того, как наступило предыдущее.
     * @param eventId идентификатор текущего мероприятия
     */
    this.onchangeevent = function (eventId) {};

    this.start = function () {
        if (typeof self.onstart == 'function') self.onstart();
        count(events[currentEvent].timeout);
    };
};

(function timerDispatcher() {
    generateEvents();
    var timer = new Timer(events, actions);

    timer.ontick = ontick_plugin();
    timer.start();
})();