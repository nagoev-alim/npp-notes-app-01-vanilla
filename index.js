// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { marked } from 'marked';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='notes'>
    <h2 class='title'>Notes</h2>
    <button class='notes__add' data-add=''>
      ${feather.icons.plus.toSvg()}
    </button>
    <div class='notes__list' data-list=''></div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      btnAdd: document.querySelector('[data-add]'),
      notes: document.querySelector('[data-list]'),
    };

    this.storageDisplay();
    this.DOM.btnAdd.addEventListener('click', () => this.onAdd());
  }

  /**
   * @function onAdd - Add new note
   * @param text
   */
  onAdd = (text = '') => {
    const div = document.createElement('div');
    div.classList.add('notes__item');
    div.innerHTML = `
      <div class='notes__tools'>
       <button data-edit=''>${feather.icons.edit.toSvg()}</button>
       <button data-delete=''>${feather.icons.trash.toSvg()}</button>
      </div>
      <div class='content ${text ? '' : 'hidden'}'></div>
      <textarea class='${text ? 'hidden' : ''}'></textarea>
    `;

    const btnEdit = div.querySelector('[data-edit]');
    const btnDelete = div.querySelector('[data-delete]');
    const content = div.querySelector('.content');
    const textarea = div.querySelector('textarea');

    textarea.value = text;
    content.innerHTML = marked(text);
    textarea.focus();

    btnDelete.addEventListener('click', () => {
      if (window.confirm('Are you sure?')) {
        div.remove();
        this.storageAdd();
      }
    });

    btnEdit.addEventListener('click', () => {
      content.classList.toggle('hidden');
      textarea.classList.toggle('hidden');
    });

    textarea.addEventListener('input', ({ target: { value } }) => {
      this.storageAdd();
      content.innerHTML = marked(value);
    });

    this.DOM.notes.appendChild(div);
  };

  /**
   * @function storageAdd - Add data to local storage
   */
  storageAdd = () => {
    const notesText = document.querySelectorAll('textarea');
    const notes = [];
    notesText.forEach(({ value }) => notes.push(value));
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  /**
   * @function storageGet - Get data from local storage
   * @returns {any|*[]}
   */
  storageGet = () => {
    return localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
  };

  /**
   * @function storageDisplay - Get and display data from local storage
   */
  storageDisplay = () => {
    const notes = this.storageGet();
    notes.forEach(note => this.onAdd(note));
  };
}

// ⚡️Class instance
new App();
