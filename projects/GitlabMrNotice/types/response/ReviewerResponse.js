export const review = (data) => {
  return `

@${data.reviewer} 您有新的MR需要处理

标题: ${data.title}
仓库: ${data.repoName}
提交人: ${data.committer}
提交分支: ${data.sourceBranch}
合并分支: ${data.targetBranch}
commit信息: ${data.commitDesc}
mr地址: ${data.link}`
}
