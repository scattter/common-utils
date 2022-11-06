class BaseMrInfo {
  constructor(id, projectId, title, assignee, url, author) {
    this.id = id
    this.projectId = projectId
    this.title = title
    this.assignee = assignee
    this.url = url
    this.author = author
  }
}

const convertToBaseInfo = (data) => {
  if (!data) {
    throw new Error(`please check data: ${data} is valid?`)
  }
  const { id, project_id, title, assignee, web_url: url, author } = data
  return new BaseMrInfo(id, project_id, title, assignee, url, author)
}

module.exports = {
  convertToBaseInfo
}