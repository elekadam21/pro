import {dom} from "./dom.js"


function init() {
    dom.init();
    dom.loadBoards();
    dom.createAddBoardButton();
    dom.addBoard();
}

init();
