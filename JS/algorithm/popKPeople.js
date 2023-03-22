// 编号为1到100的一百个(count)人围成一圈，以123123的方式进行报数，数到3(k)的人自动退出圈子，剩下的人继续报数，问最后剩下的人编号为几？
// 这个是很多面试会遇到的, 昨天面试结果写的时候没有写好, 这里再记录下

function solution(count, k) {
  if (k < 1) return new Error('param k must more than 0')
  if (k === 1) return count
  const persons = [...new Array(count).keys()].map(key => key + 1)
  let flag = 0
  while (persons.length > 1) {
    // 每轮踢出人数, 在将人踢出局的时候需要用到
    let outNum = 0
    const len = persons.length
    for (let i = 0; i < len; i++) {
      flag++
      if (flag === k) {
        flag = 0
        persons.splice(i - outNum, 1)
        outNum++
      }
    }
  }
  return persons[0]
}

console.log(solution(30, 3))