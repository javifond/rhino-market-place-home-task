import type { Product } from '@repo/types';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

/**
 * Mock product data for testing.
 */
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product description',
  price: 99.99,
  discountPercentage: 0,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  category: 'electronics',
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};

describe('Project A ProductCard Override', () => {
  it('renders with vertical layout class', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const card = container.querySelector('article');
    expect(card).toHaveClass('vertical');
  });

  it('does not show category tags', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText('electronics')).not.toBeInTheDocument();
  });

  it('renders only 1 thumbnail', () => {
    render(<ProductCard product={mockProduct} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
  });

  it('renders brand-specific action label', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole('button', { name: 'Hello from Green Project' })).toBeInTheDocument();
  });

  it('renders the product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
