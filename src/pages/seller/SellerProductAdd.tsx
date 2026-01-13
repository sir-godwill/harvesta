import { SellerLayout } from '@/components/seller/SellerLayout';
import AddProductPage from '@/components/product-form/AddProductPage';

export default function SellerProductAdd() {
  return (
    <SellerLayout>
      <AddProductPage 
        isAdmin={false} 
        backLink="/seller/products"
      />
    </SellerLayout>
  );
}
