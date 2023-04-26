export default function initiateUI(){

    // Search Input
    const searchForm = document.createElement('form');
    searchForm.classList.add('searchForm');
    const searchLabel = document.createElement('label');
    const searchInp = document.createElement('input');
    searchInp.placeholder = 'Search location';
    searchLabel.append(searchInp);
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Search';
    searchForm.append(searchLabel, submitBtn);

    const content = document.querySelector('.content');
    content.append(searchForm);
}