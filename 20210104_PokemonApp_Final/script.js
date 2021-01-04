let pokemonArray = [];
        let pokemonArrayNew = [];
        let cardPokemonCloneContent;
        let index = -1;

        //一開始就跑 button 這樣可以確保非同步時的時間誤差
        window.onload = function () {
            getPokemonJSON();
            let hp_smallfirst = true;
            let id_smallfirst = true;
            let attack_smallfirst = true;
            let defense_smallfirst = true;
            let spattack_smallfirst = true;
            let spdefense_smallfirst = true;
            let speed_smallfirst = true;
            setbutton("add-all-card", "Id", id_smallfirst);
            setbutton("sort-hp", "Hp", hp_smallfirst);
            setbutton("sort-attack", "Attack", attack_smallfirst);
            setbutton("sort-defense", "Defense", defense_smallfirst);
            setbutton("sort-spattack", "Spattack", spattack_smallfirst);
            setbutton("sort-spdefense", "Spdefense", spdefense_smallfirst);
            setbutton("sort-speed", "Speed", speed_smallfirst);
        }


        function getPokemonJSON() {
            let xhr = new XMLHttpRequest();
            xhr.open("GET",
                "https://raw.githubusercontent.com/linooohon/frontEndProject/main/20201228_PokemonApp/pokemon.json");

            xhr.onload = function () {
                pokemonArray = JSON.parse(this.responseText);
                TransformData(pokemonArray);
                for (index = 0; index < 809; index++) {
                    DataToCardToRow(index);
                }
            }
            xhr.send(null);
        }


        //轉換資料塞給一個自己設的新陣列
        function TransformData(dataArray) {
            dataArray.forEach((item) => {
                let id = item.id.toString().padStart(3, "0");
                let type = item.type;
                let namejp = item.name.japanese;
                let namech = item.name.chinese;
                let nameen = item.name.english;
                let hp = item.base.HP;
                let attack = item.base.Attack;
                let defense = item.base.Defense;
                let sp_attack = item.base["Sp_Attack"];
                let sp_defense = item.base["Sp_Defense"];
                let speed = item.base.Speed;
                let img = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png`;
                let evolution = item.evolution
                let pokemon = {
                    Id: id,
                    Type: type,
                    NameJp: namejp,
                    NameCh: namech,
                    NameEn: nameen,
                    Hp: hp,
                    Attack: attack,
                    Defense: defense,
                    Spattack: sp_attack,
                    Spdefense: sp_defense,
                    Speed: speed,
                    Img: img,
                    Evolution: evolution,
                }
                pokemonArrayNew.push(pokemon);
            });
        }



        let item = pokemonArrayNew;
        //塞資料到 clone卡片 ，最後再塞到 row
        function DataToCardToRow(index) {
            let row = document.querySelector("#row");
            let cardPokemon = document.querySelector("#cardPokemon");

            cardPokemonCloneContent = cardPokemon.content.cloneNode(true);
            cardPokemonCloneContent.querySelector("#card-img-top").src = item[index].Img;
            cardPokemonCloneContent.querySelector("#card-id").innerHTML = `#${item[index].Id}`;
            cardPokemonCloneContent.querySelector("#card-title-jp").innerText = item[index].NameJp;
            cardPokemonCloneContent.querySelector("#card-title-ch").innerText = item[index].NameCh;
            cardPokemonCloneContent.querySelector("#card-text").innerText = item[index].Type;

            //在 clone卡片的 button 設 click事件，設定點擊後要處理的屬性 modal #example，塞進 clone卡片對照的 modal
            cardPokemonCloneContent.querySelector("#btn").addEventListener("click", function () {
                this.setAttribute("data-toggle", "modal");
                this.setAttribute("data-target", "#exampleModal");
                let modal = document.querySelector("#exampleModal");
                modal.querySelector("#exampleModalLabel").innerText = item[index].NameCh;
                modal.querySelector("#modal-img").src = item[index].Img;
                modal.querySelector("#modal-type").innerText = item[index].Type;
                modal.querySelector("#description").innerText =
                    `Hp : ${item[index].Hp}
                    Attack : ${item[index].Attack}
                    Defense : ${item[index].Defense}
                    SPAttack : ${item[index].Spattack}
                    SPDefense : ${item[index].Spdefense}
                    Speed : ${item[index].Speed}`

                if (item[index].Evolution[0].id.toString().padStart(3, "0") != "000") {
                    modal.querySelector("#evolution-name").innerHTML =
                        `- Evolution -<br>${item[index].Evolution[0].name}`;
                    modal.querySelector("#evolution-img").src =
                        `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${item[index].Evolution[0].id.toString().padStart(3, "0")}.png`;
                } else {
                    modal.querySelector("#evolution-name").innerText = "";
                    modal.querySelector("#evolution-img").src = "";
                }
            });
            row.appendChild(cardPokemonCloneContent); //最後塞進 row
        }

        //綁定 button 塞資料
        function setbutton(btn_id, property, flag) {
            document.querySelector(`#${btn_id}`).addEventListener("click", function () {
                row.innerText = "";
                sortProperty(item, property, flag);
                for (index = 0; index < 809; index++) {
                    DataToCardToRow(index);
                }
                flag = !(flag);
            });
        }

        //製造排序
        function sortProperty(item, property, flag) {
            item.sort(function (a, b) {
                let result = b[property] - a[property];
                if (!flag) {
                    result = result * (-1);
                }
                return result;
            });
        }


        //reset
        document.querySelector("#reduce-all-card").addEventListener("click", function () {
            row.innerText = "";
            index = -1;
        });


        //加一張
        document.querySelector("#add-card").addEventListener("click", function () {
            index++;
            DataToCardToRow(index);
            item.sort(function (a, b) {
                return a.Id < b.Id;
            });
        });

        //減一張
        document.querySelector("#reduce-card").addEventListener("click", function () {
            if (index >= 0) {
                row = document.querySelector(".row");
                card = document.querySelector(".card:last-child");
                row.removeChild(card);
                index--;
            }
        });