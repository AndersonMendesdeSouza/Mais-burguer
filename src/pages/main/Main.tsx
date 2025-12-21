import React, { useMemo, useState, useEffect, useRef } from "react";
import Colors from "../../themes/Colors";
import styles from "./Main.module.css";
import { FoodCard } from "../../components/food/FoodCard";
import {
  PlusCircle,
  CupSoda,
  IceCream,
  Search,
  ShoppingCart,
  HamburgerIcon,
  Star,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import whatsapp from "../../assets/whatsapp.png";
import { MainSkeleton } from "../../components/skeletons/main/MainSkeleton";
import type { FoodResponseDto } from "../../dtos/Food-Response.Dto";
import { ToastContainer } from "react-toastify";

const productsMock: FoodResponseDto[] = [
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

const categoryIcons: Record<string, any> = {
  Sanduíches: HamburgerIcon,
  Bebidas: CupSoda,
  Adicionais: PlusCircle,
  Sobremesas: IceCream,
};

const handleWatsappClick = () => {
  const phone = "5564999663524";
  const text = "Olá! 👋 Vim pelo site e gostaria de fazer um pedido.";
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
};

export default function Main() {
  const [category, setCategory] = useState<string | null>(null);
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [cartActived, setCartActivedCart] = useState(false);

  function activedCart() {
    setCartActivedCart(true);
    setTimeout(() => {
      setCartActivedCart(false);
    }, 7000);
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    searchRef.current?.blur();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(productsMock.map((p) => p.category))).map(
      (name) => ({
        name,
        icon: categoryIcons[name],
      })
    );
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return productsMock;
    return productsMock.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      const cat = p.category.toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [search]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      (acc[product.category] ||= []).push(product);
      return acc;
    }, {} as Record<string, FoodResponseDto[]>);
  }, [filteredProducts]);

  const goDetails = (item: FoodResponseDto) => {
    navigation(`/foodDetails?id=${item.id}`, { state: { item } });
  };

  return (
    <div
      className={styles.screen}
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
      <div className={styles.page}>
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

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.brand}>
              <img
                className={styles.brandDot}
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
                alt="Logo"
              />
              <span className={styles.brandName}>Mais Burguer</span>
            </div>

            <button
              className={styles.headerCart}
              type="button"
              onClick={() => navigation("/cart")}
            >
              <ShoppingCart size={20} />
            </button>
          </div>

          <div className={styles.searchInputWrap}>
            <Search size={18} />
            <input
              ref={searchRef}
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar itens..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              inputMode="search"
            />
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => {
                setSearch("");
                searchRef.current?.blur();
              }}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className={styles.whatsappFloat} onClick={handleWatsappClick}>
          <img src={whatsapp} alt="WhatsApp" />
        </div>

        {loading ? (
          <div
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
            <MainSkeleton />
          </div>
        ) : (
          <div className={styles.containerSec}>
            <section className={styles.hero}>
              <div className={styles.heroOverlay} />
              <div className={styles.heroCenter}>
                <div className={styles.heroContent}>
                  <div className={styles.heroBadges}>
                    <span className={styles.openBadge}>ABERTO AGORA</span>
                    <span className={styles.ratingBadge}>
                      4.8 <Star size={14} />
                    </span>
                  </div>
                  <div>
                    <h1 className={styles.heroTitle}>O Verdadeiro</h1>
                    <h2 className={styles.heroAccent}>Sabor Artesanal</h2>
                  </div>
                  <p className={styles.heroDesc}>
                    Ingredientes selecionados, carnes nobres e aquele molho
                    especial que você só encontra aqui.
                  </p>
                </div>
              </div>
            </section>

            <div className={styles.categoryRow}>
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={`${styles.categoryPill} ${
                  category === null ? styles.categoryActive : ""
                }`}
              >
                Todos
              </button>

              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategory(item.name)}
                    className={`${styles.categoryPill} ${
                      category === item.name ? styles.categoryActive : ""
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {Object.entries(
              category === null
                ? groupedProducts
                : { [category]: groupedProducts[category] }
            ).map(([cat, items]) => {
              const Icon = categoryIcons[cat];
              return (
                <section key={cat} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionLeft}>
                      <Icon size={20} />
                      <h2 className={styles.sectionTitle}>{cat}</h2>
                    </div>
                    <span className={styles.sectionCount}>
                      <span className={styles.sectionQuant}>{items.length}</span>
                      <span> opções</span>
                    </span>
                  </div>

                  <div
                    className={cat === "Bebidas" ? styles.grid3 : styles.grid4}
                  >
                    {items.map((item) => (
                      <FoodCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        desc={item.desc}
                        price={item.price}
                        img={item.img}
                        badge={item.badge}
                        onDetails={() => goDetails(item)}
                        functions={() => activedCart()}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}