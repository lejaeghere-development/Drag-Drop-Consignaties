import EventEmitter from './event-emitter';
import { Global } from './global';

const searchBox = document.getElementById('search-box');
const suggestionsContainer = document.getElementById('suggestions-container');
export default class SearchBox extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);
  }
  setUp() {
    this.emitter = EventEmitter.getObj();
    Global.emitter.on('search:show', this.showSearch.bind(this));
    Global.emitter.on('search:hide', this.hideSearch.bind(this));
    Global.emitter.on('game:skip', this.hideSearch.bind(this));
    Global.emitter.on('game:show', this.showSearch.bind(this));
    Global.emitter.on('item:repeat_set', this.onItemClicked.bind(this));
    Global.emitter.on('mixed:update_set', this.triggerSearch.bind(this));
  }
  curateDrinks(drinkTypes, searchTerm) {
    return this.jsonDataPartial.filter((item) => {
      const serverBottle = Global.customData.find(
        (item2) => item2.bottle_key === item.bottle_key
      );
      const isDisabled =
        serverBottle && serverBottle.enabled == '0' ? true : false;
      return (
        (item.name.toLowerCase().includes(searchTerm) ||
          item.type.toLowerCase().includes(searchTerm)) &&
        drinkTypes.indexOf(item.type) !== -1 &&
        !isDisabled &&
        (!Global.isToggleOn ||
          (Global.isToggleOn &&
            (parseInt(Global.totalBottles) == 24 ? [24] : [6, 12]).indexOf(
              item.total_bottles
            ) != -1)) /* (Global.isToggleOn && item.total_bottles == 24) */
      );
    });
  }
  init() {
    this.subType = null;
    this.lastSubType = null;
    Global.selectedBottleType = null;
    // Event listener for input changes
    searchBox.addEventListener(
      'input',
      function () {
        const searchTerm = searchBox.value.trim().toLowerCase();
        let drinkTypes = [];
        if (Global.selectedBottleType != null /* drinkType !== 'all' */) {
          drinkTypes = [Global.selectedBottleType];

          // searchBox.focus();
        } else {
          drinkTypes = [
            'water',
            'frisdrank',
            'fruitsap',
            'bieren',
            'melk',
            'wijn',
            'zuivel',
          ];
        }
        let matchingData = this.curateDrinks(drinkTypes, searchTerm);
        if (matchingData.length == 0) {
          drinkTypes = [
            'water',
            'frisdrank',
            'fruitsap',
            'bieren',
            'melk',
            'wijn',
            'zuivel',
          ];
          matchingData = this.curateDrinks(drinkTypes, searchTerm);
        }

        // const matchingData = this.jsonDataPartial.filter(item => item.name.toLowerCase().includes(searchTerm) || item.type.toLowerCase().includes(searchTerm));

        this.displaySuggestions(matchingData);
      }.bind(this)
    );
    searchBox.addEventListener('mousedown', this.triggerSearch.bind(this));

    // Hide suggestions when clicking outside the search container
    document.addEventListener('click', function (event) {
      if (!event.target.closest('#search-container')) {
        suggestionsContainer.style.display = 'none';
      }
    });
    document.querySelectorAll('.sub_categories .sub').forEach((sub) => {
      sub.addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        this.subType = sub.dataset.type;

        document.querySelectorAll(`.sub`).forEach((sub) => {
          sub.classList.remove('active2');
        });
        if (String(this.lastSubType) !== String(this.subType)) {
          sub.classList.add('active2');
        } else {
          this.subType = null;
        }
        this.triggerSearch();

        this.lastSubType = this.subType;
      });
    });
    document.querySelectorAll('.search_bottles .bottle').forEach((bottle) => {
      bottle.addEventListener('click', (v) => {
        let canActivate = false;
        if (!bottle.classList.contains('active')) {
          canActivate = true;
        }
        document
          .querySelectorAll('.search_bottles .bottle')
          .forEach((bottle) => {
            bottle.classList.remove('active');
          });
        if (canActivate) {
          bottle.classList.add('active');
          Global.selectedBottleType = bottle.id.split('_')[1];
        } else {
          Global.selectedBottleType = null;
        }

        v.preventDefault();
        v.stopImmediatePropagation();

        this.subType = null;
        this.lastSubType = null;
        this.triggerSearch();

        let subCategories = document.querySelectorAll(
          `.sub[data-parent-id=${bottle.id}]`
        );
        if (!canActivate) {
          subCategories = [];
        }
        document.querySelectorAll(`.sub`).forEach((sub) => {
          sub.classList.remove('active');
          sub.classList.remove('active2');
        });
        console.log(subCategories, 'subCategories');
        if (subCategories.length == 0) {
          document.querySelector('.sub_categories').classList.remove('active');
          document
            .querySelector('#search-container')
            .classList.remove('shifted');
        } else {
          subCategories.forEach((sub) => {
            sub.classList.add('active');
          });
          document.querySelector('.sub_categories').classList.add('active');
          document.querySelector('#search-container').classList.add('shifted');
        }
      });
    });
  }
  triggerSearch(drinkType = 'all', v) {
    let drinkTypes = [];
    if (Global.selectedBottleType != null /* drinkType !== 'all' */) {
      drinkTypes = [Global.selectedBottleType];

      searchBox.focus();
    } else {
      drinkTypes = [
        'water',
        'frisdrank',
        'fruitsap',
        'bieren',
        'melk',
        'wijn',
        'zuivel',
      ];
    }

    const searchTerm = searchBox.value.trim().toLowerCase();
    const matchingData = this.jsonDataPartial.filter((item) => {
      return (
        (item.name.toLowerCase().includes(searchTerm) ||
          item.type.toLowerCase().includes(searchTerm)) &&
        drinkTypes.indexOf(item.type) !== -1 &&
        (this.subType == null ||
          item.sub_type.toLowerCase() == this.subType ||
          item.sub_type == this.subType ||
          item.sub_type
            .split(',')
            .map((s) => s.trim())
            .indexOf(this.subType) !== -1) &&
        (!Global.isToggleOn ||
          (Global.isToggleOn &&
            (parseInt(Global.totalBottles) == 24 ? [24] : [6, 12]).indexOf(
              item.total_bottles
            ) != -1))
      );
    });
    this.displaySuggestions(matchingData);
  }
  showSearch() {
    // this.jsonDataPartial = Global.jsonData.filter(
    //   (data) =>
    //     data['crate_category'] ===
    //       (Global.crateType == 'custom'
    //         ? Global.totalBottles == 12
    //           ? 6
    //           : parseInt(Global.totalBottles)
    //         : parseInt(Global.totalBottles)) || true
    // );
    this.jsonDataPartial = Global.jsonData.filter((data) => {
      if (Global.crateType === 'custom') {
        // Logic for part A: Specific matching
        const targetCategory =
          Global.totalBottles == 12 ? 6 : parseInt(Global.totalBottles);
        return data['crate_category'] === targetCategory;
      } else {
        // Logic for part B: Pick all
        return true;
      }
    });

    document.querySelector('#search-container').classList.add('active');
    document.querySelector('.search_bottles').classList.add('active');
  }
  hideSearch() {
    document.querySelector('#search-container').classList.remove('active');
    document.querySelector('.search_bottles').classList.remove('active');
    document.querySelector('#mixed_options').classList.remove('active');
    document.querySelectorAll('.search_bottles .bottle').forEach((bottle) => {
      bottle.classList.remove('active');
      Global.selectedBottleType = null;
    });
    document.querySelectorAll('.sub_categories .sub').forEach((sub) => {
      sub.classList.remove('active');
      sub.classList.remove('active2');
    });
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
      suggestions.forEach((item) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = `${item.name.toUpperCase()} - ${item.volume.toUpperCase()} - ${
          item.total_bottles
        }/crate`;
        suggestionElement.dataset.crateCategory = item.crate_category;
        suggestionElement.addEventListener(
          'click',
          this.onItemClicked.bind(this, suggestionElement, item)
        );
        suggestionsContainer.appendChild(suggestionElement);
      });
      Global.customItem = null;
      suggestionsContainer.style.display = 'block';
    } else {
      if (
        document.querySelector('#search-box').value.toUpperCase().trim()
          .length == 0
      )
        return;
      // suggestionsContainer.style.display = 'none';
      const suggestionElement = document.createElement('div');
      suggestionElement.classList.add('suggestion');
      suggestionElement.classList.add('no_select');
      suggestionElement.innerHTML = `
        <div class="new">
          <div class="label">
            <div class="title">Drink doesnt exist</div>
          </div>
          <div id="add_new_drink">ADD</div>
        </div>
      `;
      suggestionElement
        .querySelector('#add_new_drink')
        .addEventListener('click', (v) => {
          // v.preventDefault();
          // v.stopImmediatePropagation();
          // Handle suggestion selection (you can redirect, perform an action, etc.)

          const customItem = {
            bottle_key: `dummy${Global.customBottles.length + 1}`,
            crate_category: 6,
            name: document
              .querySelector('#search-box')
              .value.toUpperCase()
              .trim(),
            total_bottles: 24,
            type: 'water',
            volume: '',
            crateCategory: 24,
          };
          Global.customReq[`dummy${Global.customBottles.length + 1}`] = document
            .querySelector('#search-box')
            .value.toUpperCase()
            .trim();
          const textureManager = this.scene.textures;

          Global.customBottles.push(customItem);
          Global.emitter.emit('bottle:clear_crate_last_item');
          Global.emitter.emit('bottle:add_new', customItem, true, true);

          Global.lastBottleKey = customItem;
          !Global.isToggleOn && Global.emitter.emit('crate:add_crate');
          suggestionsContainer.innerHTML = '';
          searchBox.value = '';
          if (Global.lastCrateCategory != customItem.crateCategory) {
            Global.lastCrateCategory = customItem.crateCategory;
            Global.emitter.emit(
              'crate:select',
              Global.crateType == 'custom'
                ? customItem.crateCategory == 6
                  ? 12
                  : customItem.crateCategory
                : customItem.crateCategory,
              Global.isToggleOn ? 'custom' : 'fixed'
            );
          }
        });
      suggestionsContainer.appendChild(suggestionElement);
    }
  }
  onItemClicked(suggestionElement, item, v) {
    Global.lastSetToRepeat = item;
    Global.suggestionElement = suggestionElement;

    if (v) {
      v.preventDefault();
      v.stopImmediatePropagation();
    }

    Global.emitter.emit('repeat:hide');
    Global.crateClickTO && clearTimeout(Global.crateClickTO);
    // Handle suggestion selection (you can redirect, perform an action, etc.)

    Global.emitter.emit('bottle:clear_crate_last_item');
    Global.emitter.emit('bottle:add_new', item, true, true);
    Global.lastBottleKey = item;
    !Global.isToggleOn && Global.emitter.emit('crate:add_crate');
    suggestionsContainer.innerHTML = '';
    searchBox.value = '';
    if (Global.lastCrateCategory != suggestionElement.dataset.crateCategory) {
      Global.lastCrateCategory = suggestionElement.dataset.crateCategory;

      Global.emitter.emit(
        'crate:select',
        Global.crateType == 'custom'
          ? suggestionElement.dataset.crateCategory == 6
            ? 12
            : suggestionElement.dataset.crateCategory
          : suggestionElement.dataset.crateCategory,
        Global.isToggleOn ? 'custom' : 'fixed'
      );
    }
  }
}
