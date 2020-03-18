export let drag = {
    initDragAndDrop: function () {
        let cards = document.querySelectorAll('.card');
        console.log(cards);
        let cardSlots = document.querySelectorAll('.board-column-content');
        initCards(cards);
        initCardSlots(cardSlots);
    }
};

function initCards(cards) {
    for (const card of cards) {
        initCard(card);
    }
}

function initCard(card) {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
    card.setAttribute("draggable", "true");
}

function initCardSlots(cardSlots) {
    for (const slot of cardSlots) {
        initSlot(slot);
    }
}

function initSlot(slot) {
    slot.addEventListener('dragenter', DragEnter);
    slot.addEventListener('dragover', DragOver);
    slot.addEventListener('dragleave', DragLeave);
    slot.addEventListener('drop', DragDrop);
}


function dragStart(e) {
    setSlotHighlight();
    this.classList.add('dragged');
    e.dataTransfer.setData("card", e.target.className);
}


function dragEnd() {
    setSlotHighlight(false);
    this.classList.remove('dragged');
}


function DragEnter(e) {
    if (e.dataTransfer.types.includes("card")) {
        this.classList.add("hover");
        e.preventDefault();
    }
}


function DragOver(e) {
    e.preventDefault();
}


function DragLeave(e) {
    this.classList.remove("hover");
}


function DragDrop(e) {
    if (e.dataTransfer.types.includes("card")) {
        let cardElement = document.querySelector('.dragged');
        e.currentTarget.appendChild(cardElement);
        e.preventDefault();
    }
}


function setSlotHighlight(highlight = true) {
    const slots = document.querySelectorAll(".card-slot, .mixed-cards");
    for (const slot of slots) {
        if (highlight) {
            slot.classList.add("active-zone");
        } else {
            slot.classList.remove("active-zone");
            slot.classList.remove("hover");
        }
    }
}