import React from "react";
import { DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";

export default function RolDropdown({ value, onSelect }) {
  const getTitle = (val) => {
    if (!val) return "Seleccione un rol";
    if (val === "1") return "Cliente";
    if (val === "2") return "Administrador";
    if (val === "3") return "Agricultor";
  };

  return (
    <div className="mb-3">
      <label className="form-label mb-1"></label>
      <DropdownButton
        as={ButtonGroup}
        className="dropdown-naranja w-100"
        title={getTitle(value)}
        onSelect={onSelect}
      >
        <Dropdown.Item eventKey="1">Cliente</Dropdown.Item>
        <Dropdown.Item eventKey="2">Administrador</Dropdown.Item>
        <Dropdown.Item eventKey="3">Agricultor</Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
