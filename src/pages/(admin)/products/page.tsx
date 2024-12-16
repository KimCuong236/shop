import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Skeleton, Space, Table } from "antd";
import type { TableProps } from "antd/es/table";
import { IProduct } from "../../../interfaces/product";
import axios from "axios";
import { Link } from "react-router-dom";

interface DataType {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  stock: boolean;
  description: string;
}

const AdminProductsPage = () => {
  const [messageAPI, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Fetch data from API
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/products");
      // Return data in correct format
      return response.data.products.map((product: IProduct) => ({
        key: product._id, // Use _id as key
        ...product,
      }));
    },
  });

  // Mutation to delete a product
  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess() {
      messageAPI.success("Xoá thành công");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Define columns for the table
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Tình trạng",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => <div>{stock ? "Còn hàng" : "Hết hàng"}</div>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Xoá sản phẩm"
            description="Không thể hoàn tác"
            okText="Xoá"
            cancelText="Hủy"
            onConfirm={() => mutate(item._id)} // Sử dụng `item.key` thay vì `item.id`
          >
            <Button type="primary" danger>
              Xoá
            </Button>
          </Popconfirm>
          <Link to={`/products/edit/${item._id}`}>
            <Button type="primary">Sửa</Button>
          </Link>
        </Space>
      ),
    },
  ];

  // Nếu đang tải dữ liệu
  if (isLoading) return <Skeleton active />;

  // Nếu không có dữ liệu
  if (!data || data.length === 0) {
    return <div>Không có sản phẩm nào!</div>;
  }

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default AdminProductsPage;
