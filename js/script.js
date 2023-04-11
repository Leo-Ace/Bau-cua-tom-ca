const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const log = console.log.bind(document);

function exitFormClick(textItem, boxElement, knotExit, formItem) {
  const textItemr = $(textItem);
  const boxElements = $(boxElement);
  const knotExited = $(knotExit);
  const formItemElem = $(formItem);
  boxElements.style.display = "block";
  document.addEventListener('click', (e)=> {
    if(!textItemr.contains(e.target) && !formItemElem.contains(e.target) || knotExited.contains(e.target)) {
      boxElements.style.display = "none";
    }
  })
};
(()=>{
  // code even play games
  (()=> {
    const btnStartPlay = $('.btn-start');
    const listAddMoney = $$('.itemPhoto');
    const valueLeverMoney = $('#lvMoney');
    const btnLoadCard = $('.btn-loadCard');
    const myMoney = $('#myMoney');
    const listResultImg = $$('#listResult>li>img');
    const sumMoneyElem = $('.sumMoney>span');
    const listHistory = $('.list-history');

    var checkPlaying = false;
    
    // add money in gamesplay
    const addMoneyInGames = ()=> {
      const boxAddMoney = $('.box-addMoney');
      btnLoadCard.onclick = ()=> {
        var valueMoneyAdd = $('#prices').value;
        myMoney.innerHTML = parseInt(valueMoneyAdd) + parseInt(myMoney.innerHTML);
        boxAddMoney.style.display = 'none';
        $('#prices option[value="0"]').selected = true;
        $('#IdCard').value = '';
        $('#Seri').value = '';
      }
      return parseInt(myMoney.innerHTML);
    }
    addMoneyInGames();

    // get value in list Selection of user
    const selectionOfUser = ()=> {
      listAddMoney.forEach((item)=> {
        item.addEventListener('click', ()=> {
          var valueSelect = valueLeverMoney.value;
          var valueDefault = item.querySelector('span').innerHTML;
          var valueNew = parseInt(valueDefault) + parseInt(valueSelect);
          if(parseInt(myMoney.innerHTML) >= valueSelect && myMoney.innerHTML != 0) {
            myMoney.innerHTML = `${parseInt(myMoney.innerHTML) - parseInt(valueSelect)}`
            item.querySelector('span').innerHTML = `+${valueNew}`;
            // set value of sum Moneys in class Element
            var valueSumMoney = [...listAddMoney].reduce((exe, item)=>exe + parseInt(item.querySelector('span').innerHTML) ,0);
            sumMoneyElem.innerHTML = `${parseInt(valueSumMoney/1000)}.000 VND`;
          } else {
            const formError = $('.formError');
            formError.style.display = 'block';
            formError.style.opacity = '1';
            formError.querySelector('div>span').innerHTML = '3';
            setTimeout(()=>{
              formError.querySelector('div>span').innerHTML = '2';
              setTimeout(()=>{
                formError.querySelector('div>span').innerHTML = '1';
                setTimeout(()=>{
                  formError.style.opacity = '0';
                  setTimeout(()=> {
                    formError.style.display = 'none';
                  }, 500)
                }, 500)
              }, 1000);
            }, 1000);
          }
        })
      })
    }
    selectionOfUser();

    const listPhotos = [
      {
        valueSrc: './img/nai.png',
        percent: 1/6
      },
      {
        valueSrc: './img/bau.png',
        percent: 1/6
      },
      {
        valueSrc: './img/ga.png',
        percent: 1/6
      },
      {
        valueSrc: './img/ca.png',
        percent: 1/6
      },
      {
        valueSrc: './img/cua.png',
        percent: 1/6
      },
      {
        valueSrc: './img/tom.png',
        percent: 1/6
      }
    ];

    // render photo
    const renderResult = (indexElem, photoElem, times)=> {
      checkPlaying = true;
      var i = 0, j = 0;
      setTime = (index, photoItem, i, j)=> {
        if(index < listPhotos.length) {
          photoItem.setAttribute('src', listPhotos[index].valueSrc);
          index++;
        } else if(i < listPhotos.length) {
          photoItem.setAttribute('src', listPhotos[i].valueSrc);
          i++;
        } else {
          i = 0;
          if(i <= indexElem) {
            photoItem.setAttribute('src', listPhotos[i].valueSrc);
            i++;
          }
        };
        if(j <= (listPhotos.length)*2-1) {
          setTimeout(()=> {
            setTime(index, photoItem, i, j+1);
          }, 100);
        }
      };
      setTime(indexElem, photoElem, i, j);
      const setinterval = setInterval(()=>{
        setTime(indexElem, photoElem, i, j);
      }, 100*((listPhotos.length)*2-1));
      
      setTimeout(()=>{
        clearInterval(setinterval)
        checkPlaying = false;
      }, times*100*((listPhotos.length)*2-1));
    }

    // get result
    const getResult = (randomNber)=> {
      let percentNow = 0;
      let list = [];

      listPhotos.forEach((item, index)=> {
        percentNow += item.percent;

        randomNber <= percentNow && 
        list.push({
          ...item,
          index
        });
      })
      return list[0];
    }

    // get list Selection of user
    const getListSelections = ()=> {
      var list = [...listAddMoney].filter((item)=> {
        return parseInt(item.querySelector('span').innerHTML) !=0 ;
      });
      return list;
    }

    // get gift of win
    const getGiftOfWin = (listResult, listSelections)=> {
      const date = new Date();
      var moneys = 0;
      const formGift = $('#formGift');
      if(listSelections.length != 0) {
        listSelections.forEach((item)=> {
          var element = listResult.filter((elem)=> {
            return item.querySelector('img').getAttribute('src').toString() == elem.valueSrc.toString();
          });
          if(element.length != 0) {
            moneys += parseInt(item.querySelector('span').innerHTML) * (element.length + 1);
          }
        });
        var ProfitAndLoss = `${parseInt(sumMoneyElem.innerHTML.slice(0,sumMoneyElem.innerHTML.length-4))}000`;
        var valueMoney = moneys-parseInt(ProfitAndLoss);
        log(valueMoney)
        if(moneys == 0) {
          formGift.querySelector('span').innerHTML = `${valueMoney}`;
        } else formGift.querySelector('span').innerHTML = `+${moneys} VND`;
        formGift.style.display = 'block';
        myMoney.innerHTML = parseInt(myMoney.innerHTML) + moneys;
        if(valueMoney > 0) {
          listHistory.innerHTML = listHistory.innerHTML + `
          <li>
            <span>${parseInt(date.getMonth()+1)}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()} : </span>
            <b>Lời ${valueMoney} VND</b>
          </li>
          `
        } else if(valueMoney < 0){
          listHistory.innerHTML = listHistory.innerHTML + `
          <li>
            <span>${parseInt(date.getMonth()+1)}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()} : </span>
            <b>Lỗ ${valueMoney} VND</b>
          </li>
          `
        } else {
          listHistory.innerHTML = listHistory.innerHTML + `
          <li>
            <span>${parseInt(date.getMonth()+1)}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()} : </span>
            <b>Hòa ${valueMoney} VND</b>
          </li>
          `
        }

        // reset element
        listSelections.forEach((item)=> {
          item.querySelector('span').innerHTML = '+0';
        });
        sumMoneyElem.innerHTML = '0 VND';
        setTimeout(()=> {
          formGift.style.display = 'none';
        }, 2000);
      }
    }
    
    const start = ()=> {
      var listSelections = getListSelections();
      checkPlaying = false;
      var times = 3;
      var random1 = Math.random();
      var random2 = Math.random();
      var random3 = Math.random();
      const listResult = [
        getResult(random1),
        getResult(random2),
        getResult(random3)
      ]
      // log(listResult);
      renderResult(getResult(random1).index, listResultImg[0], times);
      renderResult(getResult(random2).index, listResultImg[1], times);
      renderResult(getResult(random3).index, listResultImg[2], times);
      setTimeout(()=> {
        getGiftOfWin(listResult, listSelections);
      }, times*100*(listPhotos.length)*2 + times*600);
    };
    
    btnStartPlay.onclick = ()=> {
      !checkPlaying && getListSelections().length !=0 && start();
    }
  })();
})();