import { Slider } from '../ui/slider';

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
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Rows</label>
          <span className="text-sm text-muted-foreground">{rows}</span>
        </div>
        <Slider
          value={[rows]}
          onValueChange={([value]) => onRowsChange(value)}
          min={10}
          max={50}
          step={5}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Columns</label>
          <span className="text-sm text-muted-foreground">{cols}</span>
        </div>
        <Slider
          value={[cols]}
          onValueChange={([value]) => onColsChange(value)}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
    </div>
  );
};
