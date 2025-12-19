import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Productdetails.module.css";
import { Share2, Minus, Plus, Check } from "lucide-react";
import { FoodCard } from "../../components/food/FoodCard";
import type { ProductResponseDto } from "../../dtos/Product-Response.Dto";
import { sendOrderToWhatsApp } from "../../utils/sendOrderToWhatsApp";

type Addon = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductDetails() {
  const navigation = useNavigate();
  const location = useLocation();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [products, setProducts] = useState<ProductResponseDto | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const item = (location.state as { item?: ProductResponseDto } | null)?.item;

    if (item) {
      setProducts(item);

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
    }
  }, [location.state]);

  const addons: Addon[] = [
    { id: "bacon", name: "Bacon Extra", desc: "Fatia extra crocante", price: 4 },
    { id: "cheddar", name: "Queijo Cheddar", desc: "Extra cremosidade", price: 3 },
    { id: "maionese", name: "Maionese Verde", desc: "Maionese da casa", price: 2 },
    { id: "ovo", name: "Ovo Frito", desc: "Gema mole", price: 2.6 },
  ];

  const complements: ProductResponseDto[] = [
    {
      id: 1,
      name: "Monster Bacon",
      desc: "Hambúrguer artesanal 160g, cheddar, bacon crocante e molho especial.",
      price: 32,
      badge: "MAIS PEDIDO",
      img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      category: "Sanduíches",
    },
    {
      id: 2,
      name: "Classic Salad",
      desc: "Pão brioche, blend 160g, alface, tomate e maionese.",
      price: 28,
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      category: "Sanduíches",
    },
    {
      id: 3,
      name: "Monster Bacon",
      desc: "Hambúrguer artesanal 160g, cheddar, bacon crocante e molho especial.",
      price: 32,
      badge: "MAIS PEDIDO",
      img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      category: "Sanduíches",
    },
    {
      id: 4,
      name: "Classic Salad",
      desc: "Pão brioche, blend 160g, alface, tomate e maionese.",
      price: 28,
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      category: "Sanduíches",
    },
    {
      id: 7,
      name: "Coca-Cola Lata",
      price: 6,
      desc: "Refrigerante 350ml",
      img: "https://blog.somostera.com/hubfs/Blog_free_images/Uma%20lata%20de%20coca%20cola%20em%20cima%20da%20mesa.jpg",
      category: "Bebidas",
    },
    {
      id: 8,
      name: "Coca-Cola 2L",
      price: 6,
      desc: "Garrafa 2L",
      img: "https://felicitapizzaria.chefware.com.br/67/0/0/coca-cola-2-litros.jpg",
      category: "Bebidas",
    },
    {
      id: 9,
      name: "Suco de Laranja",
      price: 8,
      desc: "Natural",
      img: "https://www.sabornamesa.com.br/media/k2/items/cache/b018fd5ec8f1b90a1c8015900c2c2630_XL.jpg",
      category: "Bebidas",
    },
    {
      id: 10,
      name: "Batata Frita",
      price: 12,
      desc: "Porção",
      img: "https://swiftbr.vteximg.com.br/arquivos/ids/201377-768-768/622291-batata-airfryer-extra-croc-mccain_3.jpg?v=638657204471230000",
      category: "Adicionais",
    },
  ];

  const goDetails = (item: ProductResponseDto) => {
    navigation(`/productDetails?id=${item.id}`, { state: { item } });
  };

  const addonsTotal = useMemo(
    () =>
      addons.reduce((acc, a) => acc + (selectedAddons[a.id] ? a.price : 0), 0),
    [selectedAddons]
  );

  const total = ((products?.price ?? 0) + addonsTotal) * qty;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!products) return null;

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.media}>
          <img className={styles.mediaImg} src={products.img} alt={products.name} />
        </div>

        <div className={styles.content}>
          <button className={styles.shareBtn} aria-label="Compartilhar">
            <Share2 size={18} />
          </button>

          <div className={styles.header}>
            <h1 className={styles.title}>{products.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{BRL(products.price)}</span>
              <span className={styles.badge}>{products.badge}</span>
            </div>

            <p className={styles.desc}>{products.desc}</p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Adicionais</h2>
              <span className={styles.sectionChip}>Opcional</span>
            </div>

            <div className={styles.addons}>
              {addons.map((a) => {
                const active = !!selectedAddons[a.id];
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={`${styles.addonRow} ${active ? styles.addonActive : ""}`}
                    onClick={() => toggleAddon(a.id)}
                  >
                    <span className={styles.toggle}>
                      <span className={`${styles.toggleKnob} ${active ? styles.toggleOn : ""}`}>
                        {active ? <Check size={14} /> : null}
                      </span>
                    </span>

                    <span className={styles.addonInfo}>
                      <span className={styles.addonName}>{a.name}</span>
                      <span className={styles.addonDesc}>{a.desc}</span>
                    </span>

                    <span className={styles.addonPrice}>+ {BRL(a.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Alguma observação?</h2>
            <textarea
              className={styles.note}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Tirar cebola, maionese à parte..."
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.stepperWrapper}>
          <div className={styles.stepper}>
            <button
              className={styles.stepBtn}
              onClick={() => setQty((v) => Math.max(1, v - 1))}
            >
              <Minus size={16} />
            </button>

            <div className={styles.stepValue}>{qty}</div>

            <button className={styles.stepBtn} onClick={() => setQty((v) => v + 1)}>
              <Plus size={16} />
            </button>
          </div>

          <div className={styles.buttonsWrapper}>
            <button className={styles.addBtn} type="button">
              <span>Adicionar</span>
              <span className={styles.addBtnPrice}>{BRL(total)}</span>
            </button>

            <button
              className={styles.finilyBtn}
              type="button"
              onClick={() =>
                sendOrderToWhatsApp([
                  {
                    name: products.name,
                    quantity: qty,
                    price: products.price + addonsTotal,
                  },
                ])
              }
            >
              <span>Pedir</span>
              <span className={styles.addBtnPrice}>{BRL(total)}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.complementsSection}>
        <h2 className={styles.sectionTitle}>Complementos</h2>

        <div className={styles.complements}>
          {complements.map((c) => (
            <div key={c.id} className={styles.compItem}>
              <FoodCard
                img={c.img}
                name={c.name}
                desc={c.desc}
                price={c.price}
                onDetails={() => goDetails(c)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
