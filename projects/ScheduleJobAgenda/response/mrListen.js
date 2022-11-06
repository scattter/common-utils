const convertToCommonReview = (data) => {
  return '------ NOTICE -------' + `

@${data.assignee?.username ?? '- -'} 您有新的MR需要处理

标题: ${data.title}
仓库: ${data.address || '未指定'}
提交人: ${data.author?.username ?? '未指定'}
mr地址: ${data.url}`
}

module.exports = {
  convertToCommonReview
}
