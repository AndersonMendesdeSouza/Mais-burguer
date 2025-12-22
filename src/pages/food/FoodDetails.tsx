import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FoodDetails.module.css";
import {
  Share2,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { addCart, FoodCard } from "../../components/food/FoodCard";
import type { FoodResponseDto } from "../../dtos/Food-Response.Dto";
import { toast, ToastContainer } from "react-toastify";
import Colors from "../../themes/Colors";

type Addon = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FoodDetails() {
  const navigation = useNavigate();
  const location = useLocation();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [cartActived, setCartActivedCart] = useState(false);
  const [products, setProducts] = useState<FoodResponseDto | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {}
  );
  const [complements, setComplements] = useState<FoodResponseDto[]>([]);

  useEffect(() => {
    const state = (location.state || {}) as {
      item?: FoodResponseDto;
      productsMock?: FoodResponseDto[];
    };

    if (state.item) {
      setProducts(state.item);
      setComplements(
        Array.isArray(state.productsMock) ? state.productsMock : []
      );
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
    }
  }, [location.state]);

  const addons: Addon[] = [
    {
      id: "bacon",
      name: "Bacon Extra",
      desc: "Fatia extra crocante",
      price: 4,
    },
    {
      id: "cheddar",
      name: "Queijo Cheddar",
      desc: "Extra cremosidade",
      price: 3,
    },
    {
      id: "maionese",
      name: "Maionese Verde",
      desc: "Maionese da casa",
      price: 2,
    },
    { id: "ovo", name: "Ovo Frito", desc: "Gema mole", price: 2.6 },
  ];

  const goDetails = (item: FoodResponseDto) => {
    navigation(`/foodDetails?id=${item.id}`, {
      state: {
        item,
        productsMock: complements,
      },
    });
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedAddonList = useMemo(() => {
    return addons
      .filter((a) => selectedAddons[a.id])
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));
  }, [selectedAddons]);

  const addonsTotal = useMemo(() => {
    return selectedAddonList.reduce((acc, a) => acc + a.price, 0);
  }, [selectedAddonList]);

  const total = useMemo(() => {
    const base = products?.price ?? 0;
    return (base + addonsTotal) * qty;
  }, [products?.price, addonsTotal, qty]);

  const cartItem = useMemo(() => {
    if (!products) return null;

    const basePrice = products.price ?? 0;
    const unitPrice = basePrice + addonsTotal;

    return {
      ...products,
      id: products.id,
      price: unitPrice,
      qty,
      note: note.trim() || undefined,
      addons: selectedAddonList,
      unitPrice,
      totalPrice: unitPrice * qty,
      subtitle: selectedAddonList.length
        ? selectedAddonList.map((a) => `+ ${a.name}`).join(", ")
        : undefined,
    };
  }, [products, qty, note, selectedAddonList, addonsTotal]);

  if (!products) return null;

  function activedCart() {
    setCartActivedCart(true);
    setTimeout(() => {
      setCartActivedCart(false);
    }, 7000);
  }

  return (
    <div
      className={styles.page}
      style={
        {
          "--bg-primary": Colors.Background.primary,
          "--bg-secondary": Colors.Background.secondary,
          "--text-primary": Colors.Texts.primary,
          "--text-secondary": Colors.Texts.secondary,
          "--highlight": Colors.Highlight.primary,
        } as React.CSSProperties
      }
    >
      <ToastContainer position="top-center" />

      {cartActived && (
        <div className={styles.cartFloat}>
          <button
            className={styles.headerCartActived}
            type="button"
            onClick={() => navigation("/cart")}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      )}

      <div className={styles.top}>
        <div className={styles.media}>
          <img
            className={styles.mediaImg}
            src={products.img}
            alt={products.name}
          />

          <button
            type="button"
            className={styles.backBtn}
            aria-label="Voltar"
            onClick={() => navigation(-1)}
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            className={styles.shareBtn}
            aria-label="Compartilhar"
          >
            <Share2 size={18} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>{products.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{BRL(products.price)}</span>
              {products.badge ? (
                <span className={styles.badge}>{products.badge}</span>
              ) : null}
            </div>

            <p className={styles.desc}>{products.desc}</p>
          </div>

          {products.category === "Sanduíches" && (
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
                      className={`${styles.addonRow} ${
                        active ? styles.addonActive : ""
                      }`}
                      onClick={() => toggleAddon(a.id)}
                    >
                      <span className={styles.toggle}>
                        <span
                          className={`${styles.toggleKnob} ${
                            active ? styles.toggleOn : ""
                          }`}
                        >
                          {active ? <Check size={14} /> : null}
                        </span>
                      </span>

                      <span className={styles.addonInfo}>
                        <span className={styles.addonName}>{a.name}</span>
                        <span className={styles.addonDesc}>{a.desc}</span>
                      </span>

                      <span className={styles.addonPrice}>
                        + {BRL(a.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
              type="button"
              aria-label="Diminuir quantidade"
            >
              <Minus size={16} />
            </button>

            <div className={styles.stepValue}>{qty}</div>

            <button
              className={styles.stepBtn}
              onClick={() => setQty((v) => v + 1)}
              type="button"
              aria-label="Aumentar quantidade"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className={styles.buttonsWrapper}>
            <button
              className={styles.addBtn}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!cartItem) return;

                addCart(cartItem);

                toast.success("Produto adicionado ao carrinho", {
                  autoClose: 2000,
                });
                activedCart();
              }}
            >
              <span>Adicionar</span>
              <span className={styles.addBtnPrice}>{BRL(total)}</span>
            </button>

            <button
              className={styles.finilyBtn}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!cartItem) return;

                addCart(cartItem);
                navigation("/cart");
              }}
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
                id={c.id}
                img={c.img}
                name={c.name}
                desc={c.desc}
                price={c.price}
                onDetails={() => goDetails(c)}
                functions={() => activedCart()}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
