import { useState } from "react";
import {
    TextField,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Item {
    id: number;
    name: string;
    email: string;
}

export default function DummyAdminPage() {
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "John Doe", email: "john@gmail.com" },
        { id: 2, name: "Sara Smith", email: "sara@gmail.com" },
    ]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editId, setEditId] = useState<number | null>(null);

    // Reset form
    const resetForm = () => {
        setName("");
        setEmail("");
        setEditId(null);
    };

    // Save / Update
    const handleSubmit = () => {
        if (name.trim() === "" || email.trim() === "") return;

        if (editId) {
            // Update
            setItems((prev) =>
                prev.map((item) =>
                    item.id === editId ? { ...item, name, email } : item
                )
            );
        } else {
            // Add
            setItems((prev) => [
                ...prev,
                { id: prev.length + 1, name, email },
            ]);
        }

        resetForm();
    };

    // Edit record
    const handleEdit = (item: Item) => {
        setEditId(item.id);
        setName(item.name);
        setEmail(item.email);
    };

    // Delete record
    const handleDelete = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
            {/* ---------------- LEFT FORM ---------------- */}
            <div
                style={{
                    flex: 1,
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                }}
            >
                <h2>{editId ? "Edit User" : "Add User"}</h2>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {editId ? "Update" : "Save"}
                    </Button>

                    {editId && (
                        <Button variant="outlined" color="secondary" onClick={resetForm}>
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            {/* ---------------- RIGHT LISTING ---------------- */}
            <div
                style={{
                    flex: 1.6,
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                }}
            >
                <h2>User List</h2>

                <Paper style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEdit(item)} color="primary">
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDelete(item.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        </div>
    );
}
