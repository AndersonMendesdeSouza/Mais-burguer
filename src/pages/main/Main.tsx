import React, { useMemo, useState } from "react";
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
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  desc?: string;
  price: number;
  img: string;
  badge?: string;
  category: string;
};

const productsMock: Product[] = [
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
    desc: "Hambúrguer artesanal 160g, cheddar, bacon crocante e molho especial.",
    img: "https://blog.somostera.com/hubfs/Blog_free_images/Uma%20lata%20de%20coca%20cola%20em%20cima%20da%20mesa.jpg",
    category: "Bebidas",
  },
  {
    id: 8,
    name: "Coca-Cola 2L",
    price: 6,
    desc: "Hambúrguer artesanal 160g, cheddar, bacon crocante e molho especial.",
    img: "https://felicitapizzaria.chefware.com.br/67/0/0/coca-cola-2-litros.jpg",
    category: "Bebidas",
  },
  {
    id: 9,
    name: "Suco de Laranja",
    price: 8,
    desc: "Hambúrguer artesanal 160g, cheddar, bacon crocante e molho especial.",
    img: "https://www.sabornamesa.com.br/media/k2/items/cache/b018fd5ec8f1b90a1c8015900c2c2630_XL.jpg",
    category: "Bebidas",
  },
  {
    id: 10,
    name: "Batata Frita",
    price: 12,
    desc: "Hambúrguer artesanal 160g, cheddar, bacon crocante e molho especial.",
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

export function Main() {
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(productsMock.map((p) => p.category))).map(
      (name) => ({
        name,
        icon: categoryIcons[name],
      })
    );
  }, []);

  const groupedProducts = useMemo(() => {
    return productsMock.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, []);

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

            <div className={styles.headerRight}>
              <button className={styles.searchBtn}>
                <Search size={18} />
                <span>Buscar</span>
              </button>

              <button className={styles.cartBtn}>
                <ShoppingCart size={18} />
                R$ 42,00
              </button>
            </div>
          </div>
        </header>

        <div className={styles.containerSec}>
          <section className={styles.hero}>
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <div className={styles.openBadge}>
                <span style={{ color: "rgb(2,255,61)", fontSize: 10 }}>
                  ABERTO AGORA
                </span>
              </div>

              <h1 className={styles.heroTitle}>
                O Verdadeiro <br />
                <span className={styles.heroAccent}>Sabor Artesanal</span>
              </h1>
            </div>
          </section>

          <div className={styles.categoryRow}>
            <button
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

          {category === null ? (
            Object.entries(groupedProducts).map(([cat, items]) => {
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

                  <div className={cat === "Bebidas" ? styles.grid3 : styles.grid4}>
                    {items.map((item) => (
                      <FoodCard key={item.id} {...item} />
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionLeft}>
                  {React.createElement(categoryIcons[category], { size: 20 })}
                  <h2 className={styles.sectionTitle}>{category}</h2>
                </div>

                <span className={styles.sectionCount}>
                  <span className={styles.sectionQuant}>
                    {groupedProducts[category].length}
                  </span>
                  <span> opções</span>
                </span>
              </div>

              <div className={category === "Bebidas" ? styles.grid3 : styles.grid4}>
                {groupedProducts[category].map((item) => (
                  <FoodCard key={item.id} {...item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
