// src/components/food/FoodCard.tsx
import styles from "./FoodCard.module.css";

type FoodCardProps = {
  name?: string;
  desc?: string;
  price?: number;
  img?: string;
  badge?: string;
  onDetails?: () => void;
};

function formatMoney(value?: number) {
  if (value === undefined) return "";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function FoodCard({ name, desc, price, img, badge, onDetails }: FoodCardProps) {
  const priceMin = price !== undefined ? price + 7 : undefined;

  return (
    <article className={styles.card}>
      {!!badge && <div className={styles.badge}>{badge}</div>}

      <div className={styles.imgWrap}>
        <img src={img} alt={name} className={styles.img} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.desc}>{desc}</p>

        <div className={styles.bottom}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className={styles.minPrice}>{formatMoney(priceMin)}</span>
            <span className={styles.price}>{formatMoney(price)}</span>
          </div>

          <button type="button" className={styles.button} onClick={onDetails}>
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}
