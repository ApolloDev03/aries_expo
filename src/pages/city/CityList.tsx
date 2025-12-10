import { useState } from "react";
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface City {
  id: number;
  name: string;
}

export default function CityList() {
  const [cities, setCities] = useState<City[]>([
    { id: 1, name: "Ahmedabad" },
    { id: 2, name: "Surat" },
  ]);

  const [open, setOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const ARIES_ORANGE = "#F26A21";
  const ROW_ODD = "#F9FAFB";

  const rowsToRender = Math.max(5, cities.length); // Always show min 5 rows

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

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this city?")) {
      setCities((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-[800px] ">
        <div className="flex justify-between mb-4">
          {/* HEADER */}
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

        {/* TABLE BOX */}
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
              {Array.from({ length: rowsToRender }).map((_, index) => {
                const city = cities[index];

                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "white" : ROW_ODD,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell style={{ padding: 0, margin: 0 }}>{city ? city.name : ""}</TableCell>

                    <TableCell>
                      {city && (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEdit(city)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => handleDelete(city.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        {/* MODAL */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? "Edit City" : "Add City"}</DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
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
              onClick={handleSave}
              style={{ background: "#005B9D" }}
            >
              {editId ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
