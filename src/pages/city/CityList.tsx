import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Pagination,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

interface City {
  id: number;
  name: string;
}

export default function CityList() {
  const dummyCities: City[] = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `City ${i + 1}`,
  }));

  const [cities, setCities] = useState<City[]>(dummyCities);

  const [open, setOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

  const ARIES_ORANGE = "#F26A21";
  const ROW_ODD = "#F9FAFB";

  // DELETE CONFIRM POPUP STATES
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // SEARCH FILTER
  const filteredCities = useMemo(() => {
    return cities.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, cities]);

  const totalPages = Math.ceil(filteredCities.length / rowsPerPage);
  const paginatedCities = filteredCities.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleOpenAdd = () => {
    setCityName("");
    setEditId(null);
    setOpen(true);
  };

  const handleOpenEdit = (city: City) => {
    setCityName(city.name);
    setEditId(city.id);
    setOpen(true);
  };

  const handleClose = () => {
    setCityName("");
    setEditId(null);
    setOpen(false);
  };

  const handleSave = () => {
    if (!cityName.trim()) return;

    if (editId) {
      setCities((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, name: cityName } : c))
      );
    } else {
      setCities((prev) => [...prev, { id: Date.now(), name: cityName }]);
    }

    handleClose();
  };

  // OPEN DELETE CONFIRMATION
  const handleDeleteOpen = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  // CONFIRM DELETE
  const confirmDelete = () => {
    setCities((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1F3C88]">City Master</h2>

        <Button
          variant="contained"
          sx={{ backgroundColor: ARIES_ORANGE }}
          startIcon={<AddIcon />}
          style={{ background: "#005B9D" }}
          onClick={handleOpenAdd}
        >
          Add City
        </Button>
      </div>

      {/* SEARCH ROW */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <TextField
          label="Search City"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          sx={{ flex: 1 }}
        />

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{ backgroundColor: "#1F3C88" }}
        >
          Search
        </Button>
      </div>

      {/* TABLE */}
      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>City Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCities.map((city, index) => (
              <TableRow
                key={city.id}
                sx={{ backgroundColor: index % 2 === 0 ? "white" : ROW_ODD }}
              >
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{city.name}</TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenEdit(city)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOpen(city.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {paginatedCities.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No cities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* ADD / EDIT MODAL */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "400px",
            maxWidth: "90%",
            borderRadius: "12px",
            paddingBottom: 2,
          },
        }}
      >
        <DialogTitle>{editId ? "Edit City" : "Add City"}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{ backgroundColor: ARIES_ORANGE }}
            style={{ background: "#005B9D" }}
            onClick={handleSave}
          >
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <DialogTitle>Delete City</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this city?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
