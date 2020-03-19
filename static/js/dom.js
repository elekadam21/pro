// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards, dom.loadStatuses);
        });
    },
    showBoards: function (boards, callback) {

        for (let board of boards) {
            const outerHtml = `
            <section class="board">
                <div class="board-header" id="board${board.id}"><span class="board-title" id="title${board.id}">${board.title}</span>
                    <button class="board-add" data-column-id="${board.id}">Add column</button>
                    <button class="board-add" data-board-id="${board.id}">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </div>
            <div class="board-columns"  data-id="${board.id}"></div>
            </section>
        `;
            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
            document.querySelector("[data-board-id=" + CSS.escape(board.id) + "]").addEventListener('click', dom.createCard);
            document.querySelector("[data-column-id=" + CSS.escape(board.id) + "]").addEventListener('click', dom.addColumn);
            dom.renameBoard(board.id, board.title);
        }
        callback();
    },
    loadStatuses: function () {
        dataHandler.getStatuses(function (statuses) {
            dom.showStatuses(statuses, dom.loadCards);
        });
    },
    showStatuses: function (statuses, callback) {
        let boards = document.querySelectorAll('.board-columns');
        for (let board of boards) {
            board.innerHTML = "";
        }
        for (let status of statuses) {
            const outerHtml = `
            <div class="board-column">
                <div class="board-column-title" id="status${status.id}">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}">
                </div>
            </div>
             `;
            let statusContainerBoard = document.querySelector("[data-id=" + CSS.escape(status.board_id) + "]");
            statusContainerBoard.insertAdjacentHTML("beforeend", outerHtml);
            dom.renameStatus(status.id, status.title);
        }
        callback();
    },
    loadCards: function () {
        dataHandler.getCardsByStatusId(function (cards) {
            dom.showCards(cards, dom.deleteCard)
        })
    },
    showCards: function (cards, callback) {
        let statuses = document.querySelectorAll('.board-column-content');
        for (let status of statuses) {
            status.innerHTML = "";
        }
        for (let card of cards) {
            const outerHtml = `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>`;
            let cardContainer = document.querySelector("[data-status-id=" + CSS.escape(card.status_id) + "]");
            cardContainer.insertAdjacentHTML("beforeend", outerHtml);
        }
        callback();
    },
    createAddBoardButton: function () {
        let boardsContainer = document.querySelector('.board-container');
        const addButton = `
                        <section class="add-board">
                            <div id="add-board">
                                <button type="button" id="myBtn">Add new board</button>        
                            </div>
                        </section>`;
        boardsContainer.insertAdjacentHTML('beforebegin', addButton)

    },
    addBoard: function () {
        let addButton = document.querySelector('#myBtn');
        addButton.addEventListener('click', function () {
                let data = 'start';
                dataHandler._api_post('http://127.0.0.1:5000/create-new-board', data, (response) => {
                    let outerHtml = `
                        <section class="board">
                            <div class="board-header" id="board${response[0].id}"><span class="board-title" id="title${response[0].id}">${response[0].title}</span>
                                <button class="board-add" data-board-id="${response[0].id}">Add Card</button>
                                <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                            </div>
                        <div class="board-columns"  data-id="${response[0].id}"></div>
                        </section>
                    `;
                    let boardsContainer = document.querySelector('.board-container');
                    boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
                    dom.loadStatuses();
                    dom.renameBoard(response[0].id, response[0].title);
                    document.querySelector("[data-board-id=" + CSS.escape(response[0].id) + "]").addEventListener('click', dom.createCard);
                })
        });
    },
    createCard: function () {
        let board_id = this.dataset.boardId;
        let status_id = document.querySelector("[data-id=" + CSS.escape(board_id) + "]").querySelector('.board-column-content').dataset.statusId;
        dataHandler.createNewCard(board_id, status_id, function (cards) {
            dom.loadCards();
        })
    },
    renameBoard: function (id, title) {
        let boardTitle = document.getElementById(`title${id}`);
        boardTitle.addEventListener('click', () => {
            let boardDiv = document.getElementById(`board${id}`);
            console.log(boardTitle);
            console.log(boardDiv);
            boardDiv.removeChild(boardTitle);
            boardTitle = `<input class="board-title" id="title${id}" value="${title}">`;
            boardDiv.insertAdjacentHTML("afterbegin", boardTitle);
            let inputField = document.getElementById(`title${id}`);
            inputField.addEventListener('focusout', () => {
                let title = document.getElementById(`title${id}`).value;
                let data = {"title": title, "id": id};
                dataHandler._api_post('http://127.0.0.1:5000/rename', data, () => {
                    let boardTitle = document.getElementById(`title${id}`);
                    let newTitle = `<span class="board-title" id="title${id}">${title}</span>`;
                    boardDiv.removeChild(boardTitle);
                    boardDiv.insertAdjacentHTML("afterbegin", newTitle);
                    dom.renameBoard(id, title);

                });
            })
        })
    },
    renameStatus: function (statusId, statusTitleOriginal) {
        let statusTitle = document.getElementById(`status${statusId}`);
        statusTitle.addEventListener('click', () => {
            statusTitle.outerHTML = `<input class="board-column-title" id="status${statusId}" value="${statusTitleOriginal}">`;
            let inputField = document.getElementById(`status${statusId}`);
            inputField.addEventListener('focusout', () => {
                let title = inputField.value;
                let data = {"title": title, "id": statusId};
                dataHandler._api_post('http://127.0.0.1:5000/rename-status', data, () => {
                    let statusTitle = document.getElementById(`status${statusId}`);
                    statusTitle.outerHTML = `<div class="board-column-title" id="status${statusId}">${title}</div>`;
                    dom.renameStatus(statusId, title);

                });
            })
        })
    },
    deleteCard: function () {
        let deleteButtons = document.querySelectorAll(".card-remove");
        for (let deleteButton of deleteButtons) {
            deleteButton.addEventListener('click', function () {
                let cardId = deleteButton.parentNode.id;
                dataHandler.deleteCardDataHandler(cardId, dom.loadCards)
            });
        }
    },
    addColumn: function () {
        let board_id = this.dataset.columnId;
        dataHandler.createColumn(board_id, function (status) {
            const outerHtml = `
            <div class="board-column">
                <div class="board-column-title">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}">
                </div>
            </div>
             `;
            let colContainer = document.querySelector('[data-id=' + CSS.escape(board_id) + ']');
            colContainer.insertAdjacentHTML("beforeend", outerHtml);
        })
    }
};
