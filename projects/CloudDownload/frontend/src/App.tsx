import styles from './App.module.scss';
import InitDownload from './components/InitDownload';

const App = () => {
  return (
    <div>
      <div className={styles.contentTitle}>
        <h1>云盘下载</h1>
      </div>
      <div className={styles.contentWrapper}>
        <InitDownload />
      </div>
    </div>
  );
};

export default App;
