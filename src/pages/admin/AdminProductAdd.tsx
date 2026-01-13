import AddProductPage from '@/components/product-form/AddProductPage';

export default function AdminProductAdd() {
  return (
    <AddProductPage 
      isAdmin={true} 
      backLink="/admin/products"
    />
  );
}
