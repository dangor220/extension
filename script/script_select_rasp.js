window.onload = function(){
    document.body.style.opacity = 1;
};

$(document).ready(function(){
    let spaceNames = {
        och: [
            {
                id: '1',
                title: 'Гуманитарных наук и языковых коммуникаций',
            },
            {
                id: '2',
                title: 'Инженерных наук',
            },
            {
                id: '3',
                title: 'Математического моделирования и игропрактики',
            },
            {
                id: '4',
                title: 'Медицины и экспериментальной биологии',
            },
            {
                id: '5',
                title: 'Образования и социальных наук',
            },
            {
                id: '6',
                title: 'Права, экономики и управления',
            },
            {
                id: '7',
                title: 'Иностранные студенты',
            }
        ],
        zaoch: [
            {
                id: '1',
                title: 'Гуманитарных наук и языковых коммуникаций',
            },
            {
                id: '2',
                title: 'Инженерных наук',
            },
            {
                id: '3',
                title: 'Математического моделирования и игропрактики',
            },
            {
                id: '4',
                title: 'Медицины и экспериментальной биологии',
            },
            {
                id: '5',
                title: 'Образования и социальных наук',
            },
            {
                id: '6',
                title: 'Права, экономики и управления',
            },
        ]
    }

      let keys = {
        zaoch: '18X_GqdZ7rqLNP9bT66bjxO7ZNnhx0y1l8R32JWQLA8Q',
        och: '1qm5x3pC9G9R-mkUh7xjx2e4p0NenYski8KAzZAv8BxU',
    }
    let key = null
    let days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    let globalData = null

    for (let item of document.querySelectorAll('.select')) {
             item.querySelector('span').addEventListener('click', (e) => {
             for (let sel of document.querySelectorAll('.select div')) {
                 sel.classList.add('hide')
             }

             item.querySelector('div').classList.toggle('hide')

             for (let li of item.querySelectorAll('p')) {

                 li.addEventListener('click', (e) => {
                     item.setAttribute('selected', li.getAttribute('value'))
                     let text = e.target.innerText

                     let maxLTxt = 23
                     if (text.length > maxLTxt) {
                         text = text.substr(0, maxLTxt - 3).trim() + '...'
                     }
                     item.querySelector('span').innerText = text
                     // скрываем выпадающий список
                     item.querySelector('div').classList.add('hide')
                     // убираем класс active со всех элементов вып. списка
                     for (let li1 of item.querySelectorAll('p')) {
                         li1.classList.remove('active')
                     }
                     // добавляем .active активному элементу списка
                     li.classList.add('active')
                     // записываем значение селекта
                     let val = item.getAttribute('selected')

                     if(val.trim() !== '') {

                         if (item.id == 'form_learning') {
                             key = keys[val] //выбраная форма обучения
                             let html = ``
                             for (let item of spaceNames[val]) {
                                 html += `<p value="${item.id}">${item.title}</p>`
                             }

                             document.querySelector('#select_institut div').innerHTML = html
                             document.querySelector('#select_institut').classList.remove('hide')
                         }

                         if (item.id == 'select_institut') {

                             document.querySelector('.loader-1').classList.remove('hide') //загрузка

                             document.querySelector('#select_group').classList.add('hide')
                            document.querySelector('#check_rasp').classList.add('hide')

                             try {
                               $.getJSON(
                                     `https://spreadsheets.google.com/feeds/list/${key}/${val}/public/full?alt=json`,
                                     function (data) {
                                         globalData = data
                                         document.querySelector('.loader-1').classList.add('hide') //Скрываю загрузку

                                         let entry = data.feed.entry
                                         let resultArr = [] //Содержит группы
                                         let html = `` //Содержит сгенерированный список групп
                                         if (entry !== undefined) {
                                             for (el of entry) {
                                                 resultArr.push(el.gsx$group.$t)
                                             }

                                             resultArr = unique(resultArr)

                                             for (let item of resultArr) {
                                                 html += `<p value="${item}">${item}</p>`
                                             }
                                         }

                                         document.querySelector('#select_group div').innerHTML = html
                                         document.querySelector('#select_group').classList.remove('hide')
                                     }
                                 )
                             } catch (err) {
                                console.log(err)
                             }
                         }

                         if (item.id == 'select_group') {
                             document.querySelector('#check_rasp').classList.remove('hide')
                             showRasp(0)
                             document.querySelector('#check_rasp').addEventListener('click', (e) => {
                                 document.querySelector('.selectors').classList.add('hide')
                                 document.querySelector('.rasp-box').classList.remove('hide')
                                 document.querySelector('#rasp_week').addEventListener('click', (e) => {
                                     showRasp(6)
                                 })
                             })
                         }
                     }
                 })
             }
         })
     }

     let d1 = new Date
     document.querySelector('#cal').value = `${String(d1.getFullYear()).padStart(2, '0')}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`

     function showRasp (count) {
         document.querySelector('.table_rasp table tbody').innerHTML = ''

         let d = new Date
         let html = []

         for (let i = 0; i <= count; i++) {
             let arr = document.querySelector('#cal').value.split('-')

             let dy = Number(arr[2])
             let m = Number(arr[1])
             let y = Number(arr[0])
             dy += i

             if (dy > days[m - 1]) {
                 dy = i
                 m += 1
             }
             if (m > 12) {
                 break
             }
             dy = String(dy).padStart(2, '0')
             m = String(m).padStart(2, '0')
             y = String(y).padStart(2, '0')

             let date = `${dy}-${m}-${y}`
             let date2 = `${dy}.${m}.${y}`
             let date3 = `${dy}/${m}/${y}`
             let dateNameDay = `${y},${m},${dy}`
             // console.log(dateNameDay)
             let nameDay = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

             let newData = new Date(dateNameDay)
             let numDay = nameDay[newData.getDay()]
             // console.log(numDay)
             let grp = document.querySelector('#select_group').getAttribute('selected')
             document.querySelector('#chisl_group').innerHTML = grp

             document.querySelector('#cal').addEventListener('change', (e) => {
                 showRasp(0)
             }
            )

             let flag = true
             // Перебор информации google таблицы
             for (let gitem of globalData.feed.entry) {

                 if (
                     gitem.gsx$group.$t == grp &&
                     (
                         gitem.gsx$date.$t == date ||
                         gitem.gsx$date.$t == date2 ||
                         gitem.gsx$date.$t == date3
                     )
                 ) {
                     // №
                     let les = gitem.gsx$les.$t
                     // предмет
                     let subject = gitem.gsx$subject.$t
                     // ФИО преподавателя
                     let name = gitem.gsx$name.$t
                     // лекция/практика
                     let subjtype = gitem.gsx$subjtype.$t

                     if (flag) {
                         html.push(`
                         <tr class="tableStyle">
                            <td class="date_">${numDay} ${dy}.${m}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                         </tr>
                         `)
                         flag = false
                     }
                     let timeLes;
                     switch (les) {
                       case '1':
                        timeLes = '8:30-10:00'
                        break;
                       case '2':
                        timeLes = '10:15-11:45'
                         break;
                       case '3':
                        timeLes = '12:30-14:00'
                         break;
                       case '4':
                        timeLes = '14:15-15:45'
                         break;
                       case '5':
                        timeLes = '16:00-17:30'
                        break;
                       case '6':
                        timeLes = '17:45-19:15'
                        break;
                       case '7':
                        timeLes = '19:30-21:00'
                        break;
                      default:
                        timeLes = ''
                        break;
                     }


                     html.push(`
                        <tr class="uid-les-${dy}-${m}">
                            <td class="lesson">${les}</br>${timeLes}</td>
                            <td>${subject}</td>
                            <td>${subjtype}</td>
                            <td>${name}</td>
                        </tr>
                     `)
                 }
             }
         }
         // Удаляем повторяющиеся эл-ы
         html = unique(html)
         // Перебор всех строки таблицы
         for (let arrEl of html) {
             // если строка не пустая
             if (arrEl !== '') {
                 // добавляем её
                 document.querySelector('.table_rasp table tbody').innerHTML += arrEl
             }
         }
     }
     //Нажатие по документу
     document.addEventListener('mouseup', (e) => {
         for (let item of document.querySelectorAll('.select div')) {
             item.classList.add('hide')
         }
     })

    function unique(arr) {
        let result = []
        for (let str of arr) {
            if (!result.includes(str)) {
                result.push(str)
            }
        }
        return result
    }
})
