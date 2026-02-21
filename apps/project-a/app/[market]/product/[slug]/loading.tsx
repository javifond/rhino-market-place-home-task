import styles from './loading.module.css';

/**
 * Loading skeleton for the product detail page.
 */
export default function ProductLoading() {
  return (
    <article
      style={{
        padding: 'var(--space-6)',
        maxWidth: 'var(--content-max-width)',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {/* Image skeleton */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div className={styles.imageSkeleton} />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.thumbnailSkeleton} />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div className={styles.titleSkeleton} />
          <div className={styles.brandSkeleton} />
          <div className={styles.priceSkeleton} />
          <div className={styles.ratingSkeleton} />
          <div className={styles.descriptionSkeleton} />
          <div className={styles.descriptionSkeleton} style={{ width: '80%' }} />
          <div className={styles.stockSkeleton} />
          <div className={styles.buttonSkeleton} />
        </div>
      </div>

      {/* Details skeleton */}
      <div className={styles.detailsSkeleton} />
    </article>
  );
}
