import React, { useEffect, useMemo, useState } from "react";
import styles from "./Cart.module.css";
import Colors from "../../themes/Colors";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  StickyNote,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { STORE_HOURS } from "../../utils/storeHours";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  note?: string;
  subtitle?: string;
  image: string;
};

function makeMergeKey(p: any) {
  const id = Number(p?.id);
  if (Number.isFinite(id) && id > 0) return `id:${id}`;
  const name = String(p?.name ?? "").trim().toLowerCase();
  return `name:${name || "unknown"}`;
}

type StoreHours = { open: number; close: number };

function isOpenNowByHour(h: number, hours: StoreHours) {
  const open = Number(hours.open);
  const close = Number(hours.close);
  if (open === close) return true;
  if (open < close) return h >= open && h < close;
  return h >= open || h < close;
}

function hoursUntilOpen(hours: StoreHours) {
  const now = new Date();
  const h = now.getHours();

  if (isOpenNowByHour(h, hours)) return 0;

  const openHour = Number(hours.open);
  const open = new Date(now);
  open.setHours(openHour, 0, 0, 0);

  if (open.getTime() <= now.getTime()) {
    open.setDate(open.getDate() + 1);
  }

  const diff = open.getTime() - now.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigation = useNavigate();
  const [orderObs, setOrderObs] = useState("");
  const deliveryFee = 5;

  const storeHours = useMemo<StoreHours>(() => {
    const open = Number((STORE_HOURS as any)?.open);
    const close = Number((STORE_HOURS as any)?.close);
    if (Number.isFinite(open) && Number.isFinite(close)) return { open, close };
    return { open: 18, close: 2 };
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("food");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : [parsed];

      const mergedMap: Record<string, CartItem> = {};

      for (const p of arr) {
        if (!p) continue;

        const key = makeMergeKey(p);
        const idNum = Number(p?.id);
        const safeId = Number.isFinite(idNum) && idNum > 0 ? idNum : 0;

        const qty = Number(p?.qty ?? 1);
        const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;

        const name = String(p?.name ?? "Item");
        const price = Number(p?.price ?? 0);
        const image = String(p?.image ?? p?.img ?? "");

        if (!mergedMap[key]) {
          mergedMap[key] = {
            id: safeId,
            name,
            price,
            qty: safeQty,
            note: p.note ? String(p.note) : undefined,
            subtitle: p.subtitle ? String(p.subtitle) : undefined,
            image,
          };
        } else {
          mergedMap[key].qty += safeQty;

          if (!mergedMap[key].image && image) mergedMap[key].image = image;
          if (!mergedMap[key].subtitle && p.subtitle)
            mergedMap[key].subtitle = String(p.subtitle);
          if (!mergedMap[key].note && p.note)
            mergedMap[key].note = String(p.note);
        }
      }

      const merged = Object.values(mergedMap);

      setItems(merged);
      localStorage.setItem("food", JSON.stringify(merged));
    } catch (e) {
      console.error("Erro lendo localStorage product:", e);
    }
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.price * it.qty, 0);
  }, [items]);

  const total = subtotal + (items.length ? deliveryFee : 0);

  const persist = (next: CartItem[]) => {
    setItems(next);
    if (!next.length) localStorage.removeItem("food");
    else localStorage.setItem("food", JSON.stringify(next));
  };

  const getKeyFromItem = (it: CartItem) => {
    const id = Number(it.id);
    if (Number.isFinite(id) && id > 0) return `id:${id}`;
    return `name:${String(it.name ?? "").trim().toLowerCase()}`;
  };

  const dec = (target: CartItem) => {
    const key = getKeyFromItem(target);
    persist(
      items.map((it) =>
        getKeyFromItem(it) === key
          ? { ...it, qty: Math.max(1, it.qty - 1) }
          : it
      )
    );
  };

  const inc = (target: CartItem) => {
    const key = getKeyFromItem(target);
    persist(
      items.map((it) =>
        getKeyFromItem(it) === key ? { ...it, qty: it.qty + 1 } : it
      )
    );
  };

  const remove = (target: CartItem) => {
    const key = getKeyFromItem(target);
    persist(items.filter((it) => getKeyFromItem(it) !== key));
  };

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const openNow = useMemo(() => {
    return isOpenNowByHour(new Date().getHours(), storeHours);
  }, [storeHours]);

  return (
    <div className={styles.wrap}>
      <ToastContainer position="top-center" />
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
            <button
              className={styles.iconBtn}
              aria-label="Voltar"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} color={Colors.Texts.primary} />
            </button>

            <h1 className={styles.title}>Seu Pedido</h1>

            {items.length > 0 && (
              <div className={styles.linkBtn} onClick={() => navigation("/")}>
                Continuar comprando
              </div>
            )}
          </header>

          <div className={styles.list}>
            {items.length > 0 ? (
              items.map((it) => (
                <div key={getKeyFromItem(it)} className={styles.card}>
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
                          <button className={styles.qtyBtn} onClick={() => dec(it)}>
                            <Minus size={16} />
                          </button>

                          <div className={styles.qtyValue}>{it.qty}</div>

                          <button
                            className={`${styles.qtyBtn} ${styles.qtyBtnPlus}`}
                            onClick={() => inc(it)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button className={styles.trashBtn} onClick={() => remove(it)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {it.subtitle && <div className={styles.subLine}>{it.subtitle}</div>}
                    {it.note && <div className={styles.noteLine}>{it.note}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <h3>Você ainda não possui pedidos</h3>
                <button className={styles.emptyButton} onClick={() => navigation("/")}>
                  Fazer pedido
                </button>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <section className={styles.obsSection}>
              <div className={styles.obsHeader}>
                <StickyNote size={18} />
                <span>Observações do pedido</span>
              </div>

              <textarea
                className={styles.textarea}
                value={orderObs}
                onChange={(e) => setOrderObs(e.target.value)}
              />
            </section>
          )}

          <section className={styles.summary}>
            <div className={styles.sumRow}>
              <span>Subtotal</span>
              <span>{brl(subtotal)}</span>
            </div>

            <div className={styles.sumRow}>
              <span>Taxa de entrega</span>
              <span>{items.length ? brl(deliveryFee) : brl(0)}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{brl(total)}</span>
            </div>
          </section>
        </div>

        <div className={styles.bottomBar}>
          <button
            className={styles.checkoutBtn}
            disabled={items.length === 0}
            onClick={() => {
              if (!openNow) {
                const left = hoursUntilOpen(storeHours);
                toast.error(
                  `Fechado, abrimos em ${left} ${left === 1 ? "hora" : "horas"}`,
                  { autoClose: 2500 }
                );
                return;
              }

              navigation("/checkout", {
                state: { items, orderObs, deliveryFee, subtotal, total },
              });
            }}
          >
            <span>Finalizar Pedido</span>
            <span>
              {brl(total)} <ArrowRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
