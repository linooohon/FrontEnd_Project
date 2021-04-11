/*
        1. 把 id 換成 獨一無二的 數字 從 0 開始
        2. taskSort 是為了讓視窗重新整理時可以讓每個 task 找到對應的 div 並 show 出來
        3. 記得task修改時，顏色也要重新設定給陣列、localStorage，也就只要有修改其中一個內容，陣列和 localStorage 都要更新到
        */
document.onselectstart = new Function("return false");
let colorId = "#64B6AC";
let storageArray = [];
let everydayIdOfMonthArray = [];
let popupContent = document.querySelector(".popup-content");
let popupInput = document.querySelector("#popup-input");
let allColor = document.querySelector(".all-color");
let eachColor = document.querySelector(".each-color");
let taskId;
let fixedTaskId;
let fixedTaskSort;
let inputSort;  //輸入框定位用

let allColorArray = ["#64B6AC", "#654F6F", "#3775bd", "#656768", "#CCE2A3", "#EFC3E6", "#B09E99", "#F3DFA2",
    "#FFB563", "#873b3e"
];

window.onload = function () {
    getPreviousLocalStorage();
    showTaskOnDays();
}


let today = new Date();
renderCalender();

//顯示出每一個月份日曆日子的製作
function renderCalender() {
    //為了讓換月時 id 清空
    everydayIdOfMonthArray = [];
    let monthDays = document.querySelector(".days");

    //抓到這個月最後一天，不加1就是上個月的最後一天，
    //最後.getDate()是為了只取得最後一天的數字，不加的話會印出一長串
    let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    //抓到上個月最後一天
    let prevLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

    //設定date為這個月第一天
    //為的是去跑日曆裡上個月的最後幾天
    //再把這天的禮拜幾用getDay印出來，2021年一月的第一天是禮拜五
    //也就是5，firstDayIndex = 5
    let firstDayOfMonth = today;
    firstDayOfMonth.setDate(1);
    let firstDayIndex = firstDayOfMonth.getDay();

    let lastDayIndex = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDay();
    let nextDays = 7 - lastDayIndex - 1;

    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    //自動抓現在的月份
    document.querySelector(".date h1").innerHTML = months[today.getMonth()];

    //自動抓今天的星期日月年
    //之所以這裡是 new Date 是因為我 button 按了之後 我的 today 變數也會改變
    //但我不想讓今天的日期有所變動，所以我要永遠在渲染出現在時間時都用 new Date()
    document.querySelector(".date p").innerHTML = new Date().toDateString();

    //動態加上個月的後面幾天
    monthDays.innerHTML = "";
    for (let x = firstDayIndex; x > 0; x--) {
        let div = document.createElement("div");
        div.classList.add("prev-date", "day-box");
        if (today.getMonth() === 0) {
            div.id = `${today.getFullYear() - 1}12${prevLastDay - x + 1}`;
        } else if (today.getMonth() < 9) {
            div.id = `${today.getFullYear()}0${today.getMonth()}${prevLastDay - x + 1}`;
        } else {
            div.id = `${today.getFullYear()}${today.getMonth()}${prevLastDay - x + 1}`;
        }
        div.innerHTML = prevLastDay - x + 1;
        monthDays.appendChild(div);

        everydayIdOfMonthArray.push(div.id);
    }

    //動態加這個月的天數
    for (let i = 1; i <= lastDay; i++) {
        let div = document.createElement("div");
        div.classList.add("day-box");
        if (i === new Date().getDate() && today.getMonth() === new Date().getMonth()) {
            div.classList.add("today");
            if (today.getMonth() < 9) {
                if (i < 10) {
                    div.id = `${today.getFullYear()}0${today.getMonth() + 1}0${i}`;
                } else {
                    div.id = `${today.getFullYear()}0${today.getMonth() + 1}${i}`;
                }
            } else {
                if (i < 10) {
                    div.id = `${today.getFullYear()}${today.getMonth() + 1}0${i}`;
                } else {
                    div.id = `${today.getFullYear()}${today.getMonth() + 1}${i}`;
                }
            }
            div.innerHTML = i;
        } else {
            if (today.getMonth() < 9) {
                if (i < 10) {
                    div.id = `${today.getFullYear()}0${today.getMonth() + 1}0${i}`;
                } else {
                    div.id = `${today.getFullYear()}0${today.getMonth() + 1}${i}`;
                }
            } else {
                if (i < 10) {
                    div.id = `${today.getFullYear()}${today.getMonth() + 1}0${i}`;
                } else {
                    div.id = `${today.getFullYear()}${today.getMonth() + 1}${i}`;
                }
            }
            div.innerHTML = i;
        }
        monthDays.appendChild(div);

        everydayIdOfMonthArray.push(div.id);
    }

    //動態加下個月的開頭幾天
    for (let j = 1; j <= nextDays; j++) {
        let div = document.createElement("div");
        div.classList.add("next-date", "day-box");
        if (today.getMonth() === 11) {
            div.id = `${today.getFullYear() + 1}010${j}`;
        } else if (today.getMonth() < 9) {
            div.id = `${today.getFullYear()}0${today.getMonth() + 2}0${j}`;
        } else {
            div.id = `${today.getFullYear()}${today.getMonth() + 2}0${j}`;
        }
        div.innerHTML = j;
        monthDays.appendChild(div);
        everydayIdOfMonthArray.push(div.id);
    }
    // console.log(everydayIdOfMonthArray);
}

