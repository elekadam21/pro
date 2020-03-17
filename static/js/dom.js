// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            const outerHtml = `
            <section class="board" data-id="${board.id}">
                <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </div>
            <div class="board-columns"  data-id="${board.id}"></div>
            </section>
        `;

            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        }
    },
    loadStatuses: function () {
        dataHandler.getStatuses(function (statuses) {
            dom.showStatuses(statuses);
        });
    },
    showStatuses: function (statuses) {
        for (let status of statuses) {
             console.log(status);
             const outerHtml = `
            <div class="board-column">
                <div class="board-column-title">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}">
                </div>
            </div>
             `;
             let statusContainerBoard = document.querySelector("[data-id=" + CSS.escape(status.board_id) + "]");
             console.log(statusContainerBoard);
             statusContainerBoard.insertAdjacentHTML("beforeend", outerHtml);
         }
    },
    loadCards: function () {
        dataHandler.getCardsByStatusId(function (cards) {
            dom.showCards(cards)
        })
    },
    showCards: function (cards) {
        for (let card of cards) {
            console.log(card);
            const outerHtml = `
            <div class="card-title">${card.title}</div>`;
            let cardContainer = document.querySelector("[data-status-id=" + CSS.escape(card.status_id) + "]");
            console.log(cardContainer);
            cardContainer.insertAdjacentHTML("beforeend", outerHtml);
        }
    },
    // here comes more features
};
