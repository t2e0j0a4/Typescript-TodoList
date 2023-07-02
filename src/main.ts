import './style.css';

interface ListItem {
  id: string;
  name: string;
  checked: boolean;
}

const startApplication = () => {
  const itemInput = <HTMLInputElement>document.querySelector('.inputPlace');
  const itemSubmit = <HTMLButtonElement>document.querySelector('.inputSubmit');
  const listContainer = <HTMLUListElement>(
    document.querySelector('.listContainer')
  );

  let appItemsList: ListItem[] = [];

  const deleteMyItem = (id: string) => {
    appItemsList = appItemsList.filter((item) => item.id !== id);
    saveMyList(appItemsList);
    renderParsedList();
  };

  const doCheckForItem = (id: string) => {
    appItemsList = appItemsList.filter((item) => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    saveMyList(appItemsList);
    renderParsedList();
  };

  const saveMyList = (myList: ListItem[]): void => {
    localStorage.setItem('myList', JSON.stringify(myList));
    renderParsedList();
  };

  const parseStoredList = (): ListItem[] => {
    const storedList: ListItem[] = JSON.parse(localStorage.getItem('myList')!);
    return storedList;
  };

  const renderParsedList = (): void => {
    appItemsList = parseStoredList();
    listContainer.innerHTML = '';
    if (appItemsList.length === 0) {
      listContainer.innerHTML = '<li class="emptyList">Empty List...</li>';
    }
    appItemsList.forEach((listItem: ListItem) => {
      const item = <HTMLLIElement>document.createElement('li');
      item.className = 'listItem';

      const itemBtn = <HTMLButtonElement>document.createElement('button');
      itemBtn.type = 'button';
      const btnIcon = <HTMLBodyElement>document.createElement('ion-icon');
      btnIcon.setAttribute('name', 'trash');
      itemBtn.append(btnIcon);
      itemBtn.addEventListener('click', () => {
        deleteMyItem(listItem.id);
      });

      const itemCheck = <HTMLInputElement>document.createElement('input');
      itemCheck.type = 'checkbox';
      itemCheck.name = 'listCheck';
      itemCheck.id = listItem.id;
      itemCheck.checked = listItem.checked;

      itemCheck.addEventListener('click', () => {
        doCheckForItem(listItem.id);
      });

      const itemLabel = <HTMLLabelElement>document.createElement('label');
      itemLabel.htmlFor = listItem.id;
      itemLabel.innerHTML = listItem.name;

      if (itemCheck.checked) {
        itemLabel.classList.add('itemChecked');
      } else {
        itemLabel.classList.remove('itemChecked');
      }

      item.append(itemBtn, itemCheck, itemLabel);
      listContainer.append(item);
    });
  };

  const addNewItem = (item: ListItem): void => {
    appItemsList = [...appItemsList, item];
    saveMyList(appItemsList);
  };

  const handleInputSubmit = () => {
    if (!itemInput.value) return;

    let itemId: string =
      appItemsList.length !== 0
        ? (parseInt(appItemsList[appItemsList.length - 1].id) + 1).toString()
        : '1';

    const newItem: ListItem = {
      name: itemInput.value.trim(),
      checked: false,
      id: itemId,
    };

    addNewItem(newItem);
    itemInput.value = '';
  };

  itemSubmit.addEventListener('click', handleInputSubmit);
  itemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  });

  window.addEventListener('load', () => {
    if (JSON.parse(localStorage.getItem('myList')!).length === 0) {
      saveMyList([]);
      listContainer.innerHTML = '<li class="emptyList">Empty List...</li>';
    } else {
      renderParsedList();
    }
  });
};

document.addEventListener('DOMContentLoaded', startApplication);
