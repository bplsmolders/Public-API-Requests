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

const header = document.querySelector('header');
header.appendChild(form);
form.appendChild(input);
form.appendChild(searchButton);
form.style.display = 'inline-block';


// the fetch calls 12 employees each time the page refreshes
fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => createHTML(data.results))

// this function creates an html for the 12 employees and let's a modal view pop up when an employee is clicked
function createHTML (data) {
  // underneath an html card is made and displayed for each employee
  console.log(data);
  let html ='';
  data.map((employee) => {
    return html += createCard(employee);
  })
  console.log(html)

  gallery.insertAdjacentHTML('beforeend', html)

  // underneath there is a modal window created when an employee is clicked
  gallery.addEventListener('click', (e) => {
    let clickedEmployee = e.target;
    if(clickedEmployee.className !== "card"){
      if(clickedEmployee.tagName === 'BUTTON' || clickedEmployee.tagName === 'STRONG'){
        let closingButton = clickedEmployee
        if(closingButton.textContent === 'X'){
          closingButton = closingButton.parentNode
        }
        gallery.removeChild(gallery.lastElementChild)

      } else if(clickedEmployee.className === "card-img-container" || clickedEmployee.className === "card-info-container"){
        clickedEmployee = clickedEmployee.parentNode;
      } else if (clickedEmployee.className === "gallery" || clickedEmployee.className === ""){
        clickedEmployee = null;
      } else {
        clickedEmployee = clickedEmployee.parentNode.parentNode;
      }
    }


    for(let i =0; i<data.length; i++){
      let modalHtml=''
      clickedEmployeeName = clickedEmployee.lastElementChild.firstElementChild.id;
      if(data[i].name.last === clickedEmployeeName){
        // console.log(data[i])
        modalHtml =`
        <div id="modal-container" class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${data[i].picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                    <p class="modal-text">${data[i].email}</p>
                    <p class="modal-text cap">${data[i].location.city}</p>
                    <hr>
                    <p class="modal-text">${reformatPhoneNumber(data[i].phone)}</p>
                    <p class="modal-text">${data[i].location.street.number} ${data[i].location.street.name}, ${data[i].location.state}, ${data[i].nat} ${data[i].location.postcode}</p>
                    <p class="modal-text">Birthday: ${reformatBirthday(data[i].registered.date)}</p>
                </div>
            </div>
        </div>
        `
      }
      gallery.insertAdjacentHTML('beforeend', modalHtml)
    }
  });
}

// this function reformats the employees phone number.
function reformatPhoneNumber(phone) {
    phone = phone.replace(/[^\d]/g, "");
    if (phone.length == 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    } else {
      return phone
    }
};

// this function reformats the employees birtday.
function reformatBirthday(date){
  let reform = date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
  reform = reform[0].replace(/-/g,'');
  return reform.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$2-$3-$1')
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
