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
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            const outerHtml = `
            <section class="board">
                <div class="board-header" id="board${board.id}"><span class="board-title" id="${board.id}">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </div>
            <div class="board-columns"  data-id="${board.id}"></div>
            </section>
        `;

            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
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
        for (let card of cards) {
            const outerHtml = `
            <div class="card">${card.title}</div>`;
            let cardContainer = document.querySelector("[data-status-id=" + CSS.escape(card.status_id) + "]");
            cardContainer.insertAdjacentHTML("beforeend", outerHtml);
        }
    },
    renameBoard: function (id, title) {
        let boardTitle = document.getElementById(`${id}`);

        boardTitle.addEventListener('click', () => {

            let boardDiv = document.getElementById(`board${id}`);

            boardDiv.removeChild(boardTitle);

            boardTitle = `<input class="board-title" id="${id}" value="${title}">
                          <button id="rename" type="submit" value="Submit">Submit</button>`;

            boardDiv.insertAdjacentHTML("afterbegin", boardTitle);

            document.getElementById('rename').addEventListener('click', () => {

                let title = document.getElementById(`${id}`).value;

                let data = [title, id];

                dataHandler._api_post('/rename', data, (response) => {
                    console.log(response);
                });

            document.getElementById(`${id}`).addEventListener('mouseout', () => {
                console.log('out');
            })

            })
        })
    }
};
