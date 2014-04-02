/**
 * Скрипт обработки ряда указанных событий, возникающих при наступлении определенной даты
 * и запускающий действия, описанные в этих событиях.
 * @autor Mikhail Mangushev
 * @version 0.1
 */

 /* TODO:
1. Сделать работоспособные действия
2. Необходимо реализовать события таймера так, чтобы они корректно отрабатывлись, если на события
   подписываются из разных мест.
*/

 var events = [
    {
        timeout: 1396468371000,
        actions: {
            hide: ["block-1", "block-2"],
            show: ["block-3", "block-4", "block-5"],
        },
    },
    {
        timeout: 1396468401000,
        actions: {
            hide: ["block-3", "block-4", "block-5"],
            show: ["block-1", "block-2"],
        },
    },
    {
        timeout: 1396468431000,
        actions: {
            hide: ["block-1", "block-2"],
            show: ["block-3", "block-4", "block-5"],
        },
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
            if (typeof self.onstartevent == 'function') self.onstartevent(currentEvent);
            setTimeout(execute(events[currentEvent].actions), 10);
            if (currentEvent < (events.length - 1)) {
                currentEvent++;
                if (typeof self.onchangeevent == 'function') self.onchangeevent(currentEvent);
                setTimeout(function() { count(events[currentEvent].timeout)}, 10);
            }
        }
        console.log(timeout - Date.parse(new Date()));
    }

    var execute = function(acts) {
        for (act in acts) {
            actions[act](acts[act]);
        }
    };

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
        count(events[currentEvent].timeout);
    };
};

// -------------- действия, доступные для выполнения в событиях
var actions = {
    /**
    * Скрывает элементы, идентификаторы которых переданы в массиве elements
    */
    hide: function (elements) {
        console.log("hide ations started");
        for (var i = 0; i < elements.length; i++) {
            var e = document.getElementById(elements[i]);
            if (e != null) e.style.display = 'none';
        }
    },

    /**
    * Делает видимыми элементы, идентификаторы которых переданы в массиве show_array
    */
    show: function(elements) {
        console.log("show action started");
        for (var i = 0; i < elements.length; i++) {
            var e = document.getElementById(elements[i]);
            if (e != null) e.style.display = 'block';
        }
    },
};