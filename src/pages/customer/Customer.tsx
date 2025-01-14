import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, CircularProgress, Pagination, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { request } from "@/api";
import { useQuery } from '@tanstack/react-query'

const Customer = () => {
  const [open, setOpen] = useState<null | string>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isFetching } = useQuery({
    queryKey: ["customer", page, limit],
    queryFn: () => request.get('/get/customers', {
      params: {
        skip: (page - 1) * limit,
        limit,
      }
    }).then(res => res)
  });

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleChangeLimit = (_: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setLimit(value[0]);
    } else {
      setLimit(value);
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}>
        <Typography variant="h6">Customer</Typography>
        <Slider
          size="small"
          style={{ width: 300 }}
          min={1}
          max={221}
          defaultValue={limit}
          onChange={handleChangeLimit}
          valueLabelDisplay="auto"
        />
        <Button onClick={() => setOpen("customer")}>Create</Button>
      </Box>

      {isFetching ? (
        <CircularProgress />
      ) : (
        <Table data={data?.data?.innerData} type="customer" />
      )}

      <CreateCS open={open} close={() => setOpen(null)} />
      <Pagination
        page={page}
        count={Math.ceil(data?.data?.total / limit)} // Dynamic page count
        onChange={handleChangePage}
      />
    </div>
  );
};

export default Customer;
