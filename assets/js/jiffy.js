
const API_KEY = config.MY_KEY;
// here we grab our search input
const searchEl = document.querySelector('.search-input')
// here we grab our search hint
const hintEl = document.querySelector('.search-hint')
// here we grab our videos element and then append our newly created video to it
const videosEl = document.querySelector('.videos')
// this is for our clear search button
const clearEl = document.querySelector('.search-clear')


const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

const createVideo = src => {
  
  const video = document.createElement('video')
 
  video.src = src
  video.autoplay = true
  video.loop = true
 
  video.className = 'video'
 
  return video
}

const toggleLoading = state => {

  if (state) {
    document.body.classList.add('loading')
	
    searchEl.disabled = true
  } else {

    document.body.classList.remove('loading')
		
    searchEl.disabled = false
    searchEl.focus()
  }
}


const searchGiphy = searchTerm => {
  //  toggle our loading screen so the user knows something is happening
  toggleLoading(true)
//   console.log('search for', searchTerm)
  // here we put our URL into fetch
  // we use backticks for our string so that we can embed our API_KEY and searchTerm variables
  // the searchTerm part will be different for every varying search we make
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`
  )
 
    .then(response => {
      
      return response.json()
    })
    
    .then(json => {

      const gif = randomChoice(json.data)
   
      const src = gif.images.original.mp4

    
      const video = createVideo(src)

      videosEl.appendChild(video)

      // here we listen out for the video loaded event to fire
      // when it’s loaded we’ll display it on the page using a class
      // that triggers a transition effect
      video.addEventListener('loadeddata', event => {
        // this toggles the fading in effect ofr our videos
        video.classList.add('visible')
        // here we toggle the loading state off
        toggleLoading(false)
        // here we add a 'has-results' class to toggle the close button
        document.body.classList.add('has-results')
				// change the hint text to see more results
        hintEl.innerHTML = `Hit enter to search more ${searchTerm}`
      })
    })
    .catch(error => {
      // lastly we can use .catch() to do something in case our fetch fails
			// here we toggle the loading state so it’s disabled
    	toggleLoading(false)
			// here we tell the user nothing was found
    	hintEl.innerHTML = `Nothing found for ${searchTerm}`
    })
}


const doSearch = event => {

  const searchTerm = searchEl.value

  if (searchTerm.length > 2) {
    
    hintEl.innerHTML = `Hit enter to search ${searchTerm}`
    
    document.body.classList.add('show-hint')
  } else {
    
    document.body.classList.remove('show-hint')
  }


  if (event.key === 'Enter' && searchTerm.length > 2) {
 
    searchGiphy(searchTerm)
  }
}

const clearSearch = event => {
	
  document.body.classList.remove('has-results')
  
  videosEl.innerHTML = ''
  hintEl.innerHTML = ''
  searchEl.value = ''

  searchEl.focus()
}

// listen out for keyup events globally across the whole page
//  use the document keyword and attach the addEventListener to it
document.addEventListener('keyup', event => {

  if (event.key === 'Escape') {
    clearSearch()
  }
})


searchEl.addEventListener('keyup', doSearch)
clearEl.addEventListener('click', clearSearch)