import { Divider, Button } from "@mui/material";

export default function AircraftComponent({
  aircraft,
  handleOpenDialog,
  handleDelete,
}) {
  return (
    <div className="flex shadow-[0_0_5px_rgba(0,0,0,0.3)] rounded-md px-5 py-2 justify-between mb-2">
      <div>
        <div className="text-theme-primary font-bold">
          {aircraft.brand} {aircraft.model}
        </div>
        <div>
          Economy seats:{" "}
          <span className="text-theme-primary font-bold">
            {aircraft.numOfEconomySeats}
          </span>
        </div>
        <div>
          Business seats:{" "}
          <span className="text-theme-primary font-bold">
            {aircraft.numOfBusinessSeats}
          </span>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col items-center gap-2">
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => handleOpenDialog(aircraft)}
        >
          Edit
        </Button>
        <Button
          color="error"
          variant="outlined"
          fullWidth
          onClick={() => handleDelete(aircraft.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
