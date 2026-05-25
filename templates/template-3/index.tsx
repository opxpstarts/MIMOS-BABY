import type { DashboardProduct } from '@/lib/types';
import PeachUpTemplate from './PeachUpTemplate';

type Props = {
  product: DashboardProduct;
  logoUrl: string;
};

export default function Template3({ product, logoUrl }: Props) {
  return <PeachUpTemplate product={product} logoUrl={logoUrl} />;
}
