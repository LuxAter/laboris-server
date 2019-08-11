# Model

* `_id`
* `title`
* `parents`
* `children`
* `priority`
* `dueDate`
* `entryDate`
* `doneDate`
* `status`
* `times`
* `hidden`
* `modifiedDate`
* `tags`

# API Tasks

All non specific API calls can handle additional filters
All report API calls can also map the output, using the `key` query.

## Filters

* `tag` Tasks must contain this tag(`[String]`)
* `parent` Tasks must have this parent task(`[String]`)
* `child` Tasks must have this child task(`[String]`)
* `time` Tasks must have been updated since this time(`Timestamp`)
* `status` Tasks activity must match this(`String`)
* `created` Tasks must have been created since this time(`Timestamp`)
* `due` Tasks must be due before this time(`Timestamp`)

## General

* `GET /api` Retrieve list of active tasks
* `POST /api` Create a new task

* `GET /api/find` Query tasks for matching task

## Reports

* `GET /api/times` Get total time spent on all tasks
* `GET /api/tags` Get list of all tags

* `GET /api/times/:uuid` Get total time spent on task, and subtasks
* `GET /api/tags/:uuid` Get list of all tags

## Tasks 

* `GET /api/:uuid` Get full data for specific task
* `POST /api/:uuid` Modify data for a specific task

## Actions

* `POST /api/stop` Stop all in progress tasks
* `POST /api/start/:uuid` Start specific task
* `POST /api/stop/:uuid` Stop specific task
* `POST /api/deactivate/:uuid` Deactivate/Complete specific task
* `POST /api/activate/:uuid` Activate specific task
