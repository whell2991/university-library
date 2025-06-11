import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface Props {
  value?: string;
  onPickerChange?: (color: string) => void;
}

const ColorPicker = ({ value, onPickerChange }: Props) => {
  const [color, setColor] = useState("#aabbcc");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="relative">
        <div className="color-picker">
          <HexColorPicker color={value} onChange={onPickerChange} />
          <div className="flex flex-row items-center">
            <p>#</p>
            <HexColorInput
              color={value}
              onChange={onPickerChange}
              className="hex-input"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
