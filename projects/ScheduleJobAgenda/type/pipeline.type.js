class BaseMrInfo {
  constructor(id, projectId, title, assignee, url) {
    this.id = id
    this.projectId = projectId
    this.title = title
    this.assignee = assignee
    this.url = url
  }
}

const convertToBaseInfo = (data) => {
  if (!data) {
    throw new Error(`please check data: ${data} is valid?`)
  }
  const { id, project_id, title, assignee, url } = data
  return new BaseMrInfo(id, project_id, title, assignee, url)
}

module.exports = {
  convertToBaseInfo
}