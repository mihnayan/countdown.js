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

 var settings = {
    "timer_block_id" : "mmv-timer-view",
 };

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
    var viewBlock = document.getElementById(settings.timer_block_id); 
    if (viewBlock == null) return function () {};

    var secsInDay = 24 * 60 * 60;
    var secsInHour = 60 * 60;
    var secsInMin = 60;

    var leadingZero = function (num) {
            return (num >=10) ? num : "0" + num;
    };

    var showTimeout = function (days, hours, mins, secs) {
        viewBlock.innerHTML = "дней: " + days + " " + hours + ":" + mins + ":" + secs;
    }

    return function (timeout) {
        var secs = timeout / 1000;
        timeout = secs % secsInDay;
        var days = leadingZero((secs - timeout) / secsInDay);

        secs = timeout;
        timeout = secs % secsInHour;
        var hours = leadingZero((secs - timeout) / secsInHour);

        secs = timeout;
        timeout = secs % secsInMin;
        var mins = leadingZero((secs - timeout) / secsInMin); 

        secs = leadingZero(timeout);

        showTimeout(days, hours, mins, secs);
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
    console.log("dispatcher is worked");
    generateEvents();
    var timer = new Timer(events, actions);

    timer.ontick = ontick_plugin();
    // timer.onstart = plugins["onstart"];
    timer.start();
})();