//點擊變成上個月的日曆
document.querySelector(".prev").addEventListener("click", () => {
    today.setMonth(today.getMonth() - 1);
    renderCalender();
    showTaskOnDays();
});

//點擊變成下個月的日曆
document.querySelector(".next").addEventListener("click", () => {
    today.setMonth(today.getMonth() + 1);
    renderCalender();
    showTaskOnDays();
});


//彈出popup事項輸入框 function
function showPopUp(e) {
    // console.log(e.target);
    popupContent.style.opacity = "100";
    if (e.target.className === "day-box") {
        fixedTaskId = -1;
        popupInput.value = null;
        givePopUpBoxPosition(e);
    } else {
        // popupInput.value = null;
        givePopUpBoxPosition(e);
    }
}


//滑到後彈出 popup事項輸入框
document.querySelector(".days").addEventListener("click", showPopUp);

//修改內容
$(".days").on("click", ".content", function (e) {
    popupContent.style.opacity = "100";
    // console.log(e.target);
    // e.stopPropagation();
    popupInput.value = e.target.innerText;
    fixedTaskId = e.target.id;
    fixedTaskSort = e.target.dataset.sort;
    popupInput.focus();
    givePopUpBoxPosition(e);
});

// 刪除task 藉由 jq 的 on 動態綁定用法找到子層的dom  
// 找到垃圾桶的id 同時也是對應 task 的 id 把它從陣列刪掉 
// 把陣列foreach從新排列每一個task 的 id 並更新 localStorage 
$(".days").on("click", ".fa-trash", function (event) {
    deleteTask(event);
    popupContent.style.display = "none";
    popupContent.style.opacity = "0";
});

//要修改點task 出現輸入框
$(".days").on("click", ".task-item", function (e) {

    // console.log($(this).find(".content").text());

    // everydayIdOfMonthArray.forEach((id) => {
    //     let div = document.getElementById(id);
    //     div.classList.remove("show-days-background-color");
    // })
    // if (e.target.className !== "today") {
    //     e.target.classList.add("show-days-background-color");
    // }
    popupInput.value = $(this).find(".content").text();
    givePopUpBoxPosition(e);
});

//選出顏色function
allColor.addEventListener("click", getColorId);

//滑到其他地方 popup 消失
document.querySelector(".weekdays").addEventListener("click", (e) => {
    popupContent.style.display = "none";
});
document.querySelector(".month").addEventListener("click", (e) => {
    popupContent.style.display = "none";
});
document.querySelector(".main-item-2").addEventListener("click", (e) => {
    popupContent.style.display = "none";
});
//popup輸入之後存資料並show出當筆
popupInput.addEventListener("keypress", storeEveryTaskShowEveryTask);



//存一筆 show一筆
function storeEveryTaskShowEveryTask(e) {
    // console.log(e.target);

    //修改 改陣列 改localStorage show出來也改
    if (e.keyCode === 13 && popupInput.value !== "") {
        // console.log(e.target);

        // console.log(fixedTaskId);
        if (fixedTaskId >= 0) { //用大於等於0控制我現在是不是要修改 因為點擊想修改的後 fixedTaskId 才會大於等於 0 
            storageArray.forEach((everyTask) => {
                if (fixedTaskId == everyTask.id) { //注意這裡其實是字串跟數字在比 所以用 兩個 等於就好 
                    //塞回陣列
                    everyTask.value = popupInput.value;
                    everyTask.color = colorId;
                    //重新整理localStorage
                    jsonStringStorageArray = JSON.stringify(storageArray);
                    localStorage.setItem("item", jsonStringStorageArray);
                    //找到對應dom id 
                    //更改裡面的 p 的 content 
                    //更改 dom 的 backgroundcolor
                    let taskLi = document.getElementById(everyTask.id);
                    taskLi.querySelectorAll("p")[0].innerText = popupInput.value;
                    taskLi.style.backgroundColor = colorId;
                    //把 input 變空
                    popupInput.value = null;
                    fixedTaskId = -1; //這裡很重要最後修改完要把 fixedTaskId 變成 -1 結束修改這件事，這樣才不會一直進入這個迴圈，每次只能改這個
                }
            });

        } else { //新增 加進陣列 加近localStorage show出來
            e.preventDefault();
            makeId();
            let popupInputValue = popupInput.value;
            myObject = {
                id: taskId,
                taskSort: inputSort,
                value: popupInputValue,
                color: colorId,
                done: false,
                trash: false,
            }

            storageArray.push(myObject);
            jsonStringStorageArray = JSON.stringify(storageArray);
            localStorage.setItem("item", jsonStringStorageArray);
            popupInput.value = null;


            //一個個input 並show 在 calender
            // storageArray[storageArray.length - 1]
            let div = document.getElementById(myObject.taskSort);
            let taskLi = document.createElement("li");
            let i = document.createElement("i");
            let p = document.createElement("p");
            i.classList.add("fas", "fa-trash");
            i.setAttribute("job", "delete");
            i.setAttribute("data-sort", myObject.taskSort);
            taskLi.id = myObject.id;
            i.id = myObject.id;
            p.id = myObject.id;
            p.innerHTML = myObject.value;
            p.classList.add("content");
            p.setAttribute("data-sort", myObject.taskSort);
            taskLi.classList.add("task-item");
            taskLi.setAttribute("data-sort", myObject.taskSort);
            taskLi.style.backgroundColor = myObject.color;
            taskLi.appendChild(p);
            taskLi.appendChild(i);
            div.appendChild(taskLi);

            // console.log(storageArray);
            // console.log(localStorage);
        }
        popupContent.style.display = "none";
    }
}


