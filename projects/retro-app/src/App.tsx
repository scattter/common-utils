import styles from './App.module.scss'
import {COLUMNS} from "./consts";
import {useCallback, useEffect, useState} from "react";
import {COLUMNS_ENUM} from "./enums";
import {socket} from "./socket";

const initColumns = COLUMNS.reduce((res: Record<COLUMNS_ENUM, { id:string, value: string, focused: boolean }[]> | Record<string, never>, pre) => {
  res[pre] = [
    {
      id: `${pre}-1`,
      value: '',
      focused: false,
    }
  ]
  return res
}, {})

function App() {
  // const [count, setCount] = useState(0)

  const [elements, setElements] = useState<typeof initColumns>(initColumns)
  const [room, setRoom] = useState<string | undefined>(undefined)

  const handleAddInput = useCallback((column: COLUMNS_ENUM) => {
    const preState = { ...elements }
    preState[column] = [
      ...preState[column],
      {
        id: `${column}-${Number(preState[column].slice(-1)[0].id.split('-')[1]) + 1}`,
        value: '',
        focused: false
      }
    ]
    setElements(preState)
    socket.emit('update', preState)
  }, [elements])

  const handleChangeInput = useCallback((column: COLUMNS_ENUM, id: string, value: string) => {
    const preState = { ...elements }
    preState[column].forEach(info => {
      if (info.id === id) {
        info.value = value
      }
    })
    setElements(preState)
    socket.emit('update', preState)
  }, [elements])

  const handleReceiver = useCallback((remoteElements?: typeof initColumns) => {
    if (remoteElements && Object.values(remoteElements).length === COLUMNS.length) {
      setElements(remoteElements)
    } else if (!remoteElements) {
      socket.emit('update', initColumns)
    }
  }, [])

  const handleFocusInput = useCallback((column: COLUMNS_ENUM, id: string, focused: boolean) => {
    const preState = { ...elements }
    preState[column].forEach(info => {
      if (info.id === id) {
        info.focused = focused
      }
    })
    setElements(preState)
    socket.emit('update', preState)
  }, [elements])


  useEffect(() => {
    const pathnames = window.location.pathname?.split('/')
    if (pathnames?.length > 1) {
      const pathRoom = pathnames?.slice(-1)[0]
      document.title = `Retro-${pathRoom}`
      setRoom(pathRoom)
      socket.connect()
      socket.emit('room', pathRoom)
      socket.on('receiver', handleReceiver)
    }
  },[handleReceiver])

  return (
    <>
      <h1>retro面板</h1>
      <div className={styles.header}>当前项目: {room}</div>
      <div className={styles.wrapper}>
        {COLUMNS.map(column => {
          return (
            <div className={styles.column} key={column}>
              <div className={styles.title}>{column}</div>
              {elements[column].map(inputInfo => {
                return <label key={inputInfo.id}>
                  <textarea
                     rows={5}
                     id={inputInfo.id}
                     value={inputInfo.value}
                     onChange={(e) => handleChangeInput(column, inputInfo.id, e.target.value)}
                     onFocus={() => handleFocusInput(column, inputInfo.id, true)}
                     onBlur={() => handleFocusInput(column, inputInfo.id, false)}
                  />
                  {inputInfo.focused && <span className={styles.inputTip}>输入中...</span>}
                </label>
              })}
              <button onClick={() => handleAddInput(column)}>+</button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App
