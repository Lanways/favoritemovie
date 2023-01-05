const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''

  //processing
  data.forEach((item) => {
    //title, image
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
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date:' + data.release_date
    modalDescription.innerHTML = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  //錯誤處理
  //收藏清單一定要先存在並有元素，「移除收藏清單」這個功能才可能順利運作
  //傳入的 id 在收藏清單中不存在，或收藏清單是空的，就return結束函式
  //其中一個回傳true的話就return停止執行下面程式碼
  if (!movies || !movies.length) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  //存回localStorage，避免在favorite分頁已經刪除，但是在index首頁卻不能新增
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  //刪除後重新呼叫render，讓movie消失
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPaneClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
//   //瀏覽器在提交form的時候預設會重整頁面
//   //preventDefault()請瀏覽器不要做預設動作
//   event.preventDefault()
//   const keyword = searchInput.value.trim().toLowerCase()
//   let filteredMovies = []
//   console.log(keyword)
//   //如果 inputvalue長度等於0，boolean是false，運用單驚嘆號轉換布林值為true
//   // if (!keyword.length) {
//   //   return alert('please enter a valid string')
//   // }

//   //運用includes檢查movie.title是否含有參數(keyword)，有的話回傳true，沒有回傳false
//   //將符合的movie.title push到 array filteredMovies
//   // for (const movie of movies) {
//   //   if (movie.title.toLowerCase().includes(keyword)) {
//   //     filteredMovies.push(movie)
//   //   }
//   // }

//   //運用filter把array每一個元素都拿出來丟到函式條件去檢查，有成功留下，沒成功則丟掉
//   // filteredMovies = movies.filter((movie) =>
//   //   movie.title.toLowerCase().includes(keyword))

//   filteredMovies = movies.filter(checkMovieTitle)

//   function checkMovieTitle(movie) {
//     return movie.title.toLowerCase().includes(keyword)
//   }
//   //必須放在filter之後，array裡才有元素可以判斷
//   //array filteredMovies.length === 0，代表userinput沒有符合movie.title
//   if (filteredMovies.length === 0) {
//     alert('cannot find movies with keyword' + ' ' + keyword)
//   } else if (!keyword.length) {
//     alert('please enter a valid string')
//   }

//   renderMovieList(filteredMovies)
// })


// axios.get(INDEX_URL).then((response) => {
//   movies.push(...response.data.results)
//   // console.log(response)
//   //使用for of迴圈取array的元素
//   // for (const movie of response.data.results) {
//   //   movies.push(movie)
//   // console.log(movies)
//   // }
//   renderMovieList(movies)
// })

renderMovieList(movies)