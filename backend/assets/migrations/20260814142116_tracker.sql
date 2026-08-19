-- +goose Up
CREATE TABLE entries(
    id          INTEGER PRIMARY KEY,
    title       TEXT    NOT     NULL,
    link        TEXT    NOT     NULL,
    status      TEXT    NOT     NULL DEFAULT 'solved',
    diff        TEXT    NOT     NULL DEFAULT 'unknown',
    sub         TEXT    NOT     NULL DEFAULT 'unknown',
    revisit     BOOLEAN NOT     NULL DEFAULT  0,
    deleted     BOOLEAN NOT     NULL DEFAULT  0,
    solved_time TEXT                 DEFAULT '',
    note        TEXT                 DEFAULT '');

-- +goose Down
DROP TABLE entries;
