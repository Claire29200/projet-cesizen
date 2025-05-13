
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface DurationFieldProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DurationField = ({ value, onChange }: DurationFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Durée (minutes)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="duration"
          name="duration"
          type="number"
          min={1}
          max={120}
          value={value}
          onChange={onChange}
        />
        <Clock className="h-5 w-5 text-mental-400" />
      </div>
      <p className="text-xs text-mental-500">
        Durée estimée pour cette activité (en minutes)
      </p>
    </div>
  );
};
