/**
 * Returns an object with the row width, height and starting x, y coordinates
 * @callback rowDimensionsCallback
 * @param {number} rowNumber - Row number (starting at 1) for requested dimensions
 * @returns {object}
 */

/**
 * Returns an object with the column width, height and starting x, y coordinates
 * @callback columnDimensionsCallback
 * @param {number} columnNumber - Column number (starting at 1) for requested dimensions
 * @returns {object}
 */

/**
 * This returns true if the operand inputArg is a String.
 * @name generateRowAndColumnFunctions
 * @function
 * @param {number} screenWidth in pixels
 * @param {number} screenHeight in pixels
 * @param {number} numberOfRows
 * @param {number} numberOfColumns
 * @param {number} marginBetweenRows in pixels
 * @param {number} marginBetweenColumns in pixels
 * @param {number} columnGutter - in pixels, the space between the edge of the screen and the column [margin]
 * @param {number} rowGutter - in pixels, the space between the edge of the screen and the row [margin]
 * @returns {Array<function>} [rowDimensionsCallback, columnDimensionsCallback]
 */
const generateRowAndColumnFunctions = (
  screenWidth,
  screenHeight,
  numberOfRows,
  numberOfColumns,
  marginBetweenRows,
  marginBetweenColumns,
  columnGutter,
  rowGutter
) => {
  // calculate the width of each row
  const rowWidth = screenWidth - 2 * rowGutter;
  // calculate the height of each row
  const rowHeight =
    (screenHeight - 2 * columnGutter - (numberOfRows - 1) * marginBetweenRows) /
    numberOfRows;
  // calculate the height of each column
  const columnHeight = screenHeight - 2 * columnGutter;
  // calculate the width of each column
  const columnWidth =
    (screenWidth -
      2 * rowGutter -
      (numberOfColumns - 1) * marginBetweenColumns) /
    numberOfColumns;

  // return a tuple containing two functions:
  // one that takes in a row index and returns an object with the dimensions of the row, its starting x, and its starting y
  // the other that takes in a column index and returns an object with the dimensions of the column, its starting x, and its starting y
  return [
    (rowNumber) => {
      if (rowNumber > numberOfRows) {
        throw new Error("rowNumber is greater than numberOfRows");
      }
      return {
        width: rowWidth,
        height: rowHeight,
        x: rowGutter,
        y: columnGutter + (rowHeight + marginBetweenRows) * (rowNumber - 1),
        margin: marginBetweenRows,
      };
    },
    (columnNumber) => {
      if (columnNumber > numberOfColumns) {
        throw new Error("columnNumber is greater than numberOfColumns");
      }
      return {
        width: columnWidth,
        height: columnHeight,
        x:
          rowGutter + (columnWidth + marginBetweenColumns) * (columnNumber - 1),
        y: columnGutter,
        margin: marginBetweenColumns,
      };
    },
  ];
};
export { generateRowAndColumnFunctions };
