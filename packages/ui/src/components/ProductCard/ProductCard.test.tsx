import type { Product } from '@repo/types';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

/**
 * Mock product data for testing.
 */
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product description',
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  category: 'electronics',
  thumbnail: 'https://example.com/thumb.jpg',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ],
};

describe('ProductCard', () => {
  describe('Basic rendering', () => {
    it('renders the product title', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders the product price', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders the thumbnail with correct alt text', () => {
      render(<ProductCard product={mockProduct} />);
      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('renders the rating', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('renders stock information', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('50 in stock')).toBeInTheDocument();
    });
  });

  describe('Layout variants', () => {
    it('applies vertical class when layout is vertical', () => {
      const { container } = render(<ProductCard product={mockProduct} layout="vertical" />);
      const card = container.querySelector('article');
      expect(card).toHaveClass('vertical');
    });

    it('applies horizontal class when layout is horizontal', () => {
      const { container } = render(<ProductCard product={mockProduct} layout="horizontal" />);
      const card = container.querySelector('article');
      expect(card).toHaveClass('horizontal');
    });

    it('defaults to vertical layout', () => {
      const { container } = render(<ProductCard product={mockProduct} />);
      const card = container.querySelector('article');
      expect(card).toHaveClass('vertical');
    });
  });

  describe('Category visibility', () => {
    it('shows category tags when showCategories is true', () => {
      render(<ProductCard product={mockProduct} showCategories={true} />);
      expect(screen.getByText('electronics')).toBeInTheDocument();
    });

    it('hides category tags when showCategories is false', () => {
      render(<ProductCard product={mockProduct} showCategories={false} />);
      expect(screen.queryByText('electronics')).not.toBeInTheDocument();
    });

    it('defaults to hiding categories', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.queryByText('electronics')).not.toBeInTheDocument();
    });
  });

  describe('Thumbnail count', () => {
    it('renders 1 image when thumbnailCount is 1', () => {
      render(<ProductCard product={mockProduct} thumbnailCount={1} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });

    it('renders 2 images when thumbnailCount is 2', () => {
      render(<ProductCard product={mockProduct} thumbnailCount={2} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
    });

    it('defaults to 1 thumbnail', () => {
      render(<ProductCard product={mockProduct} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });
  });

  describe('Action button', () => {
    it('renders default action label', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
    });

    it('renders custom action label', () => {
      render(<ProductCard product={mockProduct} actionLabel="Add to Cart" />);
      expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
    });

    it('disables button when out of stock', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Discount display', () => {
    it('shows discounted price when product has discount', () => {
      render(<ProductCard product={mockProduct} />);
      // Original price with strikethrough
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      // Discounted price (99.99 * 0.9 = 89.99)
      expect(screen.getByText('$89.99')).toBeInTheDocument();
      // Discount badge
      expect(screen.getByText('-10%')).toBeInTheDocument();
    });

    it('shows only regular price when no discount', () => {
      const noDiscountProduct = { ...mockProduct, discountPercentage: 0 };
      render(<ProductCard product={noDiscountProduct} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.queryByText('-0%')).not.toBeInTheDocument();
    });
  });
});
