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
                <div class="board-header" id="board${board.id}"><span class="board-title" id="${board.id}">${board.title}</span>
                    <button class="board-add" data-board-id="${board.id}">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </div>
            <div class="board-columns"  data-id="${board.id}"></div>
            </section>
        `;
            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
            document.querySelector("[data-board-id=" + CSS.escape(board.id) + "]").addEventListener('click', dom.createCard);
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
        for (let status of statuses) {
            const outerHtml = `
            <div class="board-column">
                <div class="board-column-title">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}">
                </div>
            </div>
             `;
            let statusContainerBoard = document.querySelector("[data-id=" + CSS.escape(status.board_id) + "]");
            statusContainerBoard.insertAdjacentHTML("beforeend", outerHtml);
        }
        callback();
    },
    loadCards: function () {
        dataHandler.getCardsByStatusId(function (cards) {
            dom.showCards(cards)
        })
    },
    showCards: function (cards) {
        let statuses = document.querySelectorAll('.board-column-content');
        for (let status of statuses) {
            status.innerHTML = "";
        }
        for (let card of cards) {
            const outerHtml = `
            <div class="card">${card.title}</div>`;
            let cardContainer = document.querySelector("[data-status-id=" + CSS.escape(card.status_id) + "]");
            cardContainer.insertAdjacentHTML("beforeend", outerHtml);
        }
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
            dataHandler.getBoards(function (boards) {
                // let boardId = boards.slice(-1)[0]['id'] + 1;
                // let title = boards.slice(-1)[0]['title'].slice(0, -1) + boardId;
                //
                // let data = {'title': title, 'id': boardId};
                let data = 'start';
                dataHandler._api_post('http://127.0.0.1:5000/create-new-board', data, (response) => {
                    console.log(response);
                    let outerHtml = `
                        <section class="board">
                            <div class="board-header" id="board${response[0].id}"><span class="board-title" id="${response[0].id}">${response[0].title}</span>
                                <button class="board-add">Add Card</button>
                                <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                            </div>
                        <div class="board-columns"  data-id="${response[0]['id']}"></div>
                        </section>
                    `;
                    let boardsContainer = document.querySelector('.board-container');
                    boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
                    dom.renameBoard(response[0].id, response[0].title);
                })
            })
        });
    },
    createCard: function () {
        let board_id = this.dataset.boardId;
        let status_id = document.querySelector("[data-id=" + CSS.escape(board_id) + "]").querySelector('.board-column-content').dataset.statusId;
        dataHandler.createNewCard(board_id, status_id, function (cards) {
            dom.showCards(cards)
        })
    },
    renameBoard: function (id, title) {
        let boardTitle = document.getElementById(`${id}`);

        boardTitle.addEventListener('click', () => {

            let boardDiv = document.getElementById(`board${id}`);

            boardDiv.removeChild(boardTitle);

            boardTitle = `<input class="board-title" id="${id}" value="${title}">`;

            boardDiv.insertAdjacentHTML("afterbegin", boardTitle);

            let inputField = document.getElementById(`${id}`);

            inputField.addEventListener('focusout', () => {

                let title = document.getElementById(`${id}`).value;

                let data = {"title": title, "id": id};

                dataHandler._api_post('http://127.0.0.1:5000/rename', data, () => {

                    let boardTitle = document.getElementById(`${id}`);

                    let newTitle = `<span class="board-title" id="${id}">${title}</span>`;

                    boardDiv.removeChild(boardTitle);

                    boardDiv.insertAdjacentHTML("afterbegin", newTitle);

                    dom.renameBoard(id, title);

                });
            })
        })
    }
};
