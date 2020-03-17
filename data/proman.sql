ALTER TABLE IF EXISTS ONLY cards DROP CONSTRAINT IF EXISTS fk_card_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY cards DROP CONSTRAINT IF EXISTS fk_card_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY statuses DROP CONSTRAINT IF EXISTS fk_status_board_id CASCADE;

DROP TABLE IF EXISTS boards;
CREATE TABLE boards (
    id serial NOT NULL PRIMARY KEY,
    title text DEFAULT 'Undefined',
    owner integer
);

DROP TABLE IF EXISTS statuses;
CREATE TABLE statuses (
    id serial NOT NULL PRIMARY KEY,
    title text DEFAULT 'Undefined',
    board_id integer NOT NULL
);

DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    id serial NOT NULL PRIMARY KEY,
    board_id integer NOT NULL,
    title text DEFAULT 'Undefined',
    status_id integer NOT NULL,
    "order" integer NOT NULL
);

ALTER TABLE cards
    ADD CONSTRAINT fk_card_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE cards
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE statuses
    ADD CONSTRAINT fk_status_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

INSERT INTO boards VALUES (1, 'Board 1'), (2, 'Board 2');
INSERT INTO statuses VALUES (0, 'new', 1), (1, 'new', 2), (2, 'in progress', 1), (3, 'in progress', 2), (4, 'testing', 1), (5, 'testing', 2), (6, 'done', 1), (7, 'done', 2);
INSERT INTO cards VALUES (1, 1, 'new cad 1', 0, 0),
                         (2, 1, 'new card 2', 0, 1),
                         (3, 1, 'in progress card', 1, 0),
                         (4, 1, 'planning', 2, 0),
                         (5, 1, 'done card 1', 3, 0),
                         (6, 1, 'done card 2', 3, 1),
                         (7, 2, 'new card 1', 4, 0),
                         (8, 2, 'new card 2', 4, 1),
                         (9, 2, 'in progress card', 5, 0),
                         (10, 2, 'planning', 6, 0),
                         (11, 2, 'done card 1', 7, 0),
                         (12, 2, 'done card 2', 7, 1);