const gallery = document.getElementById('gallery');
const closingBtn = document.getElementById("modal-close-btn");
const modalView = document.getElementById("modal-container");

// Unerneath are all the elements created for the searchbar in the header.
const form = document.createElement('form');
form.action = '#'
form.method = 'get'

const input = document.createElement('input');
input.type = 'search';
input.className = 'search-input';
input.placeholder = 'Search...';
input.id = 'search-input';

const searchButton = document.createElement('input');
searchButton.type = 'submit';
searchButton.value = "&#x1F50D;"
searchButton.id = "search-submit"
searchButton.className = "search-submit";
searchButton.value = 'submit';

const header = document.querySelector('header').lastElementChild.lastElementChild;
header.appendChild(form);
form.appendChild(input);
form.appendChild(searchButton);


// the fetch calls 12 employees each time the page refreshes
fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => createHTML(data.results))

// this function creates an html for the 12 employees and let's a modal view pop up when an employee is clicked
function createHTML (data) {

  // underneath an html card is made and displayed for all 12 employee
  let cardHtml ='';
  data.map((employee) => {
    return cardHtml += createCard(employee);
  })
  gallery.insertAdjacentHTML('beforeend', cardHtml)

  // the eventlistener underneath displays a new employeelist based on the user search
  let filteredList = [];
  form.addEventListener('submit', (e) => {
    filteredList = [];
    let text = input.value.toLowerCase();
    for (let i = 0; i <data.length ; i++){
      if (data[i].name.first.toLowerCase().includes(text) || data[i].name.last.toLowerCase().includes(text) ){
        filteredList = filteredList.concat(data[i]);
      }
    }
    let cardHtml ='';
    if (filteredList.length > 0){
      gallery.innerHTML = '';
      filteredList.map((employee) => {
        return cardHtml += createCard(employee);
      })
    } else if(input.value === ''){
      data.map((employee) => {
        return cardHtml += createCard(employee);
      })
    } else{
      gallery.innerHTML = '';
      cardHtml = createError()
    }
    gallery.insertAdjacentHTML('beforeend', cardHtml)
  });

  // This eventlistener creates 'click' interactivity for the user. Handels multiple functions
  gallery.addEventListener('click', (e) => {
    let clickedEmployee = e.target;
    if(clickedEmployee.className !== "card"){
      if(clickedEmployee.id === "modal-close-btn" || clickedEmployee.tagName === 'STRONG' || clickedEmployee.id === "modal-container" ){
        let closingButton = clickedEmployee
        if(closingButton.textContent === 'X'){
          closingButton = closingButton.parentNode
        }
        return gallery.removeChild(gallery.lastElementChild)

      } else if(clickedEmployee.className === "card-img-container" || clickedEmployee.className === "card-info-container"){
        clickedEmployee = clickedEmployee.parentNode;
      } else if (clickedEmployee.className === "gallery" || clickedEmployee.className === ""){
        clickedEmployee = null;
      } else {
        clickedEmployee = clickedEmployee.parentNode.parentNode;
      }
    }

    //the function underneath creates the modal view for the clickedEmployee
    for(let i =0; i<data.length; i++){
      let modalHtml='';
      clickedEmployeeName = clickedEmployee.lastElementChild.firstElementChild.id;

      if(data[i].name.last === clickedEmployeeName){
        modalHtml = createModal(data[i])
        gallery.insertAdjacentHTML('beforeend', modalHtml)
      }
    }

    // function underneath switches the modalview to the previous employee when the 'prev' button is clicked
    if(e.target.id === "modal-prev"){
      for(let i =0; i<data.length; i++){
        let currentEmployeeName = clickedEmployee.firstElementChild.lastElementChild.firstElementChild.nextElementSibling.id;
        if(data[i].name.last === currentEmployeeName && data.indexOf(data[i]) !== 0){
          let prevModalEmployee = data[i-1]
          let modalHtml = createModal(prevModalEmployee)
          gallery.removeChild(gallery.lastElementChild)
          gallery.insertAdjacentHTML('beforeend', modalHtml)
        }
      }
    }

    // function underneath switches the modalview to the next employee when the 'next' button is clicked
    if(e.target.id === "modal-next"){
      for(let i =0; i<data.length; i++){
        let currentEmployeeName = clickedEmployee.firstElementChild.lastElementChild.firstElementChild.nextElementSibling.id;
        if(data[i].name.last === currentEmployeeName && data.indexOf(data[i]) !== 11){
          let nextModalEmployee = data[i+1]
          let modalHtml = createModal(nextModalEmployee)
          gallery.removeChild(gallery.lastElementChild)
          gallery.insertAdjacentHTML('beforeend', modalHtml)
        }
      }
    }
  })
}

// function that creates a html card
 function createCard(employee){
  let html='';
  let employeeHtml = `
    <div class="card">
      <div class="card-img-container">
        <img class="card-img" src=${employee.picture.medium} alt='profile picture'>
      </div>
      <div class="card-info-container">
        <h3 id="${employee.name.last}" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="card-text">${employee.email}</p>
        <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
      </div>
    </div>
   `
   return html+=employeeHtml
}

// function creates a error html card
function createError(){
 let html='';
 let employeeHtml = `
   <div class="card">
     <div class="card-info-container">
       <h3 id="error">No Results</h3>
     </div>
   </div>
  `
  return html+=employeeHtml
}


// this function creates the modalView of an employee
function createModal(data) {
  let modalHtml =`
  <div id="modal-container" class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${data.picture.large}" alt="profile picture">
              <h3 id="${data.name.last}" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
              <p class="modal-text">${data.email}</p>
              <p class="modal-text cap">${data.location.city}</p>
              <hr>
              <p class="modal-text">${reformatPhoneNumber(data.phone)}</p>
              <p class="modal-text">${data.location.street.number} ${data.location.street.name}, ${data.location.state}, ${data.nat} ${data.location.postcode}</p>
              <p class="modal-text">Birthday: ${reformatBirthday(data.registered.date)}</p>
          </div>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>

  `
  return modalHtml
}

// this function reformats the employees phone number.
function reformatPhoneNumber(phone) {
    phone = phone.replace(/[^\d]/g, "");
    return phone.replace(/(\d{3})(\d{3})(\d+)/, "($1) $2-$3");
};

// this function reformats the employees birtday.
function reformatBirthday(date){
  let reform = date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
  reform = reform[0].replace(/-/g,'');
  return reform.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$2/$3/$1')
}
