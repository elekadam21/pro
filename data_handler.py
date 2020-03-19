import persistence
from psycopg2.extras import RealDictCursor


@persistence.connection_handler
def get_all_from_table(cursor: RealDictCursor, table) -> list:
    query = '''
    SELECT *
    FROM {}
    ORDER BY id'''.format(table)
    cursor.execute(query)
    return cursor.fetchall()


@persistence.connection_handler
def get_cards_by_status_id(cursor: RealDictCursor, status_id) -> list:
    query = '''
    SELECT *
    FROM cards
    WHERE status_id = {}'''.format(status_id)
    cursor.execute(query)
    return cursor.fetchall()


@persistence.connection_handler
def create_new_board(cursor):
    cursor.execute("""
    INSERT INTO boards (open)
    VALUES ('true')
    """)


@persistence.connection_handler
def get_last_board(cursor: RealDictCursor):
    query = """
    SELECT id, title, open FROM boards
    ORDER BY id DESC
    LIMIT 1
    """
    cursor.execute(query)
    return cursor.fetchall()


@persistence.connection_handler
def create_card(cursor: RealDictCursor, board_id, status_id):
    query = '''
    INSERT INTO cards (board_id, status_id)
    VALUES (%(board_id)s, %(status_id)s)'''
    cursor.execute(query, {"board_id": board_id, "status_id": status_id})


@persistence.connection_handler
def delete_card(cursor: RealDictCursor, card_id):
    query = '''
    DELETE FROM cards
    WHERE id = {}'''.format(card_id)
    cursor.execute(query)
    return 'done'


@persistence.connection_handler
def create_status(cursor: RealDictCursor, board_id):
    query = '''
    INSERT INTO statuses (title, board_id)
    VALUES ('new', %(board_id)s), ('in progress', %(board_id)s), ('testing', %(board_id)s),
    ('done', %(board_id)s);'''
    cursor.execute(query, {"board_id": board_id})


@persistence.connection_handler
def rename_board(cursor: RealDictCursor, title, id):
    query = '''
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(id)s'''
    cursor.execute(query, {"title": title, "id": id})
    return 'done'


@persistence.connection_handler
def update_status(cursor: RealDictCursor, new_id, old_id):
    query = '''
    UPDATE cards
    SET status_id = %(new_id)s
    WHERE id = %(old_id)s'''
    cursor.execute(query, {"new_id": new_id, "old_id": old_id})
    return 'done'


@persistence.connection_handler
def rename_status(cursor: RealDictCursor, title, id):
    query = '''
    UPDATE statuses
    SET title = %(title)s
    WHERE id = %(id)s'''
    cursor.execute(query, {"title": title, "id": id})
    return 'done'


@persistence.connection_handler
def rename_card(cursor: RealDictCursor, title, id):
    query = '''
    UPDATE cards
    SET title = %(title)s
    WHERE id = %(id)s'''
    cursor.execute(query, {"title": title, "id": id})
    return 'done'


@persistence.connection_handler
def add_status(cursor: RealDictCursor, board_id):
    query = '''
    INSERT INTO statuses (board_id)
    VALUES (%(board_id)s)'''
    cursor.execute(query, {"board_id": board_id})


@persistence.connection_handler
def get_last_status(cursor: RealDictCursor) -> list:
    query = '''
    SELECT * 
    FROM statuses 
    WHERE id=(
    SELECT max(id) FROM statuses
    )'''
    cursor.execute(query)
    return cursor.fetchall()


@persistence.connection_handler
def delete_board(cursor: RealDictCursor, board_id):
    query = '''
    DELETE FROM boards
    WHERE id = {}'''.format(board_id)
    cursor.execute(query)
    return 'done'


@persistence.connection_handler
def change_board_open_close(cursor: RealDictCursor, boolean, id_num):
    print(boolean, id_num)
    query = '''
    UPDATE boards
    SET open = %(boolean)s
    WHERE id = %(id_num)s'''
    cursor.execute(query, {"boolean": boolean, "id_num": id_num})
    return 'done'
