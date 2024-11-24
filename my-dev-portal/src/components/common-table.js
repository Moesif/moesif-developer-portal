import React, { Component } from "react";
import PropTypes from "prop-types";
import safeGet from "lodash/get";
import isNil from "lodash/isNil";

function convertToPx(x) {
  if (x === undefined || x === null) return x;

  return typeof x === "number" ? x.toString() + "px" : x.toString();
}

const TableHeader = (props) => {
  const {
    columnField,
    sortable,
    header,
    sortColumnAccessor,
    sortDirection,
    setSortDirection,
    setSortColumn,
    data,
    alignRight,
    minRowHeight,
    contentType,
  } = props;

  const justifyContent =
    contentType === "number" || contentType === "date" ? "flex-end" : "";

  let displayHeader;
  if (header === undefined) {
    displayHeader = columnField && columnField.toString();
  } else if (typeof header === "function") {
    displayHeader = header({ data });
  } else {
    displayHeader = header;
  }

  if (alignRight) {
    return (
      <th
        style={{
          textAlign: "right",
          fontWeight: 500,
          color: "#444",
          justifyContent,
        }}
      >
        {displayHeader}
      </th>
    );
  }

  return <th style={{ justifyContent }}>{displayHeader}</th>;
};

const FullRowComponent = ({ children, className }) => (
  <tr className={className}>
    <td className="d-flex">{children}</td>
  </tr>
);

FullRowComponent.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

function CommonTable(props) {
  const {
    data,
    columns,
    overlayTrigger,
    children,
    style,
    minRows,
    minRowHeight,
    emptyState,
    className,
    hasAggregation,
    hasPagination,
    withBorder,
    tableRef,
    rowRef,
    aggregateRowRef,
    paginationRef,
    sizeSelectorRef,
  } = props;
  let displayData = [];

  if (data) {
    displayData = [...data];
  }

  while (displayData.length < minRows) {
    displayData.push(null);
  }

  const widths = columns
    .map((col) => {
      const widthPx = convertToPx(col.width);
      const minWidthPx = convertToPx(col.minWidth);
      switch (true) {
        case !!(widthPx && minWidthPx):
          return `minmax(${minWidthPx}, ${widthPx})`;
        case !!widthPx:
          return widthPx;
        case !!minWidthPx:
          return `minmax(${minWidthPx}, 1fr)`;
        default:
          return "minmax(0, 1fr)";
      }
    })
    .join(" ");

  const aggregation = Array.from({ length: columns.length });
  const borderClass = withBorder ? "common-table--with-border" : "";
  return (
    <>
      <table
        ref={tableRef}
        className={`common-table ${className} ${borderClass}`}
        style={style}
      >
        {emptyState}
        <tbody>
          <tr
            className="common-table__header"
            style={{ gridTemplateColumns: widths }}
          >
            {columns.map((col) => (
              <TableHeader
                key={col.accessor}
                columnField={col.accessor}
                header={col.header}
                data={displayData}
                alignRight={col.alignRight}
                contentType={col.contentType}
                minRowHeight={minRowHeight}
              />
            ))}
          </tr>

          {displayData.map((row, index) => (
            <tr
              key={row?.id || index}
              ref={index === 0 ? rowRef : null}
              style={{ gridTemplateColumns: widths }}
              className={overlayTrigger ? "overlay-button-trigger" : ""}
            >
              {columns.map((col, idx) => {
                const justifyContent =
                  col.justifyContent ||
                  (col.contentType === "number" || col.contentType === "date"
                    ? "flex-end"
                    : "");
                if (row === null) {
                  return (
                    <td
                      key={
                        typeof col.accessor === "string" ? col.accessor : idx
                      }
                      style={{ minHeight: minRowHeight, justifyContent, display: "flex" }}
                    />
                  );
                }

                let content = null;
                let value = null;

                let colKey = idx;

                if (col.accessor instanceof Function) {
                  content = safeGet(row, col.accessor({ row, index }));
                  value = content;
                } else if (col.accessor) {
                  colKey = col.accessor;
                  content = safeGet(row, col.accessor);
                  value = content;
                }

                if (col.cell) {
                  content = (
                    <td
                      key={colKey}
                      style={{ minHeight: minRowHeight, justifyContent, display: "flex"  }}
                    >
                      {col.cell({
                        value: content,
                        row,
                        index,
                        data: displayData,
                      })}
                    </td>
                  );
                } else {
                  content = (
                    <td
                      key={colKey}
                      style={{ minHeight: minRowHeight, justifyContent, display: "flex"  }}
                    >
                      {content}
                    </td>
                  );
                }

                // aggregate results if needed
                if (hasAggregation && col.aggregationType) {
                  if (aggregation[idx] === undefined) {
                    if (col.aggregationType === "avg") {
                      aggregation[idx] = { sum: 0, length: 0 };
                    } else if (col.aggregationType !== "min") {
                      aggregation[idx] = 0;
                    }
                  }

                  if (value?.length === 0) {
                    // hack to deal with value being an empty array, e.g. empty error array
                    value = undefined;
                  }

                  switch (col.aggregationType) {
                    case "count":
                    case "total":
                      if (value || value === 0) {
                        aggregation[idx] += 1;
                      }
                      break;
                    case "sum":
                      aggregation[idx] += value || 0;
                      break;
                    case "avg":
                      aggregation[idx] = {
                        sum: (aggregation[idx]?.sum || 0) + value,
                        length: (aggregation[idx]?.length || 0) + 1,
                      };
                      break;
                    case "min":
                      if (aggregation[idx] === undefined) {
                        aggregation[idx] = value;
                      } else {
                        aggregation[idx] =
                          value < aggregation[idx] ? value : aggregation[idx];
                      }
                      break;
                    case "max":
                      aggregation[idx] =
                        value > aggregation[idx] ? value : aggregation[idx];
                      break;
                    default:
                      break; // do nothing
                  }
                }
                return content;
              })}
            </tr>
          ))}

          {children}
        </tbody>
      </table>
    </>
  );
}

export default CommonTable;

CommonTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  overlayTrigger: PropTypes.bool,
  defaultSortColumnAccessor: PropTypes.string,
  minRows: PropTypes.number,
  minRowHeight: PropTypes.string,
  emptyState: PropTypes.element,
  children: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  hasAggregation: PropTypes.bool,
  hasPagination: PropTypes.bool,
  withBorder: PropTypes.bool,
};

CommonTable.defaultProps = {
  className: "",
};
