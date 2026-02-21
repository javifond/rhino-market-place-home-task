import { getSession } from '@/lib/auth';
import { ROUTES, isValidMarket } from '@repo/constants';
import type { ProductDetail } from '@repo/types';
import { Button } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ market: string; slug: string }>;
}

/**
 * Pre-generates product pages at build time for all products.
 */
export async function generateStaticParams() {
  const res = await fetch('https://dummyjson.com/products?limit=100&select=id');
  const data = await res.json();
  return (data.products as Array<{ id: number }>).map((p) => ({
    slug: String(p.id),
  }));
}

/**
 * Fetches a single product by ID.
 */
async function fetchProduct(id: string): Promise<ProductDetail | null> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

/**
 * Generates metadata based on auth state.
 * Authenticated views are noindex to prevent indexing personalized content.
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { market, slug } = await params;

  if (!isValidMarket(market)) {
    return {};
  }

  const product = await fetchProduct(slug);
  const session = await getSession();
  const isAuthenticated = session !== null;

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.title,
    description: product.description,
    robots: isAuthenticated ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/**
 * Product detail page with auth-gated content.
 *
 * Base product info (title, price, images) visible to all users.
 * Reviews, warranty, and return policy only shown to authenticated users.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { market, slug } = await params;

  if (!isValidMarket(market)) {
    notFound();
  }

  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const session = await getSession();
  const isAuthenticated = session !== null;

  const discountedPrice =
    product.discountPercentage > 0 ? product.price * (1 - product.discountPercentage / 100) : null;

  return (
    <article
      style={{
        padding: 'var(--space-6)',
        maxWidth: 'var(--content-max-width)',
        margin: '0 auto',
      }}
    >
      {/* Product Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {/* Images */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              overflowX: 'auto',
            }}
          >
            {product.images.slice(0, 4).map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${product.title} view ${index + 1}`}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--text-3xl)',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {product.title}
          </h1>

          {product.brand && (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              by {product.brand}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {discountedPrice !== null ? (
              <>
                <span
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                  }}
                >
                  ${discountedPrice.toFixed(2)}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'line-through',
                  }}
                >
                  ${product.price.toFixed(2)}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-success)',
                    fontWeight: 'bold',
                  }}
                >
                  -{product.discountPercentage.toFixed(0)}%
                </span>
              </>
            ) : (
              <span
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'bold',
                  color: 'var(--color-text)',
                }}
              >
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Rating:</span>
            <span style={{ fontWeight: 'bold' }}>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/ 5</span>
          </div>

          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text)',
              lineHeight: 1.6,
            }}
          >
            {product.description}
          </p>

          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)',
            }}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <Button variant="primary" size="lg" disabled={product.stock === 0}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Auth-gated content */}
      {isAuthenticated ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          {/* Shipping & Warranty Info */}
          <section
            style={{
              padding: 'var(--space-6)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontFamily: 'var(--font-heading)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Product Details
            </h2>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'var(--space-2) var(--space-4)',
              }}
            >
              <dt style={{ color: 'var(--color-text-muted)' }}>Shipping:</dt>
              <dd>{product.shippingInformation}</dd>
              <dt style={{ color: 'var(--color-text-muted)' }}>Warranty:</dt>
              <dd>{product.warrantyInformation}</dd>
              <dt style={{ color: 'var(--color-text-muted)' }}>Return Policy:</dt>
              <dd>{product.returnPolicy}</dd>
            </dl>
          </section>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: 'var(--text-xl)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Customer Reviews ({product.reviews.length})
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                {product.reviews.map((review) => (
                  <div
                    key={`${review.reviewerName}-${review.date}`}
                    style={{
                      padding: 'var(--space-4)',
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>{review.reviewerName}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{review.rating}/5</span>
                    </div>
                    <p style={{ color: 'var(--color-text)' }}>{review.comment}</p>
                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-muted)',
                        marginTop: 'var(--space-2)',
                      }}
                    >
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <section
          style={{
            padding: 'var(--space-8)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontFamily: 'var(--font-heading)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Want to see more?
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Login to see reviews, warranty information, and full product details.
          </p>
          <Link href={`${ROUTES.login(market)}?callbackUrl=${ROUTES.product(market, slug)}`}>
            <Button variant="primary">Login to see full details</Button>
          </Link>
        </section>
      )}
    </article>
  );
}
