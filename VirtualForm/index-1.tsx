import React, {DetailedHTMLProps, HTMLAttributes, RefObject, useState} from 'react'

export const VirtualForm = () => {
  const height = 800
  const total = 10000
  const contentHeight = 80
  const limit = Math.ceil(height / contentHeight)

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(
    Math.min(startIndex + limit, total - 1)
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [scrollTopM, setScrollTopM] = useState(0)

  const scrollingContainer: RefObject<HTMLDivElement> = React.createRef()

  const renderRow = (index: number, style: Record<string, unknown>) => {
    return (
      <li key={index} style={style}>
        item - {index}
      </li>
    )
  }

  const renderDisplayContent = () => {
    const content = []
    for (let i = startIndex; i <= endIndex; i++) {
      content.push(
        renderRow(i, {
          height: contentHeight - 1 + 'px',
          lineHeight: contentHeight + 'px',
          left: 0,
          right: 0,
          position: 'absolute',
          top: i * contentHeight,
          borderBottom: '1px solid #000',
          width: '100%',
        })
      )
    }

    return content
  }

  const scrollFun = (event: DetailedHTMLProps<any, HTMLDivElement>) => {
    if (event.target === scrollingContainer.current) {
      const { scrollTop } = event.target as HTMLDivElement
      const currIndex = Math.floor(scrollTop / contentHeight)

      setStartIndex(currIndex)
      setEndIndex(Math.min(currIndex + limit, total - 1))
      // don't set state in loops, conditions, or nested functions
      // if (startIndex !== currIndex) {
      //   setStartIndex(currIndex)
      //   setEndIndex(Math.min(currIndex + limit, total - 1))
      //   setScrollTopM(scrollTop)
      // }
    }
  }

  return (
    <div
      ref={scrollingContainer}
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
        height: height,
        backgroundColor: '#e8e8e8',
      }}
      onScroll={scrollFun}
    >
      <div style={{ height: total * contentHeight, position: 'relative' }}>
        {renderDisplayContent()}
      </div>
    </div>
  )
}
