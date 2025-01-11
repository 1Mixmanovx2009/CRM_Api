import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/productTable";
import { Box, Button, CircularProgress, Pagination, Typography } from "@mui/material";
import { useState } from "react";
import { request } from "@/api";
import { useQuery } from '@tanstack/react-query'


const Product = () => {
    const [open, setOpen] = useState<null | string>(null);
    const [page, setPage] = useState(1);
    const { data, isFetching } = useQuery({
        queryKey: ["toos", page],
        queryFn: () => request.get('/get/products', {
            params: {
                skip: page,
                limit: 10
            }
        }).then(res => res)
    })
    console.log(data?.data?.innerData);


    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div>
            <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Product
                </Typography>
                <Button onClick={() => setOpen("seller")}>Create</Button>
            </Box>
            {isFetching ? (
                <Typography><CircularProgress/></Typography>
            ) : (
                <Table data={data?.data?.innerData} />
            )}
            <CreateCS open={open} close={() => setOpen(null)} />
            <Pagination page={page} count={3} onChange={handleChangePage} />
        </div>
    );
};

export default Product;
