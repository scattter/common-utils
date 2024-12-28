import type React from 'react';
import { memo } from 'react';
import styles from './index.module.scss';

export interface IProps {
  content: string | React.ReactNode | React.ReactNode[];
}

const InfoCard: React.FC<IProps> = ({ content }) => {
  return <div className={styles.infoCard}>{content}</div>;
};

export default memo(InfoCard);
