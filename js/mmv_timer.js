/**
 * Скрипт обработки ряда указанных событий, возникающих при наступлении определенной даты
 * и запускающий действия, описанные в этих событиях.
 * @autor Mikhail Mangushev
 * @version 0.1
 */

 var events = [
    {
        timeout: 1395576741000,
        hide: [1, 2],
        show: [3, 4, 5],
    },
    {
        timeout: 1395296700000,
        hide: [3, 4, 5],
        show: [1,2],
    },
    {
        timeout: 1395296820000,
        hide: [1, 2],
        show: [3, 4, 5],
    },
 ];

 /**
 * Создает новый таймер с временем отсчета до даты date 
 * и стартом executor по окончанию отсчета
 */
var timer = function (events, actions) {

    var self = this;
    var currentEvent = 0;
    
    var count = function(timeout) {
        if (timeout > Date.parse(new Date())) {
            if (typeof self.ontick == 'function') self.ontick(timeout - Date.parse(new Date()));
            setTimeout(function() { count(timeout); }, 1000);
        } else {
            if (typeof self.onstartevent == 'function') self.onstartevent(events[currentEvent]);
            if (currentEvent < events.length) {
                currentEvent++;
                if (typeof self.onchangeevent == 'function') self.onchangeevent(currentEvent);
                // setTimeout(function() { count(events[])}, 10);
            }
        }
        console.log(timeout - Date.parse(new Date()));
    }

    /* 
     * Событие, возникающее при каждом отсчете времени (раз в секунду)
     * @param timeout время, оставшееся до начала текущего события
     */
    this.ontick = function (timeout) {};

    /*
     * Событие, возникающее при начале мероприятия (в данном случае заменено слово "событие"
     * для устранения тавтологии).
     * @param event событие (мероприятие), начало которого произошло
     */
    this.onstartevent = function (event) {};

    /*
     * Событие, возникающее при смене текущего мероприятия после того, как наступило предыдущее.
     * @param eventId идентификатор текущего мероприятия
     */
    this.onchangeevent = function (eventId) {};

    this.start = function () {
        count(events[currentEvent].timeout);
    };
};

var executor = function() {
    
};

// -------------- действия, доступные для выполнения в событиях

/**
 * Скрывает элементы, идентификаторы которых переданы в массиве elements
 */
var hide_action = function(elements) {
    for (var i = 0; i < elements.length; i++) {
        var e = document.getElementById(elements[i]);
        if (e != null) e.style.display = 'none';
    }
};

/**
 * Делает видимыми элементы, идентификаторы которых переданы в массиве show_array
 */
var show_action = function(elements) {
    for (var i = 0; i < elements.length; i++) {
        var e = document.getElementById(elements[i]);
        if (e != null) e.style.display = 'block';
    }
};