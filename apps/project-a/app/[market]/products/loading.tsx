import styles from './loading.module.css';

/**
 * Loading skeleton for the products page.
 * Displays a 12-card animated skeleton grid while products are loading.
 */
export default function ProductsLoading() {
  const skeletonCards = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section
      style={{
        padding: 'var(--space-6)',
      }}
    >
      <div
        className={styles.titleSkeleton}
        style={{
          height: '2rem',
          width: '150px',
          marginBottom: 'var(--space-6)',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {skeletonCards.map((index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageSkeleton} />
            <div className={styles.content}>
              <div className={styles.titleLine} />
              <div className={styles.priceLine} />
              <div className={styles.buttonSkeleton} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
