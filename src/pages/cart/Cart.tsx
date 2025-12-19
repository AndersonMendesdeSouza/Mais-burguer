import React, { useMemo, useState } from "react";
import styles from "./Cart.module.css";
import Colors from "../../themes/Colors";
import { ArrowLeft, Minus, Plus, Trash2, StickyNote, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  note?: string;
  subtitle?: string;
  image: string;
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Monster Burger",
      price: 32,
      qty: 1,
      subtitle: "+ Bacon Extra, + Cheddar Extra",
      note: "Ponto: Ao ponto",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "Batata Rústica c/ Cheddar",
      price: 18,
      qty: 1,
      subtitle: "Porção individual",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      name: "Coca-Cola Lata",
      price: 6,
      qty: 2,
      subtitle: "350ml",
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32f0f0b?auto=format&fit=crop&w=200&q=80",
    },
  ]);
  const navigation = useNavigate();
  const [orderObs, setOrderObs] = useState("");

  const deliveryFee = 5;

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.price * it.qty, 0);
  }, [items]);

  const total = subtotal + (items.length ? deliveryFee : 0);

  const dec = (id: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
        .filter(Boolean)
    );
  };

  const inc = (id: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div
      className={styles.screen}
      style={
        {
          ["--bgPrimary" as any]: Colors.Background.primary,
          ["--bgSecondary" as any]: Colors.Background.secondary,
          ["--highlight" as any]: Colors.Highlight.primary,
          ["--textPrimary" as any]: Colors.Texts.primary,
          ["--textSecondary" as any]: Colors.Texts.secondary,
        } as React.CSSProperties
      }
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.iconBtn} aria-label="Voltar" onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
          </button>

          <h1 className={styles.title}>Seu Pedido</h1>

          <div className={styles.linkBtn} onClick={() => navigation("/")}>
            Continuar comprando
          </div>
        </header>

        <div className={styles.list}>
          {items.map((it) => (
            <div key={it.id} className={styles.card}>
              <div className={styles.thumbWrap}>
                <img className={styles.thumb} src={it.image} alt={it.name} />
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.nameRow}>
                  <div className={styles.nameCol}>
                    <div className={styles.itemName}>{it.name}</div>
                    <div className={styles.itemPrice}>{brl(it.price)}</div>
                  </div>

                  <div className={styles.qtyArea}>
                    <div className={styles.qtyBox}>
                      <button
                        className={styles.qtyBtn}
                        aria-label="Diminuir"
                        onClick={() => dec(it.id)}
                      >
                        <Minus size={16} />
                      </button>

                      <div className={styles.qtyValue}>{it.qty}</div>

                      <button
                        className={`${styles.qtyBtn} ${styles.qtyBtnPlus}`}
                        aria-label="Aumentar"
                        onClick={() => inc(it.id)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      className={styles.trashBtn}
                      aria-label="Remover item"
                      onClick={() => remove(it.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {it.subtitle ? <div className={styles.subLine}>{it.subtitle}</div> : null}
                {it.note ? <div className={styles.noteLine}>{it.note}</div> : null}
              </div>
            </div>
          ))}
        </div>

        <section className={styles.obsSection}>
          <div className={styles.obsHeader}>
            <StickyNote size={18} />
            <span>Observações do pedido</span>
          </div>

          <textarea
            className={styles.textarea}
            value={orderObs}
            onChange={(e) => setOrderObs(e.target.value)}
            placeholder="Ex: Tirar a cebola, maionese à parte, caprichar no molho..."
          />
        </section>

        <section className={styles.summary}>
          <div className={styles.sumRow}>
            <span className={styles.sumLabel}>Subtotal</span>
            <span className={styles.sumValue}>{brl(subtotal)}</span>
          </div>

          <div className={styles.sumRow}>
            <span className={styles.sumLabel}>Taxa de entrega</span>
            <span className={styles.sumValue}>{items.length ? brl(deliveryFee) : brl(0)}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{brl(total)}</span>
          </div>
        </section>

        <div className={styles.bottomSpacer} />
      </div>

      <div className={styles.bottomBar}>
        <button
          className={styles.checkoutBtn}
          type="button"
          onClick={() =>
            navigation("/checkout", {
              state: {
                items,
                orderObs,
                deliveryFee,
                subtotal,
                total,
              },
            })
          }
        >
          <span className={styles.checkoutText}>Finalizar Pedido</span>
          <span className={styles.checkoutRight}>
            <span className={styles.checkoutTotal}>{brl(total)}</span>
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
