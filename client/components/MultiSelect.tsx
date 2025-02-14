import { ReactElement } from "react";
import Select, { Props as SelectProps } from "react-select";
import { Option } from "multi-select";

import { Label } from "@/components/ui/label";

interface SelectFieldProps extends SelectProps {
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  selectedOptions?: Option[];
}

export const MultiSelect = ({
  id,
  label,
  placeholder,
  options,
  selectedOptions,
  onChange,
}: SelectFieldProps): ReactElement => {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="opacity-80" htmlFor={id}>
          {label}
        </Label>
      )}
      <Select
        inputId={id}
        isMulti
        noOptionsMessage={() => "Aucune option"}
        value={selectedOptions}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        className="my-react-select-container"
        classNamePrefix="my-react-select"
      />
    </div>
  );
};
