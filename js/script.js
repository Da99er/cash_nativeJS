function myMoneyDataCreater(storageKey) {
    var moneyKey = storageKey;
    var data = JSON.parse(localStorage.getItem(moneyKey)) || {};

    var _arrHistory = [];

    function getItemFromObj(obj, path) {
        var key = path.shift();
        if (key) {
            if (!obj[key]) {
                obj[key] = {
                    _moneyHistory: [],
                };
                //console.log(typeof data['_length']);
                obj['_length'] ? obj['_length'] += 1 : obj['_length'] = 1;
            }
            var money = arguments[2] || false;
            if (money) {
                console.log("####", money);
                addMoneyInArr(obj[key]['_moneyHistory'], money);
                _arrHistory.push(reduceArrayMoney(obj[key]['_moneyHistory']));
            }
            return getItemFromObj(obj[key], path, money);
        } else {
            //console.log(data);
            return obj;
        }
    }

    function addMoneyInArr(arr, moneyArr) {
        var isHave = arr.some((el) => {
            if (moneyArr[0] === el[0]) {
                el[1] += moneyArr[1];
                return true;
            }
        });
        !isHave ? arr.push(moneyArr) : 1;
    }

    function drawMoneyOnList(el) {
        //_arrHistory.shift();

        function draw(e) {
            cashForEl = _arrHistory.pop();
            if (cashForEl) {
                e.getElementsByTagName('i')[0].innerHTML = cashForEl;
                draw(e.parentNode.parentNode);
            } else {
                return true;
            }

        }
        draw(el);
    }


    this.save = function() {
        var newData = JSON.stringify(data);
        data = JSON.parse(newData);


        //console.log("-->", data);
        pieRender(data);
        localStorage.setItem(moneyKey, newData);
    }

    this.get = function(arrPath) {
        //console.log("===>", data, "arrPath-->", arrPath);
        if (!arrPath) {
            return data;
        }
        arrPath = arrPath.split("___");
        arrPath.shift();
        var innerObj = getItemFromObj(data, arrPath);
        this.save();
        return innerObj;
    }
    this.push = function(li, money) {
        console.log("===>", li);
        if (!li && !money) {
            return data;
        }
        var arrPath = li.getElementsByTagName('ul')[0].getAttribute('name').split("___");
        arrPath.shift();
        var innerObj = getItemFromObj(data, arrPath, money);
        this.save();
        drawMoneyOnList(li);
        _arrHistory = [];
        return innerObj;
    }
}

function reduceArrayMoney(arr) {
    var res = 0;
    arr.map((e) => {
        res += e[1];
    });
    //console.log("res", res);
    return res;
}

function renderDataToHTML(ul) {
    if (ul) {
        function draw(obj, ulElem) {
            for (var i in obj) {
                if (~i.indexOf("_")) {
                    continue;
                }
                //console.log(i, obj[i], obj._length);
                var val = i.split('~').join(' ');
                var subList = addLi(val, ulElem);
                draw(obj[i], subList);
            }
        }
        draw(moneyData.get(), ul);
    }
}

/*
    localStorage.setItem('car', JSON.stringify(car)); //сериализовали объект в строку и записали его в хранилище.
    console.log( JSON.parse(localStorage.getItem('car')).name ); //распарсили строку обратно в объект
    localStorage.removeItem('car'); //удалили значение 'car' из хранилища 
    localStorage.clear(); //полностью очистили хранилище
*/

function addSum(e) {
    var time = appTime.value;
    var counter = e.getElementsByTagName('i')[0];
    var sum = parseInt(e.getElementsByTagName('input')[0].value);
    console.log("e", e);
    moneyData.push(e, [time, sum]);
}


function addLi(value, ul) {
    var li = document.createElement('li');
    var subName = ul.getAttribute("name") ? ul.getAttribute("name") : ul.id;
    var keyName = value.match(/\w+/g).join("~");
    if (document.getElementsByName(`${subName}___${keyName}`).length > 0) {
        alert('duplicate');
        return false;
    }
    var countMoney = reduceArrayMoney(moneyData.get(`${subName}___${keyName}`)['_moneyHistory']);

    liHTML = `${value} <i>${countMoney}</i>`;
    liHTML += `<input type="number" value="0" />`;
    liHTML += `<button onclick="addSum(this.parentNode)">add sum</button>`;
    liHTML += `<input type="text" />`;
    liHTML += `<button onclick="addcat(this.parentNode)">add new subcat</button>`;
    li.innerHTML = liHTML;
    var subList = document.createElement('ul');
    subList.setAttribute('name', `${subName}___${keyName}`);
    li.appendChild(subList);
    ul.appendChild(li);
    return subList;
}

function addcat(e) {
    if (!e) {
        basecat.value.length ? addLi(basecat.value, list) : alert('type something in input');
    } else if (e && e.nodeName === 'LI') {
        if (!e.getElementsByTagName('input')[1].value.length) {
            alert('type sub category');
        } else {
            addLi(e.getElementsByTagName('input')[1].value, e.getElementsByTagName('ul')[0]);
        }
    }
}

/*
https://github.com/chemerisuk/better-dateinput-polyfill
bower install better-dateinput-polyfill

    <script src="bower_components/better-dom/dist/better-dom.js"></script>
    <script src="bower_components/better-i18n-plugin/dist/better-i18n-plugin.js"></script>
    <script src="bower_components/better-time-element/dist/better-time-element.js"></script>
    <script src="bower_components/better-emmet-plugin/dist/better-emmet-plugin.js"></script>
    <script src="build/better-dateinput-polyfill.js"></script>
*/
