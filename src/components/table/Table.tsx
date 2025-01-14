import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { Button, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PushPinIcon from '@mui/icons-material/PushPin';
import { ICustomer } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/api';

interface TableProps {
  data: ICustomer[] | undefined;
  type: string;
}

const BasicTable: React.FC<TableProps> = ({ data = [], type }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [id, setId] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: ({ id, pin }: { id: string, pin: boolean }) => request.patch(`/update/${type}/${id}`, { pin: !pin }).then(res => res),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [type] })
    },
  })

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, rowId: string) => {
    setAnchorEl(event.currentTarget);
    setId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setId(null);
  };

  const handlePin = (rowId: string, pin: boolean) => {
    mutation.mutate({ id: rowId, pin });
    handleClose();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First name</TableCell>
            <TableCell align="right">Last name</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row: ICustomer) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <span>
                  {row.pin && <PushPinIcon fontSize="small" className="rotate-45" />}
                </span>
                {row.fname}
              </TableCell>
              <TableCell align="right">{row.lname}</TableCell>
              <TableCell align="right">{row.phone_primary}</TableCell>
              <TableCell align="right">{row.budget}</TableCell>
              <TableCell align="right">{row.address}</TableCell>
              <TableCell align="right">
                <Button sx={{ color: "black" }} onClick={(event) => handleClick(event, row._id)}>
                  <MoreHorizIcon />
                </Button>
                {id === row._id && (
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={() => handlePin(row._id, row.pin)}>{row.pin ? "Unpin" : "Pin"}</MenuItem>
                    <MenuItem>Payment</MenuItem>
                  </Menu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;