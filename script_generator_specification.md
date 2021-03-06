# Спецификация по генерации скрипта #



## Структура скрипта ##

Скрипт состоит из двух частей кода:

1. **Генерируемые данные.** - исходные данные для работы скрипта, которые генерируется динамически, в зависимости от выбранных пользователем параметров.
2. **Постоянный код** - часть кода, которая отвечает за обработку данных и вывод результата обработки.
3. **Подключаемый код** - код, который может включатся в скрипт (сниппеты) в зависимости от соответствующего выбора пользователя. Например, это может быть код для вывода на экран в том или ином виде результатов обработки данных.

### Генерируемые данные ###

Генерируемые данные представляют собой массив JSON-объектов, описывающих события и действия, наступаемые при этих событиях

JSON-объект состоит из следующих полей:

 * `timeout` - дата, при наступлении которой происходит запуск действий. Параметр должен быть числом, обозначающим количество миллисекунд, прошедших с 01 января 1970 года по UTC: [http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.1](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.1) 
 * вложенный JSON-объкт `actions`, содержащий идентификаторы действий, запускаемые при наступлении событий. Этот объект содержит массивы идентификаторов элементов, к которым применяются указанные действия. Идентификатор действия должен соответствовать имени функции реализованной далее в коде.

Пример данных:

	var events = [
    	{
    	    timeout: 1395210721000,
    	    actions: {
				hide: [1, 2],
    	    	show: [3, 4, 5],
			}
    	},
    	{
    	    timeout: 1395296700000,
    	    actions: {
				hide: [3, 4, 5],
    	    	show: [1,2],
			},
    	},
    	{
    	    timeout: 1395296820000,
    	    actions: {
				hide: [1, 2],
    	    	show: [3, 4, 5],
			},
    	},
 	];

При генерации массива событий необходимо соблюдать следующее условие: элементы массива должны быть упорядочены по полю `timeout` объекта-события от меньшего к большему.

### Постоянный код ###

Постоянный код представляет собой конструктор объекта `timer`, который отвечает за последовательную **синхронную** обработку каждого из объектов массива `events`: посекундный отсчет времени до наступления времени `timeout` и запуск действий, описанных в объекте `actions`.

Запуск работы объекта `timer` производится вызовом метода `start()`.

Во время работы объекта `timer` доступны события, которые могут использоваться внешними объектами, но предназначенные в основном для плагинов, описанных в *подключаемом коде*:

* `onstart()` - событие, возникающее при запуске таймера
* `ontick(timeout)` - событие, возникающее при каждом отсчете времени (раз в секунду), где `timeout` - время, оставшееся до начала текущего события;
* `onstartevent(eventId)` - событие, возникающее при начале мероприятия (в данном случае заменено слово "событие" для устранения тавтологии). Здесь `eventId` - идентификатор события (мероприятия), начало которого произошло. Идентификатором события (мероприятия) является индекс объекта в массиве `events`.
* `onchangeevent(eventId)` - событие, возникающее при смене текущего мероприятия после того, как наступило предыдущее, где `eventId` - идентификатор текущего мероприятия.


## Особенности подключения скрипта ##

Для корректной отработки события `window.onload` скрипт должен быть подключен после всех других скриптов, запускающихся по этому же событию. В случае возникновения конфликта с событиями `window.onload` других скриптов, клиент сам должен разрешить этот конфликт.

## Список дел и возможные проблемы ##

1. Не решен вопрос с учетом временн*о*й зоны клиента.
2. Реализовать трех-циферное отображение дней.