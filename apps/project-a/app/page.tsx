import { redirect } from 'next/navigation';

/**
 * Root page redirects to the default market.
 * Users hitting `/` are immediately sent to `/en`.
 */
export default function RootPage() {
  redirect('/en');
}
