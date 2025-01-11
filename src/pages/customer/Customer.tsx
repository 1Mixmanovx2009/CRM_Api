import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, CircularProgress, Pagination, Typography } from "@mui/material";
import { useState } from "react";
import { request } from "@/api";
import { useQuery } from '@tanstack/react-query'


const Customer = () => {
  const [open, setOpen] = useState<null | string>(null);
  const [page, setPage] = useState(1);
  const {data, isFetching} = useQuery({
    queryKey: ["toos", page],
    queryFn: () => request.get('/get/customers', {
      params: {
          skip: page,
          limit: 10
      }
      }).then(res => res)
  })
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
};

  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Customer
        </Typography>
        <Button onClick={() => setOpen("customer")}>Create</Button>
      </Box>
      {isFetching ? (
                <Typography><CircularProgress/></Typography>
            ) : (
                <Table data={data?.data?.innerData} />
            )}
      <CreateCS open={open} close={() => setOpen(null)} />
      <Pagination page={page} count={21} onChange={handleChangePage} />
        
    </div>
  );
};
export default Customer;
