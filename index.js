const BASE_URL = 'https://webdev.alphacamp.io'
// const CORS_URL = 'https://cors-anywhere.herokuapp.com/'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const movies = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
//顯示page有幾頁
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')
let filteredMovies = []
let currentPage = 1
const modeChangeSwitch = document.querySelector('#change-mode')
//movies.length經過算式後，將動態的li重新渲染到template

//-------------------渲染分頁---------------------------------------------------------
function renderPaginator(amount) {
  //Math.ceil無條件進位
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    //data綁在超連結上
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
//-------------------切出每頁所需的電影數量-------------------------------------------------
function getMovieByPage(page) {
  //依參數切割array movies
  // page 1 -> movies 0-11
  // page 2 -> movies 12-23
  // page 3 -> movies 24-35
  //三元運算子：條件 ? 值1 : 值2，條件為 true，運算子回傳值 1， 否則回傳值
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * (MOVIES_PER_PAGE)
  // return startIndex
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}
//---------------------渲染電影清單--------------------------------------------------
function renderMovieList(data) {
  if (dataPanel.dataset.mode === 'card-mode') {
    let rawHTML = ''
    data.forEach((item) => {
      rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
                More
              </button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    })
    dataPanel.innerHTML = rawHTML
  } else if (dataPanel.dataset.mode === 'list-mode') {
    let rawHTML = ''
    data.forEach((item) => {
      rawHTML += `
      <ul class="list-group col-sm-12 mb-2">
        <li class="list-group-item d-flex justify-content-between">
          <h5 class="card-title">${item.title}</h5>
          <div>
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"   data-bs-target="#movie-modal"
              data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li>
      </ul>
      `
    })
    dataPanel.innerHTML = rawHTML
  }
}
//-----------------showModal---------------------------------------------------
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    console.log(POSTER_URL)
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date:' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}
//---------------------加入我的最愛----------------------------------------------
function addToFavorite(id) {
  // console.log(id)
  //localstorage儲存不希望它消失，又不是非常重要的資料;購物車、多國語言的網頁
  //匿名函式的function
  // function isMovieIdMatched(movie) {
  //   return movie.id === id
  // }

  //運用JSON.parse(value)轉換成js的物件、JSON.stringify(obj)來轉換JSON字串
  //如果 localStorage 裡沒有存過叫 favoriteMovies 的資料，
  //localStorage.getItem('favoriteMovies') 就會回傳 null
  //運用邏輯運算子OR，給我localStorage.getItem，沒有的話空array也可以(如果兩邊都是true以左邊為優先)
  //find跟some一樣都會去一一比對array的元素，find會回傳第一個符合條件的item，some則是回傳true或false
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  console.log(list)
  const movie = movies.find((movie) => movie.id === id)
  console.log(list)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中!')
  }
  list.push(movie)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // console.log(list)
}
//-----------------------變更class模式---------------------------------------------
//在icon的父層div新增監聽器modeChangeSwitch，運用判斷式跟matches判斷使用者點擊的是cardbtn還是listbtn
//call function changeDisplayMode帶入相對應的參數，變更新增在datapanel裡的data-mode
//讓修改後的rendermovielist去判斷要render cardmode或listmode
//將targetpage存進新增的變數currentpage維持現有分頁，讓函式可以共用
function changeDisplayMode(displayMode) {
  if (dataPanel.dataset.mode === displayMode) return
  dataPanel.dataset.mode = displayMode
  console.log(dataPanel.dataset)
}
//-----------------icon父層新增監聽器-------------------------
modeChangeSwitch.addEventListener('click', function onSwitchClicked(event) {
  if (event.target.matches('#card-mode-button')) {
    changeDisplayMode('card-mode')
    renderMovieList(getMovieByPage(currentPage))
  } else if (event.target.matches('#list-mode-button')) {
    changeDisplayMode('list-mode')
    renderMovieList(getMovieByPage(currentPage))
  }
})
//--------------------------------------------------------------------------
dataPanel.addEventListener('click', function onPaneClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
//-------------------------分頁監聽器----------------------------------------
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果點擊target的tagName不是A(超連結)的話
  if (event.target.tagName !== 'A') return
  //綁上去的data都是string記得轉number
  const Page = Number(event.target.dataset.page)
  currentPage = Page
  renderMovieList(getMovieByPage(currentPage))
})
//----------------------搜尋輸入監聽器----------------------------------------
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //瀏覽器在提交form的時候預設會重整頁面
  //preventDefault()請瀏覽器不要做預設動作
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  //如果輸入的是空字串(keyword.length原本是false都還沒輸入的情況下，如果有輸入會變ture)
  //如果 inputvalue長度等於0，boolean是false，運用單驚嘆號轉換布林值為true
  // if (!keyword.length) {
  //   return alert('please input movie title')
  // }
  //運用includes檢查movie.title是否含有參數(keyword)，有的話回傳true，沒有回傳false
  //將符合的movie.title push到 array filteredMovies
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }
  //運用filter把array每一個元素都拿出來丟到函式條件去檢查，有成功留下，沒成功則丟掉
  // filteredMovies = movies.filter((movie) =>
  //   movie.title.toLowerCase().includes(keyword))
  filteredMovies = movies.filter(checkMovieTitle)
  function checkMovieTitle(movie) {
    return movie.title.toLowerCase().includes(keyword)
  }
  //必須放在filter之後，array裡才有元素可以判斷
  //array filteredMovies.length === 0，代表userinput沒有符合movie.title
  if (filteredMovies.length === 0) {
    alert('cannot find movies with keyword' + ' ' + keyword)
  } else if (!keyword.length) {
    alert('please enter a valid string')
  }
  currentPage = 1
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(currentPage))
})

//---------------------------------------------------------------------------
axios.get(INDEX_URL).then((response) => {
  console.log(response)
  movies.push(...response.data.results)
  // console.log(response)
  //使用for of迴圈取array的元素
  // for (const movie of response.data.results) {
  //   movies.push(movie)
  // console.log(movies)
  // }
  renderPaginator(movies.length)
  renderMovieList(getMovieByPage(currentPage))
})
  .catch((err) => console.log(err))


