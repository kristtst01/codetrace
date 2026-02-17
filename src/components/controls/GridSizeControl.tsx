import { LabeledSlider } from './LabeledSlider';

interface GridSizeControlProps {
  rows: number;
  cols: number;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
}

export const GridSizeControl = ({
  rows,
  cols,
  onRowsChange,
  onColsChange,
}: GridSizeControlProps) => {
  return (
    <div className="space-y-4">
      <LabeledSlider
        label="Rows"
        value={rows}
        onValueChange={onRowsChange}
        min={10}
        max={50}
        step={5}
      />
      <LabeledSlider
        label="Columns"
        value={cols}
        onValueChange={onColsChange}
        min={10}
        max={100}
        step={5}
      />
    </div>
  );
};
