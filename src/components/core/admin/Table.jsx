import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "14px 20px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    color: "#e2e8f0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "14px 20px",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover td": {
    backgroundColor: "rgba(99, 102, 241, 0.05)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  transition: "all 0.2s ease",
}));

export const CustomizedTables = ({ users }) => {
  const [usersData, setUsersData] = React.useState([]);

  React.useEffect(() => {
    setUsersData(users);
  }, [users]);

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-slate-400 mt-1">Manage platform users</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <Table aria-label="users table">
            <TableHead>
              <TableRow>
                <StyledTableCell>User Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData.map((user) => (
                <StyledTableRow key={user.name}>
                  <StyledTableCell component="th" scope="row">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className="text-slate-400">{user.email}</span>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <button className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Tooltip title="Delete User">
                        <DeleteIcon style={{ fontSize: 18 }} />
                      </Tooltip>
                    </button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
