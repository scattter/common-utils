export class CommonInfo {
  constructor(title, repoName, committer, reviewer = ' -', link) {
    this.title = title
    this.repoName = repoName
    this.committer = committer
    this.reviewer = reviewer
    this.link = link
  }
}

export class NoticeReview extends CommonInfo {
  constructor(title, repoName, committer, reviewer, link, sourceBranch, targetBranch, commitDesc = '无') {
    super(title, repoName, committer, reviewer, link);
    this.sourceBranch = sourceBranch
    this.targetBranch = targetBranch
    this.commitDesc = commitDesc
  }
}

export const responseType = {
  REVIEW: 'review',
  FEEDBACK: 'feedback',
  CUSTOM: 'custom'
}
