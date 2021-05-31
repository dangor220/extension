window.onload = function() {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
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

                     item.querySelector('div').classList.add('hide')

                     for (let li1 of item.querySelectorAll('p')) {
                         li1.classList.remove('active')
                     }
                         li.classList.add('active')

                     let val = item.getAttribute('selected')
                     if(val.trim() !== '') {
                         if (item.id == 'teacher') {
                             document.querySelector('#check_rasp').classList.remove('hide')
                             showRasp(0)
                             document.querySelector('#check_rasp').addEventListener('click', (e) => {
                                 document.querySelector('.selectors').classList.add('hide')
                                 document.querySelector('.rasp-box').classList.remove('hide')
                                 document.querySelector('#chisl_group').innerHTML = val
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


         let html= []

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
             let name = document.querySelector('#teacher').getAttribute('selected')

             document.querySelector('#cal').addEventListener('change', (e) => {
                 showRasp(0)
             })
             let flag = true
             for (let item of globalData) {
                 let entry = item.feed.entry
                 if (entry !== undefined) {
                     for (let el of entry) {
                         if (
                             el.gsx$name.$t == name &&
                             (
                                 el.gsx$date.$t == date ||
                                 el.gsx$date.$t == date2 ||
                                 el.gsx$date.$t == date3
                             )
                         ) {
                             let les = el.gsx$les.$t
                             if (flag) {
                                 html.push(`
                                      <tr class="tableStyle">
                                          <td class="date_">${numDay} ${dy}.${m}</td>
                                          <td></td>
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
                             <tr class="uid-${dy}-${m}">
                                <td class="lesson">${les}</br>${timeLes}</td>
                                <td>${el.gsx$subject.$t}</td>
                                <td>${el.gsx$subjtype.$t}</td>
                                <td>${el.gsx$aud.$t}</td>
                                <td>${el.gsx$group.$t}</td>
                             </tr>
                             `)
                         }
                     }
                 }
             }

         }

         html = unique(html)
         for (let arrEl of html) {
             if (arrEl !== '') {
                 document.querySelector('.table_rasp table tbody').innerHTML += arrEl
             }
         }
     }

     let countLists1 = 7
     let countLists2 = 6
     let globalData = []


         try {
         for (let i = 1; i <= countLists1; i++) {
             $.getJSON(
                 `https://spreadsheets.google.com/feeds/list/1qm5x3pC9G9R-mkUh7xjx2e4p0NenYski8KAzZAv8BxU/${i}/public/full?alt=json`,
                 function (data) {
                     console.log(`Очная - Лист ${i} - загружен`)
                     globalData.push(data)
                     if (globalData.length === countLists1 + countLists2) {
                         start()
                     }
                 }
             )
         }
         for (let i = 1; i <= countLists2; i++) {
             $.getJSON(
                 `https://spreadsheets.google.com/feeds/list/18X_GqdZ7rqLNP9bT66bjxO7ZNnhx0y1l8R32JWQLA8Q/${i}/public/full?alt=json`,
                 function (data) {
                     console.log(`Заочная - Лист ${i} - загружен`)
                     globalData.push(data)
                    if (globalData.length === countLists1 + countLists2) {
                         start()
                     }
                 }
             )
         }
     } catch (err) {
         console.log(err)
     }


     function start() {
         let tchArr = []

         for (let item of globalData) {
             let entry = item.feed.entry
             if (entry !== undefined) {
                 for (let el of entry) {
                     tchArr.push(el.gsx$name.$t)
                 }
                     tchArr.sort()
             }
         }
         tchArr = unique(tchArr)
         document.querySelector('.loader-1').classList.add('hide')
         document.querySelector('.selectors').classList.remove('hide')
         let html = ``
         for (let item of tchArr) {
             html += `
             <p value="${item}">${item}</p>
             `
         }
         document.querySelector('#teacher div').innerHTML = html
     }

     function unique(arr) {
         let result = []
         for (let str of arr) {
             if (!result.includes(str)) {
                 result.push(str)
             }
         }
         return result
     }

     document.addEventListener('mouseup', (e) => {
         for (let item of document.querySelectorAll('.select div')) {
             item.classList.add('hide')
         }
     })
}
