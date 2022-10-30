class TodoItem {
    constructor(params = {
        title: '',
        status: false,
        id: 0
    }) {
        this.id = params.id || 0;
        this.title = params.title || '';
        this.status = params.status || false;
    }

    changeStatus(status) {
        this.status = status;
    }

    #render() {
        return `
            <label class="todo-item__checkbox">
                <input type="checkbox" ${this.status ? 'checked' : ''}>
                <span class="todo-item__title">${this.title}</span>
            </label>
            <button class="btn btn_red todo-item__delete" data-id="${this.id}"><i class="fas fa-trash"></i></button>
        `
    }

    #bind() {
        const checkbox = this.element.querySelector('input')

        checkbox.addEventListener('click', () => {
            this.changeStatus(checkbox.checked)
        })
    }

    get element() {
        if (this._element)
            return this._element

        this._element = document.createElement('div')
        this._element.className = 'todo-item'
        this._element.innerHTML = this.#render()
        this.#bind()
        return this._element
    }
}

class TodoList {
    #id = null
    #container = null
    #list = null

    constructor(id = '', list = '.todo__list') {
        this.items = []
        this.#id = id
        this.#container = document.getElementById(id)
        this.#list = this.#container.querySelector(list)

        this.#init()
    }

    get getAll() {
        return this.items
    }

    deleteItemById(id) {
        if(typeof id === 'number') {
            this.items.forEach((element, index) => {
                if(element.id === id)
                    this.items.splice(index, 1);
            });
        } else {
            console.error(`wrong type of id variable. id type is ${typeof id}, not number`)
        }
    }

    addNewItem(title) {
        if (title && typeof title === 'string') {
            const todoItem = new TodoItem({title: title, id: this.items.length})
            this.items.push(todoItem)
            this.#insertListItemToHtml(todoItem.element)
        } else {
            console.error('title is empty')
        }
    }

    #insertListItemToHtml(element) {
        this.#list.prepend(element)

        element.addEventListener('click', (e) => {
            const id = e.target.dataset.id
            if (id) {
                this.deleteItemById(parseInt(id))
                e.target.parentElement.remove();
            }
        })
    }

    loadFromLocalStorage() {
        const localList = JSON.parse(localStorage.getItem(this.id))

        if (localList && localList.length > 0) {
            for (const item of localList) {
                const todoItem = new TodoItem(item)
                this.items.push(todoItem)
                this.#insertListItemHtml(todoItem.element)
            }
        }
    }

    saveToLocalStorage() {
        localStorage.setItem(this.id, JSON.stringify(this.getAll))
    }

    #addEventListeners() {
        const input = this.#container.querySelector('input[type="text"]');

        this.#container.querySelector('button').addEventListener('click', () => {
            const value = input.value

            if (value.length > 0) {
                this.addNewItem(value)
            }

            input.value = ''
        })

        input.addEventListener('keydown', (e) => {
            if (e.keyCode === 13 && input.value.length > 0) {
                this.addNewItem(input.value)
                input.value = ''
            }
        })

        window.addEventListener("unload", () => {
            this.saveToLocalStorage()
        })
    }

    #init() {
        this.#addEventListeners();
        this.loadFromLocalStorage()
    }
}

const todo = new TodoList('todo')
