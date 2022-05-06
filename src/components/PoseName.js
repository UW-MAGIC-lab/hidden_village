import { useEffect, useState } from "react";

const PoseName = (props) => {
  const { defaultName, index } = props;
  const [editMode, setEditMode] = useState(false);
  const [poseName, setPoseName] = useState(defaultName);
  const [inputWidth, setInputWidth] = useState(defaultName.length);

  useEffect(() => {
    document.getElementById(`edit-button-${index}`).onclick = () => {
      if (editMode) {
        let value = document.getElementById(`poseName-entry-${index}`).value;
        if (value !== "") setPoseName(value);
        else setInputWidth(poseName.length);
      }
      setEditMode(!editMode);
    };
  }, [editMode]);

  // keep updating input field width to align with text
  const updateInputField = (event) => {
    let value = event.target.value;
    setInputWidth(value.length);
  };

  return (
    <div className="flex justify-start gap-1">
      {!editMode && <label>{poseName}</label>}
      {editMode && (
        <input
          type="text"
          className="poseName-entry"
          id={`poseName-entry-${index}`}
          defaultValue={poseName}
          onChange={updateInputField}
          size={inputWidth < 3 ? 3 : inputWidth}
        />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="edit-button h-5 w-5"
        id={`edit-button-${index}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" 
        />
        <path
          fillRule="evenodd"
          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default PoseName;
