/* script.js */
// declare API key and nyt homepage url variables
const api_key = 'YOUR_API_KEY_GOES_HERE'
const url = 'http://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + api_key
// get a handle on the various elements in the DOM
const select = document.querySelector('#section')
const newsArea = document.querySelector('#news')
const spinner = document.querySelector('#spinner')
const articleCount = document.querySelector('#articleCount')
const refreshBtn = document.querySelector('#refreshBtn')

// This function will create a card for a news story
function createCard(story) {
    let card = document.createElement('div')
    card.classList.add('col-3')
    card.classList.add('card')
    card.classList.add('mx-2')
    card.classList.add('my-3')
    // Build the inside elements of the card div before appending it to the DOM
    // Create div element for section title, pulling title from API data, and append to card
    let section = document.createElement('div')
    if (story.section != '') {
        if (story.section == 'realestate') {
            section.innerText = "REAL ESTATE"
        } else if (story.section == 'well') {
            section.innerText = "WELLNESS"
        } else if (story.section == 'nyregion') {
            section.innerText = "NY REGION"
        } else if (story.section == 'your-money') {
            section.innerText = "YOUR MONEY"
        } else {
            section.innerText = story.section.toUpperCase()
        }
    } else {
        section.innerText = "UNCATEGORIZED"
    }
    section.classList.add('sectionTitle')
    card.appendChild(section)
    // create img element, set its source to the image url from API data, and append to card. If API data does not have images for that story, then use an image placeholder
    let img = document.createElement('img')
    if (story.multimedia != null) {
        img.setAttribute('src', story.multimedia[0].url)
        img.setAttribute('alt', story.multimedia[0].caption)
    } else {
        img.setAttribute('src', 'https://cdn.pixabay.com/photo/2017/03/21/02/00/image-2160911_960_720.png')
        img.setAttribute('alt', 'image placeholder')
    }
    img.classList.add('card-img-top')
    card.appendChild(img)
    // create div for card body
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    // create h5 element for news article title, pulling title from API data. Make the title a link to the article. Append to the card body div
    let h5 = document.createElement('h5')
    h5.classList.add('card-title')
    let titleLink = document.createElement('a')
    titleLink.setAttribute('href', story.url)
    titleLink.setAttribute('title', story.title)
    titleLink.innerText = story.title
    h5.appendChild(titleLink)
    cardBody.appendChild(h5)
    // create paragraph, set its inside to the byline and date from API data, and append to card body div
    p = document.createElement('p')
    let date = new Date(story.published_date)
    let pubDate = date.toLocaleDateString('en-us', { month: "long", day: "numeric", year: "numeric" })
    p.classList.add('card-subtitle')
    p.classList.add('mb-2')
    p.classList.add('text-muted')
    if (story.byline != '') {
        p.innerHTML = story.byline + "<br>" + pubDate
    } else {
        p.innerHTML = "Author not listed<br>" + pubDate
    }
    cardBody.appendChild(p)
    // create a paragraph, set its text to abstract pulled from API data, then append to card body div
    p = document.createElement('p')
    p.classList.add('card-text')
    if (story.abstract != '') {
        p.innerText = story.abstract
    } else {
        p.innerText = "No abstract available."
    }
    cardBody.appendChild(p)
    // append the card body div to the card div
    card.appendChild(cardBody)
    // return the full card
    return card
}

// this function clears out previous results and displays the loading spinner
function prepareDisplay() {
    spinner.style.display = 'block'
    newsArea.innerHTML = ''
    articleCount.innerHTML = ''
}

// perform a fetch operation to retrieve the NYT API Top Stories data
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // interate through each news story from the retrieved API data, and call the createCard function to create a card for each story, then append each card to the DOM so they are displayed
        data.results.forEach(function (story) {
            newsArea.append(createCard(story))
        })
    })

// when the user select a new category to view, retrieve and display the news articles for that section
select.addEventListener('change', function () {
    // call the prepareDisplay function to clear previous results
    prepareDisplay()
    // declare the url for the specific section
    const urlSection = "http://api.nytimes.com/svc/topstories/v2/" + select.value + ".json?api-key=" + api_key
    // perform a fetch operation to retrieve the API data for the specific section selected by user
    fetch(urlSection)
        .then(response => response.json())
        .then(data => {
            // hide the loading spinner
            spinner.style.display = 'none'
            console.log(data)
            // display the number of articles
            let p = document.createElement('p')
            p.innerText = data.num_results + ' Results'
            articleCount.append(p)
            // interate through each news story from the retrieved API data, and create a card for each story, then append each card to the DOM so they are displayed
            data.results.forEach(function (story) {
                newsArea.append(createCard(story))
            })
        })
})

// when user clicks the Refresh button, retrieve and display the most up-to-date data for that section
refreshBtn.addEventListener('click', function () {
    // call the prepareDisplay function to clear previous results
    prepareDisplay()
    // declare the url for the specific section that was selected
    const urlSection = "http://api.nytimes.com/svc/topstories/v2/" + select.value + ".json?api-key=" + api_key
    // perform a fetch operation to retrieve the API data for the specific section to get most up-to-date data
    fetch(urlSection)
        .then(response => response.json())
        .then(data => {
            // hide the loading spinner
            spinner.style.display = 'none'
            console.log(data)
            // display the number of articles
            let p = document.createElement('p')
            p.innerText = data.num_results + ' Results'
            articleCount.append(p)
            // interate through each news story from the retrieved API data, and create a card for each story, then append each card to the DOM so they are displayed
            data.results.forEach(function (story) {
                newsArea.append(createCard(story))
            })
        })
})
