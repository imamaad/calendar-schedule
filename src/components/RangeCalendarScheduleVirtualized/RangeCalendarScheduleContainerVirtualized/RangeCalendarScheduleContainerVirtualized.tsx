import React, {useState} from "react";
import {Grid, ScrollbarPresenceParams} from "react-virtualized";
import {useRangeCalendarScheduleVirtualized} from "../RangeCalendarScheduleContextVirtualized";
import _ from "lodash";
import moment from "moment";
import scrollbarSize from 'dom-helpers/scrollbarSize';
import {useScrollContainer} from "react-indiana-drag-scroll";

export const RangeCalendarScheduleContainerVirtualized = () => {

    const {
        days,
        height,
        width,
        columnWidth,
        columnCount,
        overScanColumnCount,
        overScanRowCount,
        getRowCount,
        rowHeight,
        scrollTop,
        scrollLeft,
        textColorColumn,
        bgColorColumn,
        bordered,
        itemRenderer,
        onContextMenu,
        columns,
        headerHeight,
        format,
        onScroll,
        sidebarWidth,
        bgColorHeader,
        textColorHeader,
    } = useRangeCalendarScheduleVirtualized();

    const [scrollbarPresence, setScrollbarPresence] = useState<ScrollbarPresenceParams>({
        horizontal: false,
        size: 0,
        vertical: false,
    });

    const scrollContainer = useScrollContainer({
        mouseScroll: {
            // ignoreElements: '.LeftSideGridContainer,.GridTitle',
            rubberBand: false,
            inertia: false,
            overscroll: false,
        }
    });

    const _renderHeaderCell = ({column, columnIndex, key, rowIndex, style}: any) => {
        if (columnIndex === 0) {
            return;
        }

        const cIndex = columnIndex - 1 >= 1 ? columnIndex - 1 : 0;

        const show = column?.defaultOpen;

        console.log({column})
        return (
            <div
                key={key}
                style={{
                    ...style,
                    border: bordered ? '1px solid #bbb' : 'unset',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: bgColorHeader,
                    color: textColorHeader,
                }}
            >
                {

                    show &&
                    <>
                        <div className="imamaad-range-calendar-schedule-virtualized-sticky"
                             style={{flex: 1, textAlign: 'center', borderBottom: '2px solid #bbb'}}>
                            {`${moment(days[cIndex]).format(format?.top || 'YYYY-MM-DD')}`}
                        </div>
                        <div style={{flex: 1, textAlign: 'center'}}>
                            {`${moment(days[cIndex]).format(format?.bottom || 'YYYY-MM-DD')}`}
                        </div>
                    </>
                }
            </div>
        );
    }

    const _renderBodyCell = ({day, items, columnIndex, key, rowIndex, style, column}: any) => {

        return (
            <div
                key={key}
                onContextMenu={
                    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        event.preventDefault();
                        if (event?.target === event?.currentTarget) {
                            onContextMenu({day, items, columnIndex, key, rowIndex, column, event})
                        }
                    }
                }
                style={{
                    ...style,
                    border: bordered ? '1px solid #bbb' : 'unset',
                    boxSizing: 'border-box',
                    padding: 5,
                    overflowY: 'auto'
                }}
            >
                {_.map(items, (item, itemKey) => _renderItemCell({item, columnIndex, key, rowIndex, style, itemKey}))}
            </div>
        );
    }

    const _renderItemCell = ({item, columnIndex, key, rowIndex, itemKey}: any) => {
        return (
            <div
                className='imamaad-range-calendar-schedule-virtualized-item'
                key={itemKey}
                style={{
                    marginBottom: 5,
                }}
            >
                {itemRenderer({item, columnIndex, key, rowIndex, itemKey})}
            </div>
        );
    }

    return (
        <div className={"GridColumn"}>
            <div>
                <div
                    style={{
                        height: headerHeight,
                        width: scrollbarPresence.vertical ? width - scrollbarSize() : width,
                    }}>
                    <Grid
                        className={"HeaderGrid"}
                        columnCount={days.length + 1}
                        height={headerHeight}
                        overscanColumnCount={overScanColumnCount}
                        cellRenderer={(props) => {
                            const rowIndex = props.rowIndex;

                            const column = columns[rowIndex]

                            return _renderHeaderCell({...props, days, format,column})
                        }}
                        rowHeight={headerHeight}
                        rowCount={1}
                        scrollLeft={scrollLeft}
                        width={scrollbarPresence.vertical ? width - scrollbarSize() : width}
                        columnWidth={({index}) => {
                            if (index === 0) {
                                return sidebarWidth;
                            }
                            return columnWidth
                        }}
                    />
                </div>
                <div
                    style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        height: height - headerHeight,
                        width: width,
                    }}>
                    <Grid
                        className={"BodyGrid"}
                        columnCount={days.length + 1}
                        height={height - headerHeight}
                        onScroll={onScroll}
                        overscanColumnCount={overScanColumnCount}
                        overscanRowCount={overScanRowCount}

                        ref={(props: any) => {
                            if (props?._scrollingContainer)
                                scrollContainer.ref(props?._scrollingContainer)
                        }}

                        cellRenderer={(props) => {
                            const rowIndex = props.rowIndex + 1;

                            const column = columns[rowIndex]

                            if (column.type === "HEADER") {
                                return _renderHeaderCell({ ...props,column, format, days});
                            }

                            const day = days[props.columnIndex];
                            const items = column?.events?.[day] || [];

                            return _renderBodyCell({...props, day, items, column});

                        }}

                        rowHeight={({index}) => {
                            const rowIndex = index + 1;

                            if (columns[rowIndex].type === "HEADER") {
                                return headerHeight;
                            }

                            return rowHeight;
                        }
                        }
                        rowCount={columns.length - 1 >= 0 ? columns.length - 1 : 0}
                        width={width}
                        columnWidth={({index}) => {
                            if (index === 0) {
                                return sidebarWidth;
                            }
                            return columnWidth
                        }}
                        onScrollbarPresenceChange={(params: ScrollbarPresenceParams) => {
                            setScrollbarPresence(params)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}