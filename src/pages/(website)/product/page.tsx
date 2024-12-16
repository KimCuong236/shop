import { useQuery } from "@tanstack/react-query";
import { List, Skeleton } from "antd";
import axios from "axios";

const ProductList = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/products");
      return response.data;
    },
  });

  if (isLoading) return <Skeleton active />;

  return (
    <div className="product-list">
      <h2>Danh Sách Sản Phẩm</h2>
      <List
        itemLayout="horizontal"
        dataSource={Array.isArray(products) ? products : []} // Đảm bảo products là một mảng
        renderItem={(product) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <img src={product.imageUrl} alt={product.name} width={50} />
              }
              title={product.name}
              description={`${product.price} VND`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProductList;
