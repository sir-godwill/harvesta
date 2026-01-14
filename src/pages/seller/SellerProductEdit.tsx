import { useParams } from 'react-router-dom';
import { SellerLayout } from '@/components/seller/SellerLayout';
import AddProductPage from '@/components/product-form/AddProductPage';

export default function SellerProductEdit() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <SellerLayout>
      <AddProductPage 
        isAdmin={false} 
        backLink="/seller/products"
        productId={id}
      />
    </SellerLayout>
  );
}
