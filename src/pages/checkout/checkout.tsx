import React, { useMemo, useState } from "react";
import styles from "./checkout.module.css";
import Colors from "../../themes/Colors";
import { ArrowLeft, ShoppingCart, MapPin, User, Wallet, Check, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  note?: string;
  subtitle?: string;
  image: string;
};

type CheckoutNavState = {
  items: CartItem[];
  orderObs?: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
};

type PaymentType = "PIX" | "CARD" | "CASH";

export default function Checkout() {
  const nav = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as Partial<CheckoutNavState>;

  const items = state.items || [];
  const deliveryFee = typeof state.deliveryFee === "number" ? state.deliveryFee : 0;
  const subtotal = typeof state.subtotal === "number" ? state.subtotal : 0;
  const total = typeof state.total === "number" ? state.total : subtotal + (items.length ? deliveryFee : 0);
  const orderObs = state.orderObs || "";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("123");
  const [district, setDistrict] = useState("");
  const [complement, setComplement] = useState("");
  const [payment, setPayment] = useState<PaymentType>("PIX");
  const [cashChange, setCashChange] = useState("");

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const waLink = useMemo(() => {
    const phoneDest = "5564999663524";
    const lines: string[] = [];

    lines.push("🧾 *Pedido - Finalizar*");
    lines.push("");
    lines.push("*Resumo*");
    items.forEach((it) => {
      const itemTotal = it.price * it.qty;
      lines.push(`• ${it.qty}x ${it.name} — ${brl(itemTotal)}`);
      if (it.subtitle) lines.push(`  ${it.subtitle}`);
      if (it.note) lines.push(`  ${it.note}`);
    });

    lines.push("");
    lines.push(`Subtotal: ${brl(subtotal)}`);
    lines.push(`Entrega: ${brl(items.length ? deliveryFee : 0)}`);
    lines.push(`*Total: ${brl(total)}*`);

    if (orderObs.trim()) {
      lines.push("");
      lines.push(`Obs: ${orderObs.trim()}`);
    }

    lines.push("");
    lines.push("*Seus Dados*");
    lines.push(`Nome: ${fullName || "-"}`);
    lines.push(`WhatsApp: ${phone || "-"}`);

    lines.push("");
    lines.push("*Entrega*");
    lines.push(`Rua: ${street || "-"}, Nº: ${number || "-"}`);
    lines.push(`Bairro: ${district || "-"}`);
    if (complement.trim()) lines.push(`Compl.: ${complement.trim()}`);

    lines.push("");
    lines.push("*Pagamento*");
    lines.push(
      payment === "PIX"
        ? "Pix"
        : payment === "CARD"
        ? "Cartão (crédito/débito)"
        : `Dinheiro${cashChange.trim() ? ` (troco para: ${cashChange.trim()})` : ""}`
    );

    const text = lines.join("\n");
    return `https://wa.me/${phoneDest}?text=${encodeURIComponent(text)}`;
  }, [
    items,
    subtotal,
    deliveryFee,
    total,
    orderObs,
    fullName,
    phone,
    street,
    number,
    district,
    complement,
    payment,
    cashChange,
  ]);

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
          <button className={styles.iconBtn} aria-label="Voltar" onClick={() => nav(-1)}>
            <ArrowLeft size={20} />
          </button>

          <div className={styles.headerTitle}>
            <div className={styles.headerTop}>Finalizar Pedido</div>
            <div className={styles.headerSub}>PASSO 3 DE 3</div>
          </div>

          <button className={styles.headerCart} type="button" onClick={() => nav("/cart")}>
            <ShoppingCart size={18} />
          </button>
        </header>

        <div className={styles.stepBar}>
          <div className={styles.stepLine} />
          <div className={`${styles.stepDot} ${styles.stepDotOn}`} />
          <div className={`${styles.stepDot} ${styles.stepDotOn}`} />
          <div className={`${styles.stepDot} ${styles.stepDotOn}`} />
        </div>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <ShoppingCart size={16} />
            <span>Resumo</span>
          </div>

          <div className={styles.summaryList}>
            {items.map((it) => (
              <div key={it.id} className={styles.summaryItem}>
                <div className={styles.summaryThumbWrap}>
                  <img className={styles.summaryThumb} src={it.image} alt={it.name} />
                </div>

                <div className={styles.summaryInfo}>
                  <div className={styles.summaryName}>{it.name}</div>
                  <div className={styles.summaryMeta}>
                    {it.subtitle ? <span>{it.subtitle}</span> : <span />}
                    <span className={styles.summaryQty}>x{it.qty}</span>
                  </div>
                  <div className={styles.summaryPrice}>{brl(it.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <User size={16} />
            <span>Seus Dados</span>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>Nome Completo</span>
              <input
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Como devemos te chamar?"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Telefone / WhatsApp</span>
              <input
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                inputMode="tel"
              />
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <MapPin size={16} />
            <span>Entrega</span>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.label}>Rua</span>
                <input
                  className={styles.input}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Nome da rua"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Número</span>
                <input
                  className={styles.input}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  inputMode="numeric"
                />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Bairro</span>
              <input
                className={styles.input}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Seu bairro"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Complemento (Opcional)</span>
              <input
                className={styles.input}
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto, Bloco, Ponto de referência..."
              />
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <Wallet size={16} />
            <span>Pagamento</span>
          </div>

          <div className={styles.payList}>
            <button
              type="button"
              className={`${styles.payItem} ${payment === "PIX" ? styles.payItemActive : ""}`}
              onClick={() => setPayment("PIX")}
            >
              <div className={styles.payLeft}>
                <div className={styles.payIcon}>
                  <Check size={16} />
                </div>
                <div className={styles.payTexts}>
                  <div className={styles.payName}>Pix</div>
                  <div className={styles.payDesc}>Pagamento instantâneo</div>
                </div>
              </div>
              <div className={`${styles.radio} ${payment === "PIX" ? styles.radioOn : ""}`} />
            </button>

            <button
              type="button"
              className={`${styles.payItem} ${payment === "CARD" ? styles.payItemActive : ""}`}
              onClick={() => setPayment("CARD")}
            >
              <div className={styles.payLeft}>
                <div className={styles.payIcon}>
                  <Check size={16} />
                </div>
                <div className={styles.payTexts}>
                  <div className={styles.payName}>Cartão</div>
                  <div className={styles.payDesc}>Crédito ou Débito na entrega</div>
                </div>
              </div>
              <div className={`${styles.radio} ${payment === "CARD" ? styles.radioOn : ""}`} />
            </button>

            <button
              type="button"
              className={`${styles.payItem} ${payment === "CASH" ? styles.payItemActive : ""}`}
              onClick={() => setPayment("CASH")}
            >
              <div className={styles.payLeft}>
                <div className={styles.payIcon}>
                  <Check size={16} />
                </div>
                <div className={styles.payTexts}>
                  <div className={styles.payName}>Dinheiro</div>
                  <div className={styles.payDesc}>Precisa de troco?</div>
                </div>
              </div>
              <div className={`${styles.radio} ${payment === "CASH" ? styles.radioOn : ""}`} />
            </button>

            {payment === "CASH" ? (
              <div className={styles.cashBox}>
                <label className={styles.field}>
                  <span className={styles.label}>Troco para</span>
                  <input
                    className={styles.input}
                    value={cashChange}
                    onChange={(e) => setCashChange(e.target.value)}
                    placeholder="Ex: 50,00"
                    inputMode="decimal"
                  />
                </label>
              </div>
            ) : null}
          </div>
        </section>

        <div className={styles.bottomSpacer} />
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total do pedido</span>
          <span className={styles.totalValue}>{brl(total)}</span>
        </div>

        <button
          className={styles.sendBtn}
          type="button"
          onClick={() => window.open(waLink, "_blank", "noopener,noreferrer")}
        >
          <span className={styles.sendLeft}>
            <Send size={18} />
            <span>Enviar pedido no WhatsApp</span>
          </span>
        </button>
      </div>
    </div>
  );
}
