create table tasks (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  parents UUID [] NOT NULL,
  children UUID [] NOT NULL,
  tags VARCHAR [] NOT NULL,
  priority SMALLINT NOT NULL,
  entry_date TIMESTAMP NOT NULL,
  due_date TIMESTAMP,
  done_date TIMESTAMP,
  modifed_date TIMESTAMP NOT NULL,
  times JSON NOT NULL,
  hidden BOOLEAN NOT NULL,
  status VARCHAR(10) NOT NULL
);
