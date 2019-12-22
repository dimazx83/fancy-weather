window.addEventListener('load', () => {
    let lat;                                                        //  name_days   media 320  let curr  localstor lang
    let lon;
    let cir = '°';
    // let country;
    let un = 'metric';
    let weath; //weather for api background

    const main = document.querySelector('section');
    main.style.width = '1440px';
    main.style.margin = '0 auto';

    const header = document.createElement('header');
    header.style.width = "1440";
    header.style.height = "32px";
    header.style.padding = '30px';
    document.querySelector('section').appendChild(header);

    //nav
    const buttons = [
        btnBack = document.createElement('button'),
        btnTempF = document.createElement('button'),
        btnTempC = document.createElement('button')]
    buttons.forEach(i => {
        i.style.width = "44px";
        i.style.height = "44px";
        i.style.margin = "20px";
        i.style.outline = "none";
        i.style.cursor = "pointer";
        header.appendChild(i);
    });
    btnTempF.style.margin = "0";
    btnTempF.style.borderRight = "1px solid black";
    btnTempC.style.margin = "0";
    let TempAnother;
    if (localStorage.getItem('temp') === null) TempAnother = btnTempF;
    (localStorage.getItem('temp') === btnTempF) ? TempAnother = btnTempC : TempAnother = btnTempF;
    (!localStorage.getItem('temp') === null) ? TempCurr = localStorage.getItem('temp') : TempCurr = btnTempC;
    TempCurr.style.backgroundColor = '#2f2c2c';
    TempCurr.style.color = 'white';
    TempCurr.style.border = '1px solid white';
    TempCurr.setAttribute('disabled', 'true')
    TempCurr.style.cursor = "default";

    const opt = [opten = document.createElement('option'), optru = document.createElement('option'), optbe = document.createElement('option')];
    const btnLang = document.createElement('select');
   
    document.querySelector("header").appendChild(btnLang);
    btnLang.append(opten, optru, optbe);
    btnLang.selectedIndex = 0;
    opten.value='en';
    opten.innerText='en';

    optru.value='ru';
    optru.innerText='ru';

    optbe.value='be';
    optbe.innerText='be';

  
    
    btnBack.addEventListener('click', background);
    [btnTempF, btnTempC].forEach(i => {
        i.addEventListener('click', (e) => {
            if (i.style.backgroundColor = 'rgb(221, 221, 221)') {
                i.style.backgroundColor = '#2f2c2c';
                i.style.color = 'white';
                i.style.border = '1px solid white';
                i.setAttribute('disabled', 'disabled')
                i.style.cursor = "default";
                TempCurr = i;
                localStorage.setItem('temp', TempCurr);
                i === btnTempC ? TempAnother = btnTempF : TempAnother = btnTempC;
                TempAnother.style.backgroundColor = 'rgb(221, 221, 221)';
                TempAnother.style.color = 'black';
                TempAnother.style.margin = "0";
                TempAnother.style.borderWidth = "2px";
                TempAnother.style.borderStyle = "outset";
                TempAnother.style.borderColor = 'buttonface';
                TempAnother.removeAttribute("disabled");
                TempAnother.style.cursor = "pointer";
                TempCurr === btnTempF ? un = 'imperial' : un = 'metric';
                [nextT, nextT2, nextT3].forEach(i => i.innerText = '');
                coorWeather();
            }
        })
    })

    btnTempF.innerText = "F" + cir;
    btnTempC.innerText = "C" + cir;
    btnBack.style.background = 'url(./assets/refresh.svg), url(./assets/refresh2.svg) no-repeat center'
    btnLang.style.background = 'white url(./assets/down.svg) no-repeat right'
    btnLang.style.height='40px';
    //*nav//

    //search
    const searchButt = document.createElement('button');
    searchButt.style.padding = "10px";
    searchButt.style.margin = "20px";
    searchButt.style.marginLeft = "0";
    searchButt.innerText = "SEARCH";
    searchButt.style.border = "none";
    searchButt.style.outline = "none";
    searchButt.style.cursor = "pointer";
    searchButt.style.float = "right";
    header.appendChild(searchButt);

    const search = document.createElement('input');
    search.placeholder = "Search city or ZIP";
    search.setAttribute("type", "text");
    search.style.background = '#141653 url(./assets/voice.svg) no-repeat center right'
    search.style.border = "none"
    search.style.color = "white"
    search.style.padding = "10px";
    search.style.margin = "20px";
    search.style.marginRight = "0";
    search.style.float = "right";
    header.appendChild(search);
    //*search//

    const cont = document.createElement('main');
    cont.style.padding = "60px";
    cont.style.position = "relative"
    document.querySelector('section').appendChild(cont);

    const h1 = document.createElement('h1');
    h1.style.fontSize = "44px";
    h1.style.color = "white";

    async function background(weath) {
        let currentDate2 = new Date();
        let DayTime = currentDate2.getHours() > 6 && currentDate2.getHours() < 18 ? 'day' : 'night';
        let season;
        if (currentDate2.getMonth() >= 10 || currentDate2.getMonth() <= 1) season = 'winter'
        else if (currentDate2.getMonth() >= 2 || currentDate2.getMonth() <= 5) season = 'spring'
        else if (currentDate2.getMonth() >= 6 || currentDate2.getMonth() <= 9) season = 'summer'
        else season = 'autumn';
        let backres = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=bb9e692f7791a6727cafd9f923248e44&tags=${DayTime},${season},${weath.toLowerCase()}&tag_mode=all&format=json&nojsoncallback=1&extras=url_l`) //bb9e692f7791a6727cafd9f923248e44
        localStorage.removeItem('search');
        //${localStorage.getItem("search") || country},
        let pic = await backres.json();
        pic = pic.photos.photo.filter(i => i.width_l >= 1024);
        let num = Math.floor(Math.random() * pic.length);
        // let url = `https://farm${pic[num].farm}.staticflickr.com/${pic[num].server}/${pic[num].id}_${pic[num].secret}.jpg`;
        let url = pic[num].url_l;
        main.style.background = `#3c39e6 url(${url}) no-repeat center`
    }

    async function getWeather(lat1, lon1) {
        let weatres = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat1}&lon=${lon1}&lang=ru&units=${un}&APPID=c12f177389bdc2a38caf0830f44eb263`)
        let weatdata = await weatres.json();
        weath = weatdata.list[0].weather[0].main;
        background(weath);
        coord1.innerText = 'Latitude: ' + lat1.toFixed(2).toString().split('.')[0] + cir + lat1.toFixed(2).toString().split('.')[1] + "'"
        coord2.innerText = 'Longitude: ' + lon1.toFixed(2).toString().split('.')[0] + cir + lon1.toFixed(2).toString().split('.')[1] + "'"
        pTemp.innerText = weatdata.list[0].main.temp.toFixed() + cir;
        pTemp.style.background = 'url(http://openweathermap.org/img/wn/' + weatdata.list[0].weather[0].icon + '@2x.png) no-repeat -20px top'
        feels.innerText = "FEELS LIKE: " + weatdata.list[0].main.feels_like + cir;
        wind.innerText = `WIND: ${weatdata.list[0].wind.speed}${un === 'imperial' ? 'miles/hour' : ' m/s'}`;
        humidity.innerText = "HUMIDITY: " + weatdata.list[0].main.humidity + "%"
        for (let i = 1; i < weatdata.list.length; i++) {
            if (weatdata.list[i].dt_txt.includes('00:00:00')) {
                if (nextT.innerText == "") {
                    nextT.innerText = weatdata.list[i].main.temp.toFixed() + cir;
                    nextT.style.background = 'url(http://openweathermap.org/img/wn/' + weatdata.list[i].weather[0].icon + '@2x.png) no-repeat 50px -30px'
                    continue;
                }
                if (nextT2.innerText == "") {
                    nextT2.innerText = weatdata.list[i].main.temp.toFixed() + cir;
                    nextT2.style.background = 'url(http://openweathermap.org/img/wn/' + weatdata.list[i].weather[0].icon + '@2x.png) no-repeat 50px -30px'
                    continue
                }
                if (nextT3.innerText == "") {
                    nextT3.innerText = weatdata.list[i].main.temp.toFixed() + cir;
                    nextT3.style.background = 'url(http://openweathermap.org/img/wn/' + weatdata.list[i].weather[0].icon + '@2x.png) no-repeat 50px -30px'
                    break;
                }

            }
        }
        average.innerText = 'Average \n temperature: ' + Math.floor((parseInt(nextT.innerText) + parseInt(nextT2.innerText) + parseInt(nextT3.innerText)) / 3) + cir;
    }

    async function coorWeather() {
        let res = await fetch('https://ipinfo.io/json?token=43c5698a1491b1');
        let data = await res.json()
        country = data.country;
        h1.innerText = data.city + ", " + data.country;
        if (coord1.innerText == '' && coord2.innerText == '') {
            lat = Number(data.loc.split(',')[0])
            lon = Number(data.loc.split(',')[1])
            mapboxgl.accessToken = 'pk.eyJ1IjoiZGltYXp4ODMiLCJhIjoiY2szaXgxc2xkMGMzZTNtb2Nrb205c3g1ZSJ9.ZWy5At0umpoZWqV8eRTcMg';
            var map = new mapboxgl.Map({
                container: map2, // container id
                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                center: [lon, lat], // starting position [lng, lat]
                zoom: 8 // starting zoom
            });
        }
        searchButt.addEventListener('click', () => {
            localStorage.setItem("search", search.value)
            document.location.reload(true);
        })
        getWeather(lat, lon);
    }
    coorWeather();

    //дата
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"];
    let pad = n => n < 10 ? '0' + n : n;
    const p = document.createElement('p');
    setInterval(() => {
        let currentDate = new Date();
        let hours = currentDate.getHours();
        p.innerText = daysOfWeek[currentDate.getDay()] + " " + pad(currentDate.getDate()) + " " + monthNames[currentDate.getMonth()] + " " + pad(hours) + ":" + pad(currentDate.getMinutes());
        next.innerText = (daysOfWeek[currentDate.getDay() + 1] != undefined ? daysOfWeek[currentDate.getDay() + 1] : daysOfWeek[0]) + 'day';
        next2.innerText = (daysOfWeek[currentDate.getDay() + 1] != undefined ? daysOfWeek[currentDate.getDay() + 2] : daysOfWeek[1]) + 'day';
        next3.innerText = (daysOfWeek[currentDate.getDay() + 1] != undefined ? daysOfWeek[currentDate.getDay() + 3] : daysOfWeek[2]) + 'day';
    }, 1000)

    p.style.color = "white";
    p.style.marginTop = "10px"
    p.style.fontSize = "24px";
    //*дата//

    //main temp
    const pTemp = document.createElement('p');
    pTemp.style.fontSize = "150px";
    pTemp.style.marginTop = "25px"
    pTemp.style.color = "white";

    const days = document.createElement('div');
    days.style.display = "flex";
    days.style.justifyContent = "flex-start";
    days.style.width = "800px";
    days.style.marginTop = "50px";

    const daysTemp = document.createElement('div');
    daysTemp.style.display = "flex";
    daysTemp.style.justifyContent = "flex-start";
    daysTemp.style.width = "auto";
    daysTemp.style.marginTop = "50px";

    const overcast = document.createElement('div');
    overcast.style.padding = '20px';
    overcast.style.position = 'relative';
    overcast.style.left = '300px';
    overcast.style.bottom = '500px'

    const map2 = document.createElement('div');
    map2.style.border = "1px solid black";
    map2.style.width = "200px";
    map2.style.height = "200px";
    map2.style.position = "absolute";
    map2.style.top = "120px";
    map2.style.right = "50px";


    //feells
    const over = [title = document.createElement('p'), feels = document.createElement('p'), wind = document.createElement('p'), humidity = document.createElement('p')]
    over.forEach(i => {
        i.style.color = "white";
        i.style.fontSize = "22px";
        i.style.marginTop = "10px";
        overcast.appendChild(i);
    })
    title.innerText = "OVERCAST"
    title.style.fontSize = '28px';

    //*FEELS

    //coord
    const coordinates = [coord1 = document.createElement('p'), coord2 = document.createElement('p')]
    coordinates.forEach(i => {
        i.style.position = "absolute";
        i.style.color = "white";
        i.style.fontSize = "18px";
        i.style.right = "50px";
        cont.appendChild(i);
    });

    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(position)
            lat = position.coords.latitude;
            lon = position.coords.longitude
            coord1.innerText = 'Latitude: ' + position.coords.latitude.toFixed(2);
            coord2.innerText = 'Longitude: ' + position.coords.longitude.toFixed(2);
            mapboxgl.accessToken = 'pk.eyJ1IjoiZGltYXp4ODMiLCJhIjoiY2szaXgxc2xkMGMzZTNtb2Nrb205c3g1ZSJ9.ZWy5At0umpoZWqV8eRTcMg';
            var map = new mapboxgl.Map({
                container: map2, // container id
                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                center: [lon, lat], // starting position [lng, lat]
                zoom: 8 // starting zoom
            })
            getWeather(lat, lon);
        },
        () => {
            console.log('Map based on your IP address')
        }
    )

    coord1.style.top = "350px";
    coord2.style.top = "380px";
    //*cord//

    let average = document.createElement('p');
    average.style.color = "white";
    average.style.fontSize = "40px"
    average.style.marginRight = "90px"
    average.style.marginTop = "-100px"

    cont.append(h1, p, pTemp, days, map2, daysTemp, overcast, average);

    //next day
    const day = [next = document.createElement('p'), next2 = document.createElement('p'), next3 = document.createElement('p')];
    day.forEach(i => {
        i.style.color = "white";
        i.style.fontSize = "22px"
        i.style.marginRight = "90px"
        days.appendChild(i);
    })

    //next day temp
    const dayTemp = [nextT = document.createElement('p'), nextT2 = document.createElement('p'), nextT3 = document.createElement('p')];
    dayTemp.forEach(i => {
        i.style.color = "white";
        i.style.fontSize = "80px";
        i.style.width = "210px";
        daysTemp.appendChild(i);
    })


    if (window.matchMedia("(max-width: 320px)").matches) {
        document.querySelectorAll('p').forEach(i => {
            i.style.fontSize = "18px";
            //i.style.marginRight="20px"
        })
        main.style.width = "320px";
        cont.style.padding = "10px";
        header.style.width = "320px";
        buttons.forEach(i => {
            i.style.width = "32px";
            i.style.height = "32px";
            i.style.margin = "10px";
        });
        map2.style.width = "100px";
        map2.style.height = "100px";

    }
})