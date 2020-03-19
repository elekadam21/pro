from psycopg2._psycopg import cursor

import persistence
from psycopg2.extras import RealDictCursor


# def get_card_status(status_id):
#     """
#     Find the first status matching the given id
#     :param status_id:
#     :return: str
#     """
#     statuses = persistence.get_statuses()
#     return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')
#
#
# def get_boards():
#     """
#     Gather all boards
#     :return:
#     """
#     return persistence.get_boards(force=True)
#
#
# def get_cards_for_board(board_id):
#     persistence.clear_cache()
#     all_cards = persistence.get_cards()
#     matching_cards = []
#     for card in all_cards:
#         if card['board_id'] == str(board_id):
#             card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
#             matching_cards.append(card)
#     return matching_cards
#
#
# @persistence.connection_handler
# def get_boards(cursor: RealDictCursor) -> list:
#     query = '''
#     SELECT *
#     FROM boards'''
#     cursor.execute(query)
#     return cursor.fetchall()
#
#
# @persistence.connection_handler
# def get_statuses(cursor: RealDictCursor) -> list:
#     query = '''
#     SELECT *
#     FROM statuses'''
#     cursor.execute(query)
#     return cursor.fetchall()
#
#
# @persistence.connection_handler
# def get_cards(cursor: RealDictCursor) -> list:
#     query = '''
#     SELECT *
#     FROM cards'''
#     cursor.execute(query)
#     return cursor.fetchall()


# felső három együtt
@persistence.connection_handler
def get_all_from_table(cursor: RealDictCursor, table) -> list:
    query = '''
    SELECT *
    FROM {}'''.format(table)
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
    INSERT INTO boards (owner)
    VALUES (0)
    """)


@persistence.connection_handler
def get_last_board(cursor: RealDictCursor):
    query = """
    SELECT id, title FROM boards
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


# @persistence.connection_handler
# def create_status(cursor: RealDictCursor, board_id):
#     query = '''
#     INSERT INTO statuses (title, board_id)
#     VALUES ('new', %(board_id)s), ('in progress', %(board_id)s), ('testing', %(board_id)s),
#     ('done', %(board_id)s);'''
#     cursor.execute(query, {"board_id": board_id})


@persistence.connection_handler
def rename_board(cursor: RealDictCursor, title, id):
    query = '''
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(id)s'''
    cursor.execute(query, {"title": title, "id": id})
    return 'done'
