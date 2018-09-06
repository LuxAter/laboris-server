var mongoose = require('mongoose');
var uuidv1 = require('uuid/v1');

var projectSchema = mongoose.Schema({
  uuid: String,
  title: String,
  color: String,
  tasks: [String]
});

module.exports.schema = projectSchema;
var Project = module.exports = mongoose.model('Project', projectSchema);

module.exports.createProject = (title, color, callback) => {
  var project = new Project({
    uuid: uuidv1(),
    title: title,
    color: color,
    tasks: []
  });
  callback(project);
}

module.exports.serializeProject = (project, callback) => {
  callback({
    uuid: project.uuid,
    title: project.title,
    color: project.color,
    tasks: project.tasks
  });
}

module.exports.deserialiseProject = (body, callback) => {
  var project = new Project({
    uuid: 'uuid' in body ? body['uuid'] : uuidv1(),
    title: 'title' in body ? body['title'] : '',
    color: 'color' in body ? body['color'] : '#FFFFFF',
    tasks: 'tasks' in body ? body['tasks'] : []
  });
  callback(project)
}

module.exports.serializeProjects = (projects, callback) => {
  callback(projects.map((project) => {
    return {
      uuid: project.uuid,
      title: project.title,
      color: project.color,
      tasks: project.tasks
    }
  }));
}
