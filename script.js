// Для MVVM, реактивности и анимаций я использовал Vue - https://vuejs.org/
// Инструкции на https://introjs.com
// Вёрстка на UIKit https://getuikit.com
// И, для вспомогательных функций, Lodash https://lodash.com/ 

const app = new Vue({
    el: '#app',
    data: {
        numbers: [],
        countOfNumbersTextBox: 100,
        sortingSpeed: 500,
        isSortingInProgress: false
    },
    mounted: function () {
        // создаём изначальный список чисел для сортировки
        this.createNumbers();
    },
    methods: {
        runIntro: function (){
            // подключаем библиотеку Intro.js. Запуск по кнопке инструкции 
            introJs().start();
        },
        createNumbers: function () {
            // функция для заполнения массива чисел
            this.numbers = [];
            for (let i = 0; i < this.countOfNumbersTextBox; i++) {
                this.numbers.push(i)
            }
        },
        shuffleNumbers: function () {
            // функция для перемешивания чисел на Lodash, чтобы их потом сортировать
            this.numbers = _.shuffle(this.numbers)
        },
        startSort: function () {
            // блокируем интерфейс запуску сортировки
            this.isSortingInProgress = true;

            // создаём ES6 генератор. Он даёт удобный контроль над выполнением цикла
            let compareTwo = bubbleSortGenerator(this.numbers);

            // рекурсивный запуск с помощью setTimeout, вместо setInterval, чтобы можно было на лету изменять sortingSpeed
            let timerID = setTimeout(function recursiveCompare() {
                // генератор проверяет следующую пару чисел и возвращает статус
                let status = compareTwo.next()
                if (status.done || app.isSortingInProgress == false) {
                    // останавливаем процесс, если итераций больше не осталось, и оставляем возможность прервать процесс кнопкой Стоп
                    clearInterval(timerID)
                    console.log('Сортировка закончена')
                    // разблокируем интерфейс
                    app.isSortingInProgress = false;
                } else {
                    timerID = setTimeout(recursiveCompare, app.sortingSpeed)
                }
            }, app.sortingSpeed)

        },
        stopSort: function () {
            this.isSortingInProgress = false;
        }
    }
})

function* bubbleSortGenerator(array) {
    // цикл проходов, количество проходов уменьшается с каждой итерацией
    for (let numOfIterations = array.length; numOfIterations > 0; numOfIterations--) {

        for (let i = 0; i < numOfIterations - 1; i++) {

            let first = array[i];
            let second = array[i + 1];

            // если первое число больше второго, меняем их местами
            if (first > second) {
                // используем Vue.set, иначе замена не реактивная
                Vue.set(array, i, second);
                Vue.set(array, i + 1, first);
            }
            yield first + " " + second;
        }
    }
}
