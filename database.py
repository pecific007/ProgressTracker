from plibsqlite import Database, table, C
from helper import Difficulty, Tags, Status

TABLE_CREATED = False

class Entry(table):
    id = table.Int(pk=True)
    title = table.Text(null=False)
    link = table.Text(null=False)
    solved_at = table.Text()  # time of solution can be null for unsolved
    status = table.Text(null=False)
    tag = table.Text(null=False, default="unknown")
    difficulty = table.Text(null=False)
    revisit = table.Bool(null=False, default=False)
    note = table.Text()
    deleted = table.Bool(null=False, default=False)


def manage_db(func):
    def wrapper(*args, **kwargs):
        db = Database("tracker.db", check_same_thread=False)
        table.use(db)
        global TABLE_CREATED
        if not TABLE_CREATED:
            Entry.create()
            TABLE_CREATED = True
        try:
            return func(*args, **kwargs)
        finally:
            db.close()

    return wrapper


@manage_db
def add_entry(
    title: str,
    link: str,
    solved_at: str,
    tag: Tags,
    difficulty: Difficulty,
    revisit: bool,
    status: Status = Status.Solved,
    note: str = "",
):
    Entry.query().insert(
        title=title,
        link=link,
        solved_at=solved_at,
        status=status.value,
        tag=tag.value,
        difficulty=difficulty.value,
        revisit=revisit,
        note=note,
    ).exec()


@manage_db
def edit_entry(id, **kwargs):
    row = Entry.query().select("*").where(C("id", "=", id)).exec().fetchall()
    if row is not None:
        Entry.query().update(**kwargs).where(C("id", "=", id)).exec()


@manage_db
def sort_delete_entry(id):
    row = Entry.query().select("*").where(C("id", "=", id)).exec().fetchall()
    if row is not None:
        Entry.query().update(deleted=True).where(C("id", "=", id)).exec()


@manage_db
def select_entries():
    query = Entry.query().select("*").order_by({"id":"DESC"}).exec()
    columns = [column[0] for column in query.description]
    entries = [dict(zip(columns, row)) for row in query.fetchall()]
    return entries
