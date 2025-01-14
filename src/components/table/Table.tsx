import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ICustomer } from "@/types";
import PushPinIcon from "@mui/icons-material/PushPin";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DoneAllIcon from '@mui/icons-material/DoneAll';import { Button, Modal, Box, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/api";

const BasicTable: React.FC<{ data: ICustomer[], type: string }> = ({ data, type }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [id, setId] = React.useState<null | string>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState<number | "">("");
  const queryClient = useQueryClient();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, _id: string) => {
    setAnchorEl(event.currentTarget);
    setId(_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setId(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPaymentAmount("");
  };

  const pinMutation = useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: boolean }) =>
      request.patch(`/update/${type}/${id}`, { pin: !pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, date }: { id: string; amount: number; date: string }) =>
      request.patch(`/update/${type}/${id}`, { amount, isPaidToday: date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const handlePin = (id: string, pin: boolean) => {
    pinMutation.mutate({ id, pin });
    setAnchorEl(null);
  };

  const handlePayment = () => {
    if (id && paymentAmount) {
      const today = new Date().toISOString();
      paymentMutation.mutate({ id, amount: Number(paymentAmount), date: today });
      handleModalClose();
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First name</TableCell>
            <TableCell align="left">Last name</TableCell>
            <TableCell align="left">Phone</TableCell>
            <TableCell align="left">Budget</TableCell>
            <TableCell align="left">Address</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row: ICustomer) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.pin && <PushPinIcon className="rotate-45" fontSize="small" />}
                
                {row.fname}
              </TableCell>
              <TableCell align="left">{row.lname}</TableCell>
              <TableCell align="left">{row.phone_primary}</TableCell>
              <TableCell align="left">{row.budget}</TableCell>
              <TableCell align="left">{row.address}</TableCell>
              <TableCell align="center">
                <Button sx={{ color: "#333" }} onClick={(event) => handleClick(event, row._id)}>
                  <MoreHorizIcon />
                </Button>
                {id === row._id && (
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handlePin(row._id, row.pin)}>
                      {row.pin ? "Unpin" : "Pin"}
                    </MenuItem>
                    <MenuItem onClick={handleModalOpen}>Payment</MenuItem>
                  </Menu>
                )}
                {row.isPaidToday && typeof row.isPaidToday === 'string' && isToday(row.isPaidToday) && (
                  <DoneAllIcon color="success" fontSize="small" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Payment for {data.find((customer) => customer._id === id)?.fname} {data.find((customer) => customer._id === id)?.lname}</DialogTitle>
        <DialogContent>
          <TextField
            label="Payment Amount"
            type="number"
            fullWidth
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePayment} color="primary">Confirm Payment</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default BasicTable;