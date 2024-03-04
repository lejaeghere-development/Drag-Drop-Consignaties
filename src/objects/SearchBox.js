import EventEmitter from './event-emitter';
import {
    Global
} from './global';

const jsonData = require('../../bottle-data/bottles.json');


const searchBox = document.getElementById('search-box');
const suggestionsContainer = document.getElementById('suggestions-container');
export default class SearchBox extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game)
    }
    setUp() {
        this.emitter = EventEmitter.getObj();
        this.emitter.on('search:show', this.showSearch.bind(this));
        this.emitter.on('search:hide', this.hideSearch.bind(this));
        this.emitter.on('game:skip', this.hideSearch.bind(this));
        this.emitter.on('game:show', this.showSearch.bind(this));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });
    }
    init() {

        // Event listener for input changes
        searchBox.addEventListener('input', function () {
            const searchTerm = searchBox.value.trim().toLowerCase();
            const matchingData = this.jsonDataPartial.filter(item => item.name.toLowerCase().includes(searchTerm) || item.type.toLowerCase().includes(searchTerm));

            this.displaySuggestions(matchingData);
        }.bind(this));
        searchBox.addEventListener('mousedown', function () {
            const searchTerm = searchBox.value.trim().toLowerCase();
            const matchingData = this.jsonDataPartial.filter(item => item.name.toLowerCase().includes(searchTerm) || item.type.toLowerCase().includes(searchTerm));

            this.displaySuggestions(matchingData);
        }.bind(this));


        // Hide suggestions when clicking outside the search container
        document.addEventListener('click', function (event) {
            if (!event.target.closest('#search-container')) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }
    showSearch() {
        this.jsonDataPartial = jsonData.filter(((data) => data['crate_category'] === Global.totalBottles));
        document.querySelector("#search-container").classList.add("active");
    }
    hideSearch() {
        document.querySelector("#search-container").classList.remove("active");
    }
    displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';

        suggestions.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
        });

        if (suggestions.length > 0) {
            suggestions.forEach(item => {
                const suggestionElement = document.createElement('div');
                suggestionElement.classList.add('suggestion');
                suggestionElement.textContent = `${item.name.toUpperCase()} - ${item.volume.toUpperCase()} - ${item.total_bottles}/crate`;
                suggestionElement.addEventListener('click', () => {
                    // Handle suggestion selection (you can redirect, perform an action, etc.)
                    this.emitter.emit('bottle:add_new', item);
                    suggestionsContainer.innerHTML = '';
                    searchBox.value = '';
                });
                suggestionsContainer.appendChild(suggestionElement);
            });

            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }
}