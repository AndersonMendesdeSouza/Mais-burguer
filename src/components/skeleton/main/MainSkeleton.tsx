// src/pages/Main/MainSkeleton.tsx
import styles from "./mainSkeleton.module.css";

export function MainSkeleton() {
  return (
    <div className={styles.screen}>
      <div className={styles.page}>
        {/* <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.brand}>
              <div className={`${styles.skel} ${styles.brandDot}`} />
              <div className={`${styles.skel} ${styles.brandName}`} />
            </div>

            <div className={styles.headerRight}>
              <div className={`${styles.skel} ${styles.cartBtn}`} />
            </div>
          </div>

          <div className={`${styles.skel} ${styles.searchBtn}`} />
        </header> */}

        <div className={styles.containerSec}>
          <section className={styles.hero}>
            <div className={styles.heroOverlay} />
            <div className={styles.heroCenter}>
              <div className={styles.heroContent}>
                <div className={styles.heroBadges}>
                  <div className={`${styles.skel} ${styles.badge}`} />
                  <div className={`${styles.skel} ${styles.badgeRound}`} />
                </div>

                <div className={styles.heroTitles}>
                  <div className={`${styles.skel} ${styles.heroTitle}`} />
                  <div className={`${styles.skel} ${styles.heroAccent}`} />
                </div>

                <div className={styles.heroDesc}>
                  <div className={`${styles.skel} ${styles.line}`} />
                  <div className={`${styles.skel} ${styles.line}`} />
                  <div className={`${styles.skel} ${styles.lineShort}`} />
                </div>
              </div>
            </div>
          </section>

          <div className={styles.categoryRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${styles.skel} ${styles.categoryPill}`} />
            ))}
          </div>

          {Array.from({ length: 3 }).map((_, sec) => (
            <section key={sec} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionLeft}>
                  <div className={`${styles.skel} ${styles.sectionIcon}`} />
                  <div className={`${styles.skel} ${styles.sectionTitle}`} />
                </div>
                <div className={`${styles.skel} ${styles.sectionCount}`} />
              </div>

              <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, c) => (
                  <div key={c} className={`${styles.skel} ${styles.card}`} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