//拿顏色
function getColorId(e) {
    colorId = e.target.id;
    //換 placeholder 的顏色
    popupInput.style.setProperty("--c", e.target.id);
    allColorArray.forEach((item) => {
        // document.getElementById(item).classList.add("clean-color-border");
        document.getElementById(item).classList.remove("show-color-border");
        if (e.target.id === item) {
            e.target.classList.add("show-color-border");
        }
    })
    popupInput.focus();
}

//為了使重新整理後 localStorage 資料不會不見
function getPreviousLocalStorage() {
    if (localStorage.getItem("item") !== null) {
        storageArray = JSON.parse(localStorage.getItem("item"));
    } else {
        storageArray = [];
        localStorage.setItem("item", JSON.stringify(storageArray));
    }
}

//為了使task show 在 calender上
function showTaskOnDays() {
    storageArray.forEach((everyTask) => {
        // let taskUl = document.createElement("ul");
        everydayIdOfMonthArray.forEach((everydayId) => {
            if (everyTask.taskSort === everydayId) {
                let div = document.getElementById(everydayId);
                let taskLi = document.createElement("li");
                let i = document.createElement("i");
                let p = document.createElement("p");
                i.classList.add("fas", "fa-trash");
                i.setAttribute("job", "delete");
                i.setAttribute("data-sort", everyTask.taskSort);
                taskLi.id = everyTask.id;
                i.id = everyTask.id;
                p.id = everyTask.id;
                p.innerHTML = everyTask.value;
                p.classList.add("content");
                p.setAttribute("data-sort", everyTask.taskSort);
                taskLi.classList.add("task-item");
                taskLi.setAttribute("data-sort", everyTask.taskSort);
                taskLi.style.backgroundColor = everyTask.color;
                taskLi.appendChild(p);
                taskLi.appendChild(i);
                div.appendChild(taskLi);
            }
        })
    });
}

//對應到每個格子的 id 給每個 task 有獨一無二的 id
function makeId() {
    if (storageArray.length === 0) {
        taskId = 0;
    } else {
        taskId = storageArray.length;
    }
}

//刪除 task
function deleteTask(event) {
    // console.log(localStorage);
    // console.log(event.target);
    let Id = event.target.id;
    let targetRemoveTask = document.getElementById(Id);
    targetRemoveTask.remove();  //在畫面上移除它
    // console.log(targetRemoveTask);
    storageArray.splice(Id, 1);
    // console.log(storageArray);
    if (storageArray.length > 0) {
        storageArray.forEach((task, index) => {
            task.id = index;
            jsonStringStorageArray = JSON.stringify(storageArray);
            localStorage.setItem("item", jsonStringStorageArray);

        });
    } else {
        storageArray = [];
        localStorage.removeItem("item");
    }
    // console.log(storageArray);
    // console.log(localStorage);

    // jsonStringStorageArray = JSON.stringify(storageArray);
    // localStorage.setItem("item", jsonStringStorageArray);

    // targetRemoveTask.remove();  //在畫面上移除它
}


//輸入框定位
function givePopUpBoxPosition(e) {
    // console.log(e.target.getBoundingClientRect().top);
    const targetInfo = e.target.getBoundingClientRect();
    inputSort = e.target.id;
    const targetData = {
        top: targetInfo.top + window.scrollY + (targetInfo.height / 1.5),
        left: targetInfo.left + window.scrollX + (targetInfo.width / 2)
    }
    popupContent.style.top = `${targetData.top}px`;
    popupContent.style.left = `${targetData.left}px`;
    popupContent.style.display = "block";
    popupContent.style.zIndex = "30";
    popupInput.focus();
}