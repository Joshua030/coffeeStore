import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";
import cls from 'classnames';

const card = ({ name, imgUrl, href,onAction }) => {

  const handleClick = () => {
    onAction();
  };

  return (
    <Link href={href} className={`"glass" ${styles.cardLink}`} onClick={handleClick}>
      <div className={cls("glass",styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            src={imgUrl}
            width={260}
            height={160}
            className={styles.cardImage}
            alt={name}
          />
        </div>
      </div>
    </Link>
  );
};

export default card;
